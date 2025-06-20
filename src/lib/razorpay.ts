// Razorpay integration service
declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature: string;
  razorpay_subscription_id?: string;
}

export const RAZORPAY_KEY_ID = "rzp_test_5Gr07DWc1NdDc9";

// Plan IDs for different SIP amounts (monthly subscription plans)
export const PLAN_IDS = {
  100: "plan_Qh8r9nUPEt3Dbv",
  200: "plan_Qh8s8EzXQr7DXu", 
  500: "plan_QhlbDG7RIgx5Ov", 
  1000: "plan_QhlcT03kYhZf6v"
} as const;

interface RazorpayOptions {
  key: string;
  amount?: number;
  currency?: string;
  name: string;
  description?: string;
  order_id?: string;
  subscription_id?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  handler?: (response: any) => void;
}

// API URLs - use Netlify Functions in production
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/.netlify/functions'
  : '/api';

/**
 * Loads the Razorpay checkout script
 * @returns Promise that resolves to true if script loaded successfully
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      return resolve(true);
    }
    
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

/**
 * Initializes a one-time payment through Razorpay
 * This creates an order on the server and opens the Razorpay checkout
 * 
 * @param amount - The payment amount
 * @param currency - The currency, defaults to INR
 * @param name - Customer's name
 * @param description - Payment description
 * @param prefill - Prefill data for Razorpay checkout
 * @param notes - Additional notes for the payment
 * @param theme - Razorpay checkout theme
 * @param handler - Callback handler for Razorpay response
 */
export const initializePayment = async ({
  amount,
  currency = "INR",
  name,
  description,
  prefill,
  notes = {},
  theme,
  handler
}: {
  amount: number;
  currency?: string;
  name: string;
  description?: string;
  prefill?: RazorpayOptions["prefill"];
  notes?: Record<string, string>;
  theme?: RazorpayOptions["theme"];
  handler?: (response: any) => void;
}): Promise<void> => {
  try {
    // Create order
    const orderResponse = await fetch(`${API_URL}/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        currency,
        notes: {
          ...notes,
          payment_type: "one_time"
        }
      })
    });

    const orderData = await orderResponse.json();
    if (!orderData.success) throw new Error(orderData.error);

    // Initialize Razorpay
    const options: RazorpayOptions = {
      key: RAZORPAY_KEY_ID,
      amount: amount * 100, // Convert to paise
      currency,
      name,
      description,
      order_id: orderData.order.id,
      prefill,
      notes,
      theme: theme || { color: "#059669" },
      handler
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error('Payment initialization failed:', error);
    throw error;
  }
};

/**
 * Initializes a recurring payment (SIP) through Razorpay
 * This gets the plan ID, creates a subscription, and opens the Razorpay checkout
 * 
 * @param amount - The monthly SIP amount
 * @param currency - The currency, defaults to INR
 * @param name - Customer's name
 * @param description - Payment description
 * @param prefill - Prefill data for Razorpay checkout
 * @param notes - Additional notes for the payment
 * @param theme - Razorpay checkout theme
 * @param handler - Callback handler for Razorpay response
 */
export const initializeRecurringPayment = async ({
  amount,
  currency = "INR",
  name,
  description,
  prefill,
  notes = {},
  theme,
  handler
}: {
  amount: number;
  currency?: string;
  name: string;
  description?: string;
  prefill?: RazorpayOptions["prefill"];
  notes?: Record<string, string>;
  theme?: RazorpayOptions["theme"];
  handler?: (response: any) => void;
}): Promise<void> => {
  try {
    // Get plan ID
    const planId = await getSubscriptionPlanId(amount);

    // Create subscription
    const subscription = await prepareSipSubscription(
      planId,
      {
        name: prefill?.name || name,
        email: prefill?.email || "",
        contact: prefill?.contact
      },
      notes
    );

    // Initialize Razorpay
    const options: RazorpayOptions = {
      key: RAZORPAY_KEY_ID,
      subscription_id: subscription.id,
      name,
      description: description || `Monthly SIP Donation (₹${amount}/month)`,
      prefill,
      notes: {
        ...notes,
        monthly_amount: String(amount),
        payment_type: "recurring_sip"
      },
      theme: theme || { color: "#059669" },
      handler
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error('Subscription initialization failed:', error);
    throw error;
  }
};

/**
 * Gets the appropriate subscription plan ID based on the amount
 * This calls our backend API to find the right plan ID
 * 
 * @param amount - The subscription amount
 * @param currency - The currency, defaults to INR
 * @returns Promise with the plan ID
 */
export const getSubscriptionPlanId = async (
  amount: number | string,
  currency: string = "INR"
): Promise<string> => {
  try {
    // Convert amount to number if it's a string
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error(`Invalid subscription amount: ${amount}`);
    }
      console.log(`Finding plan ID for amount: ₹${numAmount}`);
      // API URL - Using proxy to Supabase Edge Function
    const apiUrl = '/api';
    
    try {
      // Call the Edge Function to get the plan ID
      const response = await fetch(`${apiUrl}/get-plan-id?amount=${numAmount}`);
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to get plan ID");
      }
      
      console.log(`Edge Function returned plan ID: ${result.planId} for amount: ₹${result.amount}`);
      
      return result.planId;
    } catch (apiError) {
      console.error("API error getting plan ID:", apiError);
      
      // Fallback to local implementation if server is not available
      console.warn("Falling back to local plan ID lookup due to API error");
      
      // Valid amounts for SIP plans
      const validAmounts = Object.keys(PLAN_IDS).map(Number);
      
      // Find the exact match or closest match
      let exactMatch = false;
      let matchedAmount: number = validAmounts[validAmounts.length - 1]; // Default to highest amount
      
      // Try to find an exact match first
      for (const validAmount of validAmounts) {
        if (Math.abs(numAmount - validAmount) < 1) {
          matchedAmount = validAmount;
          exactMatch = true;
          break;
        }
      }
      
      // If no exact match, find the closest valid amount
      if (!exactMatch) {
        let minDiff = Number.MAX_VALUE;
        for (const validAmount of validAmounts) {
          const diff = Math.abs(numAmount - validAmount);
          if (diff < minDiff) {
            minDiff = diff;
            matchedAmount = validAmount;
          }
        }
        
        console.log(`No exact plan match for amount ₹${numAmount}, using closest plan for ₹${matchedAmount}`);
      } else {
        console.log(`Found exact plan match for amount ₹${matchedAmount}`);
      }
      
      // Get the plan ID from our mapping
      const planId = PLAN_IDS[matchedAmount as keyof typeof PLAN_IDS];
      
      if (!planId) {
        throw new Error(`No plan found for amount ₹${matchedAmount}`);
      }
      
      console.log(`Using subscription plan ID: ${planId} for amount ₹${matchedAmount}`);
      
      return planId;
    }
  } catch (error) {
    console.error("Error finding subscription plan:", error);
    throw new Error(`Failed to find subscription plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Creates a SIP (recurring) subscription through our backend API
 * This calls our backend server which communicates with Razorpay API
 * 
 * @param planId - The Razorpay plan ID to use for this subscription
 * @param customerDetails - Customer information 
 * @param notes - Additional notes for the subscription
 * @returns Promise with an object containing the subscription information
 */
export const prepareSipSubscription = async (
  planId: string,
  customerDetails: {
    name: string;
    email: string;
    contact?: string;
  },
  notes: Record<string, string> = {}
): Promise<{ 
  id: string,
  planId: string,
  customerName: string,
  customerEmail: string,
  status?: string
}> => {
  console.log("Preparing SIP subscription with plan:", planId);
  console.log("Customer details:", customerDetails);

  try {
    // Validate inputs
    if (!planId) {
      throw new Error("Plan ID is required");
    }
    
    if (!customerDetails.name || !customerDetails.email) {
      throw new Error("Customer name and email are required");
    }
    
    // Prepare subscription data for the API call
    const subscriptionData = {
      planId,
      customerDetails,
      notes: {
        "donor_name": customerDetails.name,
        "donor_email": customerDetails.email,
        "donation_type": "monthly_sip",
        ...notes
      }
    };
      console.log("Calling Edge Function to create subscription with data:", subscriptionData);
      // API URL - Using proxy to Supabase Edge Function
    const apiUrl = '/api';
      try {      // Call our Edge Function to create the subscription
      const response = await fetch(`${apiUrl}/create-subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseInt(planId.split('_')[1]),
          planId: planId,
          customerDetails: {
            name: customerDetails.name,
            email: customerDetails.email,
            contact: customerDetails.contact || ""
          },
          notes: subscriptionData.notes
        })
      });
      
      let result;
      
      try {
        const textResponse = await response.text(); // Get response as text first
        console.log("Edge Function response text:", textResponse);
        
        // Try to parse the response as JSON
        result = textResponse ? JSON.parse(textResponse) : {};
      } catch (parseError) {
        console.error("Error parsing Edge Function response:", parseError);
        throw new Error(`Invalid API response: ${parseError.message}`);
      }
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to create subscription");
      }
      
      console.log("Subscription created successfully:", result.subscription);
      
      return {
        id: result.subscription.id,
        planId: planId,
        customerName: customerDetails.name,
        customerEmail: customerDetails.email,
        status: result.subscription.status
      };
    } catch (apiError) {
      console.error("API error creating subscription:", apiError);
      
      // For development/testing - fallback to dummy subscription ID if server is not available
      // In production, you would remove this fallback
      if (process.env.NODE_ENV !== 'production') {
        console.warn("Using fallback test subscription ID due to API error");
        return {
          id: `sub_${Date.now().toString().substring(0, 10)}`,
          planId,
          customerName: customerDetails.name,
          customerEmail: customerDetails.email,
          status: "created"
        };
      } else {
        throw apiError;
      }
    }
  } catch (error) {
    console.error("Error preparing subscription:", error);
    throw new Error("Failed to prepare subscription: " + (error instanceof Error ? error.message : "Unknown error"));
  }
};

/**
 * Verify payment on the server
 * This should be called after a payment is made to verify its status
 * 
 * @param paymentData - The payment data from Razorpay
 * @returns Promise that resolves to true if the payment is valid, false otherwise
 */
export const verifyPayment = async (paymentData: {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error verifying payment:', error);
    return false;
  }
};
