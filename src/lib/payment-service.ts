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

/**
 * Process and verify a Razorpay payment response
 */
export const processRazorpayResponse = async (
  response: RazorpayResponse,
  amount: number,
  donorInfo: any
): Promise<PaymentVerificationResponse> => {
  try {
    const apiUrl = '/api';
    
    // Verify the payment with our backend
    const verifyResponse = await fetch(`${apiUrl}/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
        razorpay_subscription_id: response.razorpay_subscription_id
      })
    });

    if (!verifyResponse.ok) {
      const errorText = await verifyResponse.text();
      console.error('Payment verification failed:', errorText);
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error || 'Payment verification failed');
      } catch (e) {
        throw new Error('Payment verification failed: ' + errorText);
      }
    }

    const result = await verifyResponse.json();

    if (!result.success) {
      throw new Error(result.error || 'Payment verification failed');
    }

    return {
      success: true,
      transactionId: response.razorpay_payment_id,
      message: 'Payment verified successfully'
    };
  } catch (error) {
    console.error('Error processing payment:', error);
    return {
      success: false,
      transactionId: response.razorpay_payment_id,
      message: error instanceof Error ? error.message : 'Payment verification failed'
    };
  }
};
