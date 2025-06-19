// This service handles payment verification with our backend server.
import { RazorpayResponse } from "./razorpay";

export interface PaymentVerificationRequest {
  paymentId: string;
  orderId?: string;
  signature?: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  donorInfo: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface PaymentVerificationResponse {
  success: boolean;
  transactionId: string;
  message: string;
}

// Verify the payment with Supabase Edge Function
export const verifyPaymentWithServer = async (
  data: PaymentVerificationRequest
): Promise<PaymentVerificationResponse> => {
  const isSubscription = !!data.subscriptionId;
  
  try {
    console.log(`Verifying ${isSubscription ? 'subscription' : 'payment'} with Edge Function:`, data);
    // API URL - Using proxy to Supabase Edge Function
    const apiUrl = '/api';
      // Call our Edge Function to verify the payment/subscription
    // The /api prefix will be rewritten to /quick-api by the proxy
    const response = await fetch(`${apiUrl}/${isSubscription ? 'verify-subscription' : 'verify-payment'}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_payment_id: data.paymentId,
        razorpay_order_id: data.orderId,
        razorpay_signature: data.signature,
        razorpay_subscription_id: data.subscriptionId,
        amount: data.amount,
        currency: data.currency,
        customerDetails: {
          name: data.donorInfo.name,
          email: data.donorInfo.email,
          phone: data.donorInfo.phone || ""
        }
      })
    });
    
    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.error || "Payment verification failed");
    }
    
    return {
      success: true,
      transactionId: result.transactionId || (isSubscription ? data.subscriptionId! : data.paymentId),
      message: result.message || (isSubscription ? "Subscription verified successfully" : "Payment verified successfully")
    };
  } catch (error) {
    console.error(`Error verifying ${isSubscription ? 'subscription' : 'payment'}:`, error);
    
    // For development fallback to successful response if server is not available
    if (process.env.NODE_ENV !== 'production') {
      console.warn("Using fallback verification due to API error");
      return {
        success: true,
        transactionId: isSubscription ? data.subscriptionId! : data.paymentId,
        message: isSubscription ? "Subscription verified successfully (dev mode)" : "Payment verified successfully (dev mode)"
      };
    }
    
    return {
      success: false,
      transactionId: isSubscription ? data.subscriptionId! : data.paymentId,
      message: `Payment verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Process Razorpay response from client
export const processRazorpayResponse = async (
  response: RazorpayResponse,
  amount: number,
  donorInfo: {
    name: string;
    email: string;
    phone?: string;
  }
): Promise<PaymentVerificationResponse> => {
  try {
    const isSubscription = !!response.razorpay_subscription_id;
    
    // Log detailed response for debugging
    console.log("Processing payment response:", { response, isSubscription, amount, donorInfo });
    
    const verificationData: PaymentVerificationRequest = {
      paymentId: response.razorpay_payment_id || "",
      orderId: response.razorpay_order_id,
      signature: response.razorpay_signature,
      subscriptionId: response.razorpay_subscription_id,
      amount,
      currency: "INR",
      donorInfo
    };
    
    // Validate that we have essential data
    if (isSubscription && !verificationData.subscriptionId) {
      throw new Error("Missing subscription ID in payment response");
    }
    
    if (!isSubscription && !verificationData.paymentId) {
      throw new Error("Missing payment ID in payment response");
    }
    
    // Call our verification service
    return await verifyPaymentWithServer(verificationData);
  } catch (error) {
    console.error("Payment verification failed:", error);
    return {
      success: false,
      transactionId: response.razorpay_payment_id || response.razorpay_subscription_id || "",
      message: "Payment verification failed: " + (error instanceof Error ? error.message : "Unknown error")
    };
  }
};
