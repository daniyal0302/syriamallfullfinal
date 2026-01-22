import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeSecretKey) {
      throw new Error("Stripe secret key not configured");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const signature = req.headers.get("stripe-signature");
    const body = await req.text();

    let event: Stripe.Event;

    // If webhook secret is configured, verify the signature
    if (stripeWebhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret);
      } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else {
      // For testing without webhook secret
      event = JSON.parse(body);
    }

    console.log("Received Stripe event:", event.type);

    // Initialize Supabase client with service role for admin access
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id;

      if (orderId) {
        console.log("Updating order:", orderId, "payment status to paid");

        // Update order payment status
        const { error: updateError } = await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            status: "processing",
          })
          .eq("id", orderId);

        if (updateError) {
          console.error("Error updating order:", updateError);
          throw updateError;
        }

        // Get the customer_id from the order to clear their cart
        const { data: order, error: orderError } = await supabase
          .from("orders")
          .select("customer_id")
          .eq("id", orderId)
          .single();

        if (!orderError && order?.customer_id) {
          // Clear the user's cart
          const { error: cartError } = await supabase
            .from("cart_items")
            .delete()
            .eq("user_id", order.customer_id);

          if (cartError) {
            console.error("Error clearing cart:", cartError);
          } else {
            console.log("Cart cleared for user:", order.customer_id);
          }
        }

        console.log("Order updated successfully");
      }
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id;

      if (orderId) {
        // Update order status to cancelled if payment expired
        await supabase
          .from("orders")
          .update({
            payment_status: "failed",
            status: "cancelled",
          })
          .eq("id", orderId)
          .eq("payment_status", "pending");
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
