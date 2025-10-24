import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.10.0?target=deno";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const signature = req.headers.get("stripe-signature");
    const body = await req.text();

    if (!signature) {
      return new Response(
        JSON.stringify({ error: "No signature" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET") || ""
    );

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata.orderId;

        if (orderId) {
          await supabase
            .from("orders")
            .update({
              status: "in_progress",
              updated_at: new Date().toISOString(),
            })
            .eq("id", orderId);

          await supabase.from("order_messages").insert({
            order_id: orderId,
            sender_id: paymentIntent.metadata.buyerId,
            message: "Paiement confirmé. Le vendeur peut commencer à travailler sur votre commande.",
            is_system_message: true,
          });

          const { data: order } = await supabase
            .from("orders")
            .select("seller_id, service_id, services(title)")
            .eq("id", orderId)
            .single();

          if (order) {
            await supabase.from("notifications").insert({
              user_id: order.seller_id,
              type: "payment_received",
              title: "Paiement reçu",
              message: `Le paiement pour "${order.services?.title}" a été confirmé. Vous pouvez commencer la commande.`,
              link: `/orders/${orderId}`,
            });
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata.orderId;

        if (orderId) {
          await supabase
            .from("orders")
            .update({
              status: "cancelled",
              cancellation_reason: "Échec du paiement",
              updated_at: new Date().toISOString(),
            })
            .eq("id", orderId);

          await supabase.from("notifications").insert({
            user_id: paymentIntent.metadata.buyerId,
            type: "payment_failed",
            title: "Échec du paiement",
            message: "Le paiement de votre commande a échoué. Veuillez réessayer.",
            link: `/orders/${orderId}`,
          });
        }
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
