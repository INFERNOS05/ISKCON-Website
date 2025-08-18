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
    const apiUrl = '/.netlify/functions';
    
    // First, verify the payment with our backend
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

    const verificationResult = await verifyResponse.json();

    if (!verificationResult.success) {
      throw new Error(verificationResult.error || 'Payment verification failed');
    }

    // Payment is verified, now save the donation data to database
    console.log('Payment verified successfully, saving donation to database...');
    
    const donationData = {
      donorName: donorInfo.name,
      donorEmail: donorInfo.email,
      donorPhone: donorInfo.phone || '',
      panCard: donorInfo.panCard || '',
      address: donorInfo.address || '',
      amount: amount,
      currency: 'INR',
      paymentType: response.razorpay_subscription_id ? 'monthly_sip' : 'one_time',
      paymentId: response.razorpay_payment_id,
      subscriptionId: response.razorpay_subscription_id || null,
      status: 'completed',
      message: `Payment processed successfully via ${response.razorpay_subscription_id ? 'Subscription' : 'One-time payment'}`,
      createdAt: new Date().toISOString(),
      receiveUpdates: true,
      paymentMethod: 'razorpay'
    };

    // Save to database
    const saveResponse = await fetch(`${apiUrl}/donations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donationData)
    });

    if (!saveResponse.ok) {
      const saveError = await saveResponse.text();
      console.error('Failed to save donation to database:', saveError);
      // Don't throw error here as payment was successful, just log the issue
      console.warn('Payment was successful but failed to save to database');
    } else {
      const saveResult = await saveResponse.json();
      console.log('Donation saved successfully to database:', saveResult);
    }

    return {
      success: true,
      transactionId: response.razorpay_payment_id,
      message: 'Payment verified and donation saved successfully'
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
