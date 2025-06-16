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

export interface RazorpayOptions {
  key: string;
  amount: number; // in smallest currency unit (paise for INR)
  currency: string;
  name: string;
  description?: string;
  order_id?: string; // Obtained from server
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
    return null;
  }
  return new window.Razorpay(options);
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
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      throw new Error("Failed to load Razorpay SDK");
    }

    // In production, you would typically:
    // 1. Make an API call to your backend to create an order
    // 2. Get the order_id from the backend
    // 3. Pass the order_id to Razorpay

    // For now, we'll proceed with a direct checkout without server involvement
    const options: RazorpayOptions = {
      key: RAZORPAY_KEY_ID,
      amount: amount * 100, // convert to paise
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

    const razorpay = createRazorpayInstance(options);
    if (razorpay) {
      razorpay.open();
    }
  } catch (error) {
    console.error("Razorpay initialization failed:", error);
  }
};

// In a production app, you would verify the payment on your server
export const verifyPayment = async (paymentData: RazorpayResponse): Promise<boolean> => {
  // This would typically be a server call
  // For demo purposes, we'll just return true
  console.log("Payment data to verify:", paymentData);
  return true;
};
