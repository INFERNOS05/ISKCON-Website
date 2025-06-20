import { PLAN_IDS, RAZORPAY_KEY_ID } from '@/lib/razorpay';

// Type definitions
declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
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
  modal?: {
    ondismiss?: () => void;
  };
  handler?: (response: RazorpayResponse) => void;
  retry?: {
    enabled?: boolean;
    max_count?: number;
  };
  remember_customer?: boolean;
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  razorpay_subscription_id?: string;
}

// Load Razorpay Script
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

// Create Razorpay Instance
export const createRazorpayInstance = (options: RazorpayOptions) => {
  if (!window.Razorpay) {
    throw new Error("Razorpay SDK not loaded");
  }
  
  const finalOptions = {
    ...options,
    retry: {
      enabled: true,
      max_count: 3
    },
    theme: options.theme || { color: "#059669" } // emerald-600
  };

  return new window.Razorpay(finalOptions);
};

// Get Subscription Plan ID
export const getSubscriptionPlanId = async (
  amount: number | string,
  currency: string = "INR"
): Promise<string> => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount) || numAmount <= 0) {
    throw new Error(`Invalid subscription amount: ${amount}`);
  }

  try {
    // API call to get plan ID
    const response = await fetch('/api/get-plan-id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: numAmount, currency })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch plan ID');
    }

    const data = await response.json();
    return data.planId;
  } catch (error) {
    console.warn("Falling back to local plan ID lookup");
    
    // Fallback to local plan mapping
    const validAmounts = Object.keys(PLAN_IDS).map(Number);
    let matchedAmount = validAmounts.reduce((prev, curr) => 
      Math.abs(curr - numAmount) < Math.abs(prev - numAmount) ? curr : prev
    );

    const planId = PLAN_IDS[matchedAmount as keyof typeof PLAN_IDS];
    if (!planId) {
      throw new Error(`No plan found for amount ₹${matchedAmount}`);
    }

    return planId;
  }
};

// Initialize Recurring Payment (SIP)
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
    console.log('Initializing recurring payment with:', {
      amount,
      currency,
      name,
      prefill
    });

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      throw new Error("Failed to load Razorpay SDK. Please check your internet connection.");
    }

    const planId = await getSubscriptionPlanId(amount, currency);
    console.log('Selected plan ID:', planId);
    
    // Create subscription through backend
    const subscriptionResponse = await fetch('/api/create-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planId,
        customerDetails: {
          name: prefill?.name || name,
          email: prefill?.email || "",
          contact: prefill?.contact
        },
        notes: {
          ...notes,
          monthly_amount: String(amount),
          donation_type: "monthly_sip"
        }
      })
    });

    const subscriptionData = await subscriptionResponse.json();
    
    if (!subscriptionResponse.ok || !subscriptionData.success) {
      throw new Error(subscriptionData.error || 'Failed to create subscription');
    }

    console.log('Subscription created:', subscriptionData);

    const options: RazorpayOptions = {
      key: RAZORPAY_KEY_ID,
      subscription_id: subscriptionData.subscription.id,
      name,
      description: `Monthly SIP Donation (₹${amount}/month)`,
      prefill,
      notes: {
        ...notes,
        monthly_amount: String(amount),
        sip_plan_id: planId,
        payment_type: "recurring_sip"
      },
      theme: theme || { color: "#059669" }, // emerald-600
      modal: {
        ondismiss: () => {
          console.log('Payment window closed');
          onDismiss?.();
        }
      },
      handler: async (response) => {
        try {
          // Verify payment with backend
          const verificationResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response)
          });

          const verificationResult = await verificationResponse.json();
          
          if (!verificationResponse.ok || !verificationResult.success) {
            throw new Error(verificationResult.error || 'Payment verification failed');
          }

          handler?.(response);
        } catch (error) {
          console.error('Payment verification failed:', error);
          throw new Error('Payment verification failed. Please contact support if amount was deducted.');
        }
      },
      remember_customer: true
    };

    console.log('Creating Razorpay instance with options:', options);

    const razorpay = createRazorpayInstance(options);
    razorpay.open();

  } catch (error) {
    console.error("Razorpay subscription initialization failed:", error);
    throw error;
  }
};

// Initialize One-time Payment
export const initializeOneTimePayment = async ({
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
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      throw new Error("Failed to load Razorpay SDK");
    }

    // Create order
    const orderResponse = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        currency,
        notes: {
          ...notes,
          payment_type: "one_time",
          donor_name: prefill?.name,
          donor_email: prefill?.email
        }
      })
    });

    if (!orderResponse.ok) {
      throw new Error('Failed to create order');
    }

    const order = await orderResponse.json();

    const options: RazorpayOptions = {
      key: RAZORPAY_KEY_ID,
      amount: Math.round(amount * 100),
      currency,
      order_id: order.id,
      name,
      description,
      prefill,
      notes,
      theme,
      modal: { ondismiss: onDismiss },
      handler,
      remember_customer: true
    };

    const razorpay = createRazorpayInstance(options);
    razorpay.open();

  } catch (error) {
    console.error("Razorpay payment initialization failed:", error);
    throw error;
  }
};
