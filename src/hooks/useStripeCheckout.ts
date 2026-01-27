// import { useState } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import { supabase } from "@/integrations/supabase/client";
// import { STRIPE_PUBLISHABLE_KEY } from "@/lib/stripe";
// import { toast } from "sonner";

// interface CheckoutItem {
//   name: string;
//   price: number;
//   quantity: number;
//   image?: string;
// }

// interface UseStripeCheckoutOptions {
//   onSuccess?: () => void;
//   onError?: (error: string) => void;
// }

// export const useStripeCheckout = (options: UseStripeCheckoutOptions = {}) => {
//   const [loading, setLoading] = useState(false);

//   const initiateCheckout = async (
//     items: CheckoutItem[],
//     orderId: string,
//     customerEmail?: string
//   ) => {
//     if (!STRIPE_PUBLISHABLE_KEY) {
//       toast.error("Stripe is not configured properly");
//       return;
//     }

//     setLoading(true);

//     try {
//       const { data, error } = await supabase.functions.invoke(
//         "create-checkout-session",
//         {
//           body: {
//             items,
//             orderId,
//             customerEmail,
//             successUrl: `${window.location.origin}/orders/${orderId}?payment=success`,
//             cancelUrl: `${window.location.origin}/checkout?payment=cancelled`,
//           },
//         }
//       );

//       if (error) throw error;

//       if (data?.url) {
//         // Redirect to Stripe Checkout
//         window.location.href = data.url;
//       }

//       options.onSuccess?.();
//     } catch (error: unknown) {
//       console.error("Stripe checkout error:", error);
//       const errorMessage = error instanceof Error ? error.message : "Failed to initiate payment";
//       toast.error(errorMessage);
//       options.onError?.(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     initiateCheckout,
//     loading,
//   };
// };


import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { STRIPE_PUBLISHABLE_KEY } from "@/lib/stripe";
import { toast } from "sonner";

interface CheckoutItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface UseStripeCheckoutOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useStripeCheckout = (options: UseStripeCheckoutOptions = {}) => {
  const [loading, setLoading] = useState(false);

  const redirectToCheckout = (url: string) => {
    // In Lovable preview the app runs inside an iframe; navigating within the iframe
    // can appear "stuck". Try to navigate the top window, then fallback to new tab.
    try {
      if (window.top && window.top !== window.self) {
        window.top.location.href = url;
        return;
      }

      window.location.href = url;
    } catch {
      const opened = window.open(url, "_blank", "noopener,noreferrer");
      if (!opened) {
        toast.error("Unable to open Stripe checkout. Please allow pop-ups and try again.");
      }
    }
  };

  const initiateCheckout = async (
    items: CheckoutItem[],
    orderId: string,
    customerEmail?: string
  ) => {
    if (!STRIPE_PUBLISHABLE_KEY) {
      toast.error("Stripe is not configured properly");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke(
        "create-checkout-session",
        {
          body: {
            items,
            orderId,
            customerEmail,
            successUrl: `${window.location.origin}/orders/${orderId}?payment=success`,
            cancelUrl: `${window.location.origin}/checkout?payment=cancelled`,
          },
        }
      );

      if (error) throw error;

      if (!data?.url) {
        throw new Error("Stripe checkout URL was not returned");
      }

      redirectToCheckout(data.url);

      options.onSuccess?.();
    } catch (error: unknown) {
      console.error("Stripe checkout error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to initiate payment";
      toast.error(errorMessage);
      options.onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    initiateCheckout,
    loading,
  };
};

