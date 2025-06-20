const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay with environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Headers for CORS and content type
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async (event, context) => {
  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers
    };
  }
  
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Method not allowed'
      })
    };
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      razorpay_subscription_id
    } = JSON.parse(event.body);

    // For subscriptions, verify subscription payment
    if (razorpay_subscription_id) {
      const subscription = await razorpay.subscriptions.fetch(razorpay_subscription_id);
      
      if (subscription.status !== 'active') {
        throw new Error('Subscription is not active');
      }

      // Verify subscription payment signature
      const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_payment_id + '|' + razorpay_subscription_id)
        .digest('hex');

      if (generated_signature !== razorpay_signature) {
        throw new Error('Invalid subscription payment signature');
      }
    } 
    // For one-time payments, verify order payment
    else if (razorpay_order_id) {
      // Verify order payment signature
      const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

      if (generated_signature !== razorpay_signature) {
        throw new Error('Invalid order payment signature');
      }
    } else {
      throw new Error('Missing payment details');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Payment verified successfully'
      })
    };
  } catch (error) {
    console.error('Payment verification error:', error);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Payment verification failed'
      })
    };
  }
};
