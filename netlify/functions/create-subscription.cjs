const Razorpay = require('razorpay');

// Initialize Razorpay with environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Headers for CORS and content type
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
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
    console.log('[Backend] Creating subscription - Request body:', event.body);
    
    // Check if request body exists
    if (!event.body) {
      throw new Error('Request body is empty');
    }

    const { planId, customerDetails, notes = {} } = JSON.parse(event.body);

    // Validate required fields
    if (!planId) {
      console.log('[Backend] Missing planId');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Plan ID is required'
        })
      };
    }

    if (!customerDetails?.name || !customerDetails?.email) {
      console.log('[Backend] Missing customer details:', customerDetails);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Customer name and email are required'
        })
      };
    }

    // Log Razorpay initialization
    console.log('[Backend] Razorpay initialized with key_id:', process.env.RAZORPAY_KEY_ID);
    console.log('[Backend] Key secret length:', process.env.RAZORPAY_KEY_SECRET?.length || 0);

    // Create subscription data
    const subscriptionData = {
      plan_id: planId,
      customer_notify: 1,
      total_count: 12, // 12 months subscription
      notes: {
        donor_name: customerDetails.name,
        donor_email: customerDetails.email,
        donation_type: 'monthly_sip',
        ...notes
      }
    };

    console.log('[Backend] Creating Razorpay subscription with:', JSON.stringify(subscriptionData, null, 2));

    try {
      const subscription = await razorpay.subscriptions.create(subscriptionData);
      console.log('[Backend] Subscription created successfully:', JSON.stringify(subscription, null, 2));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          subscription
        })
      };
    } catch (razorpayError) {
      console.error('[Backend] Razorpay API error:', razorpayError);
      // Check if it's a Razorpay error with additional details
      const errorMessage = razorpayError.error?.description || razorpayError.message || 'Unknown Razorpay error';
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: `Razorpay error: ${errorMessage}`,
          details: razorpayError.error || {}
        })
      };
    }
  } catch (error) {
    console.error('[Backend] Server error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: `Server error: ${error.message || 'Unknown error'}`
      })
    };
  }
};
