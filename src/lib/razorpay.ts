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

// We're going to use ONE known working plan for testing
// This ensures we're using a plan that definitely exists in your test account
const TEST_PLAN_ID = "plan_Qh8sddf7VZG4t7"; // Plan for ₹500 SIP

// For testing with known working data
// Razorpay has a special subscription ID for testing subscription flow
const TEST_SUBSCRIPTION_ID = "sub_00000000000001"; 

/**
 * IMPORTANT NOTE ABOUT SUBSCRIPTION IDs:
 * 
 * In a proper production implementation:
 * 1. Subscription IDs must be unique for each customer and subscription
 * 2. Subscriptions should be created on your backend server via Razorpay's API
 * 3. The backend would call the Razorpay Subscriptions API to create a subscription
 * 4. The API returns a unique subscription ID which is then used in the frontend
 * 
 * For testing purposes:
 * - We're using a special test subscription ID (sub_00000000000001) supported by Razorpay
 * - This helps test the subscription flow without requiring a backend server
 * - In a real app with real money, this approach will NOT work
 * - You must implement proper server-side subscription creation
 */

// For production, you would use different plans for different amounts
const PLAN_IDS = {
  100: "plan_Qh8r9nUPEt3Dbv",
  200: "plan_Qh8s8EzXQr7DXu", 
  500: "plan_Qh8sddf7VZG4t7", // We'll use this one for testing
  1000: "plan_Qh8t3Lof5U3BjD"
};

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
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  razorpay_subscription_id?: string;
}

export interface SubscriptionOptions {
  plan_id?: string;
  customer_id?: string;
  total_count?: number;
  quantity?: number;
  start_at?: number;
  addons?: Array<{
    item: {
      name: string;
      amount: number;
      currency: string;
    };
  }>;
  notes?: Record<string, string>;
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      return resolve(true);
    }
    
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

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
    
    // For subscriptions, subscription_id is required
    if (finalOptions.subscription_id) {
      // Make sure we have the minimum required fields for subscriptions
      if (!finalOptions.name) {
        throw new Error("Name is required for subscription checkout");
      }
      console.log("Creating Razorpay instance with subscription ID:", finalOptions.subscription_id);
      
      // For subscriptions, we should not include amount and currency as they're defined in the plan
      delete finalOptions.amount;
      delete finalOptions.currency;
      
      // Validate subscription ID format - it should start with 'sub_'
      if (!finalOptions.subscription_id.startsWith('sub_')) {
        console.warn("Warning: Subscription ID may not be in the expected format. It should start with 'sub_'");
      }
    } else {
      // For one-time payments, amount and currency are required
      if (!finalOptions.amount || !finalOptions.currency || !finalOptions.name) {
        throw new Error("Required fields missing for one-time payment checkout");
      }
      
      // Ensure amount is a number (Razorpay requires amount in paise/smallest currency unit)
      if (typeof finalOptions.amount !== 'number') {
        finalOptions.amount = parseFloat(String(finalOptions.amount));
      }
      
      // Ensure amount is in paise (smallest currency unit)
      // Razorpay expects amount in paise for INR
      if (finalOptions.amount % 1 !== 0 && finalOptions.currency === 'INR') {
        finalOptions.amount = Math.round(finalOptions.amount * 100);
      }
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

    // In production, you would typically:
    // 1. Make an API call to your backend to create an order
    // 2. Get the order_id from the backend
    // 3. Pass the order_id to Razorpay

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
    
    // Ensure it's converted to paise (smallest currency unit for INR)
    const amountInPaise = Math.round(finalAmount * 100);
    
    // For now, we'll proceed with a direct checkout without server involvement
    const options: RazorpayOptions = {
      key: RAZORPAY_KEY_ID,
      amount: amountInPaise, // in paise
      currency,
      name,
      description,
      prefill,
      notes,
      theme: theme || { color: "#F59E0B" }, // amber-500
      modal: {
        ondismiss: onDismiss
      },
      handler: handler
    };

    console.log("Razorpay one-time payment options:", JSON.stringify(options, null, 2));

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

// Function to create a subscription plan on the server
// In a real application, this would be a server-side API call to Razorpay
export const createSubscriptionPlan = async (
  amount: number,
  currency: string = "INR",
  interval: "weekly" | "monthly" | "yearly" = "monthly",
  name: string = "Monthly Donation"
): Promise<{ id: string }> => {
  // In a real implementation, this would be a server-side call to:
  // POST https://api.razorpay.com/v1/plans
  // with the following request body:
  // {
  //   "period": interval,
  //   "interval": 1,
  //   "item": {
  //     "name": name,
  //     "amount": amount * 100,
  //     "currency": currency
  //   }
  // }
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Convert amount to number if it's a string
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    // Round to nearest valid amount for plan lookup
    const validAmounts = [100, 200, 500, 1000];
    let exactMatch = false;
    let closestAmount = 1000; // Default to highest amount
    
    // Try to find an exact match first
    for (const validAmount of validAmounts) {
      if (Math.abs(numAmount - validAmount) < 1) {
        closestAmount = validAmount;
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
          closestAmount = validAmount;
        }
      }
    }
    
    // Get the plan ID from our mapping
    const planId = PLAN_IDS[closestAmount as keyof typeof PLAN_IDS];
    
    if (!planId) {
      throw new Error(`No plan found for amount ₹${closestAmount}`);
    }
    
    if (exactMatch) {
      console.log(`Using pre-configured plan for ₹${closestAmount}: ${planId}`);
    } else {
      console.log(`No exact plan match for amount ₹${numAmount}, using closest plan for ₹${closestAmount}: ${planId}`);
    }
    
    console.log("Using subscription plan:", {
      id: planId,
      amount: closestAmount,
      originalAmount: numAmount,
      currency,
      interval,
      name
    });
    
    return { id: planId };
  } catch (error) {
    console.error("Error creating subscription plan:", error);
    throw new Error("Failed to create subscription plan");
  }
};

// Function to create a subscription on the server
// In a real application, this would be a server-side API call to Razorpay
export const createSubscription = async (
  planId: string,
  customerDetails: {
    name: string;
    email: string;
    contact?: string;
  },
  notes: Record<string, string> = {},
  forceTestMode: boolean = false
): Promise<{ id: string }> => {
  console.log("Creating subscription with plan:", planId);
  console.log("Customer details:", customerDetails);

  try {
    // IMPORTANT: In a production environment, you MUST create subscriptions on your backend server!
    // This client-side implementation is for development/testing purposes only
    
    const subscriptionData = {
      plan_id: planId,
      customer_notify: 1,
      total_count: 12, // 12 months subscription
      notes: {
        "Donor Name": customerDetails.name,
        "Email": customerDetails.email,
        ...notes
      }
    };
    
    console.log("Creating subscription with data:", subscriptionData);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real-world scenario:
    // 1. We'd make an API call to our backend
    // 2. Backend would create the subscription in Razorpay
    // 3. Backend would return the subscription ID
    //
    // const response = await fetch('/api/create-subscription', {
    //    method: 'POST',
    //    headers: { 'Content-Type': 'application/json' },
    //    body: JSON.stringify({
    //      plan_id: planId,
    //      full_name: customerDetails.name,
    //      email: customerDetails.email,
    //      phone_number: customerDetails.contact || '',
    //      ...notes
    //    })
    //  });
    //  const data = await response.json();
    //  return { id: data.id };
    
    // For controlled development/testing environment:
    if (forceTestMode) {
      // Special test subscription ID provided by Razorpay for testing subscription flow
      // This ID is specially handled by Razorpay's test environment and doesn't need to be unique      console.log("Using Razorpay's test subscription ID:", TEST_SUBSCRIPTION_ID);
      return { id: TEST_SUBSCRIPTION_ID };    } else {
      /**
       * IMPORTANT: This is for demonstration purposes only
       * 
       * In a real application:
       * 1. You would make a server API call to create the subscription
       * 2. Your server would use Razorpay's API to create the subscription
       * 3. Your server would return the unique subscription ID
       * 
       * Client-side generated subscription IDs will NOT work with real Razorpay payments
       * This is because Razorpay needs to verify the subscription exists in their system
       */
      
      // Generate a unique ID that follows Razorpay's format (starts with sub_)
      // NOTE: This is for UI demonstration only and WON'T work for real payments
      const uniqueSubscriptionId = `sub_${Date.now().toString(36).substring(2, 8)}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      console.log("Generated unique subscription ID for demo:", uniqueSubscriptionId);
      
      // Add a warning about the limitations of this approach
      console.warn("⚠️ WARNING: This is a client-side generated subscription ID");
      console.warn("⚠️ This will NOT work with real Razorpay subscriptions");
      console.warn("⚠️ In production, subscriptions MUST be created through your backend server using Razorpay's API");
      console.warn("⚠️ Consider setting useTestMode=true or implementing a proper backend");
      
      // Display a more prominent warning in the console
      console.log("%c ⚠️ CLIENT-SIDE SUBSCRIPTION CREATION NOT RECOMMENDED ⚠️ ", "background: #ff5757; color: white; font-size: 16px; font-weight: bold;");
      
      return { id: uniqueSubscriptionId };
    }
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw new Error("Failed to create subscription: " + (error instanceof Error ? error.message : "Unknown error"));
  }
};

// Initialize a recurring payment using Razorpay subscriptions
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
  useTestMode = true  // Default to using Razorpay's special test subscription ID
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
  useTestMode?: boolean;
}): Promise<void> => {
  try {
    console.log("Initializing recurring payment with:", { amount, currency, name, prefill });
    
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      throw new Error("Failed to load Razorpay SDK");
    }

    // For consistent testing, always use ₹500 plan (this should match a plan in your Razorpay account)
    const displayAmount = 500; 
    const planId = TEST_PLAN_ID;
    
    console.log(`Using test SIP plan: ${planId} (₹${displayAmount})`);
    
    // Create a subscription with the appropriate mode
    const subscription = await createSubscription(
      planId,
      {
        name: prefill?.name || name,
        email: prefill?.email || "",
        contact: prefill?.contact
      },
      notes,
      useTestMode  // Pass the test mode flag to use Razorpay's special test ID if true
    );
    
    console.log("Subscription created:", subscription);
    
    // Configure Razorpay checkout with the subscription ID
    const options: RazorpayOptions = {
      key: RAZORPAY_KEY_ID,
      subscription_id: subscription.id,
      name: name,
      description: `Monthly SIP Donation (₹${displayAmount}/month)`,
      prefill,
      notes: {
        ...notes,
        test_mode: useTestMode ? "yes" : "no",
        monthly_amount: String(displayAmount),
        sip_plan_id: planId
      },
      theme: theme || { color: "#F59E0B" },
      modal: {
        ondismiss: onDismiss
      },
      handler: handler
    };
    
    // Add debug info for troubleshooting
    console.log("Razorpay checkout options:", JSON.stringify(options, null, 2));
    console.log(`Using subscription ID: ${subscription.id} (${useTestMode ? "test mode" : "unique ID mode"})`);

    // Create and open the Razorpay checkout
    const razorpay = createRazorpayInstance(options);
    if (!razorpay) {
      throw new Error("Failed to create Razorpay instance");
    }
    
    console.log("Opening Razorpay checkout for subscription...");
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
