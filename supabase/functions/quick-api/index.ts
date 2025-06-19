import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as Razorpay from "https://esm.sh/razorpay@2.9.2";

// Plan IDs for different SIP amounts (monthly subscription plans)
const PLAN_IDS = {
  100: "plan_Qh8r9nUPEt3Dbv",
  200: "plan_Qh8s8EzXQr7DXu", 
  500: "plan_QhlbDG7RIgx5Ov", 
  1000: "plan_QhlcT03kYhZf6v"
};

// Initialize Razorpay
const initRazorpay = () => {
  const key_id = Deno.env.get("RAZORPAY_KEY_ID");
  const key_secret = Deno.env.get("RAZORPAY_KEY_SECRET");
  
  if (!key_id || !key_secret) {
    throw new Error("Razorpay API keys not found in environment variables");
  }
  
  return new Razorpay.default({
    key_id,
    key_secret
  });
};

// CORS headers for all responses
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, content-length",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

// Handler for HTTP requests
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    const url = new URL(req.url);
    const path = url.pathname.split("/quick-api")[1] || "/";
    
    console.log(`Processing request: ${req.method} ${path}`);
    
    // Get Plan ID endpoint
    if (path === "/get-plan-id" && req.method === "GET") {
      return await handleGetPlanId(req);
    }
    
    // Create Subscription endpoint
    if (path === "/create-subscription" && req.method === "POST") {
      return await handleCreateSubscription(req);
    }
    
    // Health check endpoint
    if (path === "/health" || path === "/" || path === "") {
      return new Response(
        JSON.stringify({
          status: "ok",
          timestamp: new Date().toISOString(),
          env: "production"
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200
        }
      );
    }
    
    // 404 for any other paths
    return new Response(
      JSON.stringify({ error: "Not found" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }, 
        status: 404
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }, 
        status: 500
      }
    );
  }
});

// Handle get-plan-id requests
async function handleGetPlanId(req) {
  try {
    const url = new URL(req.url);
    const amount = url.searchParams.get("amount");
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Valid amount is required" 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }, 
          status: 400
        }
      );
    }
    
    const numAmount = parseFloat(amount);
    const validAmounts = Object.keys(PLAN_IDS).map(Number);
    
    // Find exact match or closest match
    let exactMatch = false;
    let matchedAmount = validAmounts[validAmounts.length - 1]; // Default to highest amount
    
    // Try to find an exact match first
    for (const validAmount of validAmounts) {
      if (Math.abs(numAmount - validAmount) < 1) {
        matchedAmount = validAmount;
        exactMatch = true;
        break;
      }
    }
    
    // If no exact match, find closest valid amount
    if (!exactMatch) {
      let minDiff = Number.MAX_VALUE;
      for (const validAmount of validAmounts) {
        const diff = Math.abs(numAmount - validAmount);
        if (diff < minDiff) {
          minDiff = diff;
          matchedAmount = validAmount;
        }
      }
    }
    
    const planId = PLAN_IDS[matchedAmount];
    
    if (!planId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `No plan found for amount ₹${matchedAmount}` 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }, 
          status: 404
        }
      );
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        planId,
        amount: matchedAmount
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }, 
        status: 200
      }
    );
  } catch (error) {
    console.error("Error getting plan ID:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to get plan ID" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }, 
        status: 500
      }
    );
  }
}

// Handle create-subscription requests
async function handleCreateSubscription(req) {
  try {
    const razorpay = initRazorpay();
    const data = await req.json();
    
    console.log("Received subscription request:", data);
    
    const { planId, customerDetails, notes = {} } = data;
    
    if (!planId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Plan ID is required" 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }, 
          status: 400
        }
      );
    }

    if (!customerDetails || !customerDetails.name || !customerDetails.email) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Customer name and email are required" 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }, 
          status: 400
        }
      );
    }
    
    // Create a new subscription
    const subscriptionOptions = {
      plan_id: planId,
      customer_notify: 1,
      total_count: 12, // 12 months subscription
      notes: {
        donor_name: customerDetails.name,
        donor_email: customerDetails.email,
        donation_type: "monthly_sip",
        ...notes
      }
    };
    
    console.log("Creating subscription with options:", subscriptionOptions);
    
    // Create the subscription using Razorpay API
    const subscription = await razorpay.subscriptions.create(subscriptionOptions);
    
    console.log("Subscription created:", subscription);
    
    return new Response(
      JSON.stringify({
        success: true,
        subscription: {
          id: subscription.id,
          planId: subscription.plan_id,
          status: subscription.status,
          customerName: customerDetails.name,
          customerEmail: customerDetails.email
        }
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }, 
        status: 200
      }
    );
  } catch (error) {
    console.error("Error creating subscription:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to create subscription" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }, 
        status: 500
      }
    );
  }
}
