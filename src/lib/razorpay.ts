// Razorpay integration service
declare global {
  interface Window {
    Razorpay: any;
  }
}

// In a real app, these values would be environment variables
// This is a test API key - do not use in production
// In production, store this securely in environment variables
const RAZORPAY_KEY_ID = "rzp_test_5Gr07DWc1NdDc9";
const RAZORPAY_SECRET_KEY = "qm2Ze9AEhjKjBr0e1tKArHYr"; // Only used on server side

// Plan IDs for different SIP amounts (monthly subscription plans)
// These should match existing plans in your Razorpay account
const PLAN_IDS = {
  100: "plan_Qh8r9nUPEt3Dbv",
  200: "plan_Qh8s8EzXQr7DXu", 
  500: "plan_QhlbDG7RIgx5Ov", 
  1000: "plan_QhlcT03kYhZf6v"
};

/**
 * Razorpay checkout options interface
 * Based on the official Razorpay documentation
 */
export interface RazorpayOptions {
  key: string;
  amount?: number; // in smallest currency unit (paise for INR), required for one-time payments
  currency?: string; // required for one-time payments
  name: string;
  description?: string;
  order_id?: string; // Obtained from server for one-time payments
  subscription_id?: string; // For recurring payments
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
  handler?: (response: RazorpayResponse) => void;
  retry?: {
    enabled?: boolean;
    max_count?: number;
  };
  readonly?: {
    email?: boolean;
    contact?: boolean;
  };
  hidden?: {
    contact?: boolean;
    email?: boolean;
  };
  send_sms_hash?: boolean;
  remember_customer?: boolean;
}

/**
 * Razorpay payment response interface
 * Includes both one-time and subscription payment responses
 */
export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  razorpay_subscription_id?: string;
}

/**
 * Options for creating a subscription
 * Based on Razorpay's API documentation
 */
export interface SubscriptionOptions {
  plan_id: string;
  customer_id?: string;
  total_count?: number;
  quantity?: number;
  start_at?: number;
  expire_by?: number;
  customer_notify?: number;
  addons?: Array<{
    item: {
      name: string;
      amount: number;
      currency: string;
    };
  }>;
  notes?: Record<string, string>;
  offer_id?: string;
}

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
};

/**
 * Creates a Razorpay checkout instance
 * @param options - The checkout configuration options
 * @returns A Razorpay checkout instance
 */
export const createRazorpayInstance = (options: RazorpayOptions) => {
  if (!window.Razorpay) {
    console.error("Razorpay SDK is not loaded");
    throw new Error("Razorpay SDK not loaded. Please check your internet connection and try again.");
  }
  
  try {
    // Make a deep copy of the options to avoid modifying the original
    const finalOptions = JSON.parse(JSON.stringify(options));
    
    // Validate required fields to prevent API errors
    if (!finalOptions.key) {
      throw new Error("Razorpay key is missing");
    }
    
    // Handle subscription checkout
    if (finalOptions.subscription_id) {
      // Make sure we have the minimum required fields for subscriptions
      if (!finalOptions.name) {
        throw new Error("Name is required for subscription checkout");
      }
      console.log("Creating Razorpay instance with subscription ID:", finalOptions.subscription_id);
      
      // For subscriptions, we should not include amount and currency as they're defined in the plan
      delete finalOptions.amount;
      delete finalOptions.currency;
    } 
    // Handle one-time payment checkout
    else {
      // For one-time payments, amount and currency are required
      if (!finalOptions.amount || !finalOptions.currency || !finalOptions.name) {
        throw new Error("Required fields missing for one-time payment checkout");
      }
      
      // Ensure amount is a number
      if (typeof finalOptions.amount !== 'number') {
        finalOptions.amount = parseFloat(String(finalOptions.amount));
      }
      
      // Ensure amount is in paise (smallest currency unit)
      // Razorpay expects amount in paise for INR
      if (finalOptions.amount % 1 !== 0 && finalOptions.currency === 'INR') {
        finalOptions.amount = Math.round(finalOptions.amount * 100);
      }
    }
    
    // Add better retry options
    if (!finalOptions.retry) {
      finalOptions.retry = {
        enabled: true,
        max_count: 3
      };
    }
    
    // Enable customer data remembering for better UX
    if (finalOptions.prefill && finalOptions.prefill.email) {
      finalOptions.remember_customer = true;
    }
    
    console.log("Final Razorpay options:", finalOptions);
    
    try {
      return new window.Razorpay(finalOptions);
    } catch (razorpayError) {
      console.error("Razorpay instance creation failed:", razorpayError);
      throw new Error("Failed to initialize payment: " + 
        (razorpayError instanceof Error ? razorpayError.message : "Unknown error"));
    }
  } catch (error) {
    console.error("Error configuring Razorpay:", error);
    throw error;
  }
};

/**
 * Initialize a one-time payment using Razorpay checkout
 * 
 * @param options - Configuration for the one-time payment
 * @returns Promise that resolves when the checkout is opened
 */
export const initializePayment = async ({
  amount,
  currency = "INR",
  name,
  description,
  prefill,
  notes,
  theme,
  handler,
  onDismiss
}: {
  amount: number;
  currency?: string;
  name: string;
  description?: string;
  prefill?: RazorpayOptions["prefill"];
  notes?: RazorpayOptions["notes"];
  theme?: RazorpayOptions["theme"];
  handler?: (response: RazorpayResponse) => void;
  onDismiss?: () => void;
}): Promise<void> => {
  try {
    console.log("Initializing one-time payment with:", { amount, currency, name });
    
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      throw new Error("Failed to load Razorpay SDK");
    }
    
    // Ensure amount is a valid number
    let finalAmount: number;
    if (typeof amount === 'string') {
      finalAmount = parseFloat(amount);
      if (isNaN(finalAmount)) {
        throw new Error("Invalid amount");
      }
    } else {
      finalAmount = amount;
    }
    
    let orderId: string | undefined = undefined;
    
    try {
      // Create an order through our backend API
      const apiUrl = '/api';
      const orderResponse = await fetch(`${apiUrl}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          currency,
          notes: {
            ...notes,
            payment_type: "one_time",
            donor_name: prefill?.name,
            donor_email: prefill?.email
          }
        })
      });
      
      const orderResult = await orderResponse.json();
      
      if (!orderResponse.ok || !orderResult.success) {
        throw new Error(orderResult.error || "Failed to create order");
      }
      
      // Get the order ID from the response
      orderId = orderResult.order.id;
      console.log("Order created successfully:", { orderId, order: orderResult.order });
    } catch (orderError) {
      console.error("Error creating order:", orderError);
      console.warn("Continuing with direct payment without order ID (less secure)");
      // We'll continue without an order_id for development purposes
    }
    
    // Configure checkout options
    const options: RazorpayOptions = {
      key: RAZORPAY_KEY_ID,
      amount: orderId ? undefined : Math.round(finalAmount * 100), // in paise (only if no order_id)
      currency: orderId ? undefined : currency, // only if no order_id
      order_id: orderId,
      name,
      description,
      prefill,
      notes: {
        ...notes,
        payment_type: "one_time"
      },
      theme: theme || { color: "#F59E0B" }, // amber-500
      modal: {
        ondismiss: onDismiss
      },
      handler: handler,
      retry: {
        enabled: true,
        max_count: 3
      },
      remember_customer: true
    };

    console.log("Razorpay one-time payment options:", JSON.stringify(options, null, 2));

    // Create and open the Razorpay checkout
    const razorpay = createRazorpayInstance(options);
    if (razorpay) {
      console.log("Opening Razorpay checkout for one-time payment...");
      razorpay.open();
    } else {
      throw new Error("Failed to create Razorpay instance");
    }
  } catch (error) {
    console.error("Razorpay initialization failed:", error);
    // Re-throw the error so it can be handled by the caller
    throw error;
  }
};

// In a production app, you would verify the payment on your server
export const verifyPayment = async (paymentData: RazorpayResponse): Promise<boolean> => {
  // This would typically be a server call
  // For demo purposes, we'll just return true
  console.log("Payment data to verify:", paymentData);
  return true;
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
      // API URL - Using proxy
    const apiUrl = '/api';
    
    try {
      // Call our backend API to get the plan ID
      const response = await fetch(`${apiUrl}/get-plan-id?amount=${numAmount}`);
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to get plan ID");
      }
      
      console.log(`API returned plan ID: ${result.planId} for amount: ₹${result.amount}`);
      
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

// Function to create a subscription on the server
// In a real application, this would be a server-side API call to Razorpay
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
    
    console.log("Calling backend API to create subscription with data:", subscriptionData);
      // API URL - Using proxy, so we can just use /api directly
    const apiUrl = '/api';
    
    try {
      // Call our backend API to create the subscription
      const response = await fetch(`${apiUrl}/create-subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscriptionData)
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to create subscription");
      }
      
      console.log("Subscription created successfully:", result.subscription);
      
      return {
        id: result.subscription.id,
        planId: result.subscription.planId,
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
 * Initialize a recurring payment using Razorpay subscriptions
 * @param options - Configuration for the recurring payment
 * @returns Promise that resolves when the checkout is opened
 */
/**
 * Initializes a recurring monthly SIP donation payment
 * Uses Razorpay's subscription API with pre-configured plans
 * 
 * @param options - Configuration options for the recurring payment
 * @returns Promise that resolves when checkout is opened
 */
export const initializeRecurringPayment = async ({
  amount,
  currency = "INR",
  name,
  description,
  prefill,
  notes = {},
  theme,
  handler,
  onDismiss,
}: {
  amount: number;
  currency?: string;
  name: string;
  description?: string;
  prefill?: RazorpayOptions["prefill"];
  notes?: Record<string, string>;
  theme?: RazorpayOptions["theme"];
  handler?: (response: RazorpayResponse) => void;
  onDismiss?: () => void;
}): Promise<void> => {
  try {
    console.log("Initializing recurring payment with:", { amount, currency, name, prefill });
    
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      throw new Error("Failed to load Razorpay SDK");
    }

    // Find the appropriate plan ID for this amount
    const planId = await getSubscriptionPlanId(amount, currency);
    
    // For display purposes, use the original amount
    const displayAmount = amount;
    console.log(`Using SIP plan: ${planId} for amount: ₹${displayAmount}`);
    
    // Prepare a subscription (in production, this would create a real subscription via your backend)
    const subscription = await prepareSipSubscription(
      planId,
      {
        name: prefill?.name || name,
        email: prefill?.email || "",
        contact: prefill?.contact
      },
      notes
    );
    
    console.log("Subscription prepared:", subscription);
    
    // Configure Razorpay checkout with the appropriate options
    const options: RazorpayOptions = {
      key: RAZORPAY_KEY_ID,
      subscription_id: subscription.id,
      name: name,
      description: `Monthly SIP Donation (₹${displayAmount}/month)`,
      prefill,
      notes: {
        ...notes,
        monthly_amount: String(displayAmount),
        sip_plan_id: planId,
        payment_type: "recurring_sip"
      },
      theme: theme || { color: "#F59E0B" },
      modal: {
        ondismiss: onDismiss
      },
      handler: handler,
      remember_customer: true
    };
      // Add debug info for troubleshooting
    console.log("Razorpay checkout options:", JSON.stringify(options, null, 2));
    console.log(`Using subscription ID: ${subscription.id} for amount ₹${displayAmount}/month`);

    // Create and open the Razorpay checkout
    const razorpay = createRazorpayInstance(options);
    if (!razorpay) {
      throw new Error("Failed to create Razorpay instance");
    }
    
    console.log("Opening Razorpay checkout for monthly SIP donation...");
    razorpay.open();
  } catch (error) {
    console.error("Razorpay subscription initialization failed:", error);
    if (error instanceof Error) {
      console.error(`SIP payment error details: ${error.message}`);
      
      // Check for common errors
      if (error.message.includes("subscription_id")) {
        console.error("It appears there might be an issue with the subscription ID format or validation");
      }
    }
    throw error;
  }
};
