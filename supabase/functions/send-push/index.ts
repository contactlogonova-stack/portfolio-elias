// Deploy trigger - v1
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name } = await req.json();

    // Initialize Supabase client with Service Role Key to bypass RLS
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch all push subscriptions
    const { data: subscriptions, error: fetchError } = await supabaseClient
      .from("push_subscriptions")
      .select("subscription");

    if (fetchError) throw fetchError;

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ success: true, message: "No subscriptions found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Configure web-push
    const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY") ?? "";
    const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY") ?? "";
    const vapidSubject = "mailto:logonovaagency@gmail.com";

    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

    const notificationPayload = JSON.stringify({
      title: "📩 Nouveau message reçu",
      body: `${name} vous a envoyé un message`,
      url: "/admin/messages",
    });

    // Send notifications to all subscribers
    const sendPromises = subscriptions.map((sub: any) =>
      webpush.sendNotification(sub.subscription, notificationPayload).catch((err: any) => {
        console.error("Error sending push notification:", err);
        // If subscription is invalid/expired, we should ideally remove it
        if (err.statusCode === 410 || err.statusCode === 404) {
          // Optional: delete invalid subscription
        }
      })
    );

    await Promise.all(sendPromises);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in send-push function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
