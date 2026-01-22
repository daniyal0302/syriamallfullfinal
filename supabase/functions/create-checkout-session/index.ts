import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("Stripe secret key not configured");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const { items, orderId, customerEmail, successUrl, cancelUrl } = await req.json();

    if (!items || items.length === 0) {
      throw new Error("No items provided");
    }

    const isHttpUrl = (value: unknown) => {
      if (typeof value !== "string") return false;
      try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    };

    // Create line items for Stripe
    // NOTE: Stripe requires absolute (http/https) image URLs. If we pass a relative/path-like value
    // it will fail session creation, so we only include valid URLs.
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: String(item.name ?? "Product"),
          images: isHttpUrl(item.image) ? [item.image] : [],
        },
        unit_amount: Math.round(Number(item.price || 0) * 100), // Convert to cents
      },
      quantity: Number(item.quantity || 1),
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl || `${req.headers.get("origin")}/orders/${orderId}?payment=success`,
      cancel_url: cancelUrl || `${req.headers.get("origin")}/checkout?payment=cancelled`,
      customer_email: customerEmail,
      metadata: {
        order_id: orderId,
      },
    });

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error("Error creating checkout session:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
