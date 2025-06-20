const Razorpay = require('razorpay');

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

  try {
    // Initialize Razorpay with environment variables
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Try to fetch a test plan to verify credentials
    const testPlanId = "plan_Qh8r9nUPEt3Dbv"; // ₹100 plan
    try {
      const plan = await razorpay.plans.fetch(testPlanId);
      console.log('[Debug] Successfully fetched plan:', plan);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Razorpay configuration is valid',
          key_id_prefix: process.env.RAZORPAY_KEY_ID?.substring(0, 8),
          key_secret_length: process.env.RAZORPAY_KEY_SECRET?.length,
          plan: {
            id: plan.id,
            amount: plan.item.amount,
            currency: plan.item.currency
          }
        })
      };
    } catch (planError) {
      console.error('[Debug] Error fetching plan:', planError);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Failed to fetch test plan',
          message: planError.message,
          details: planError.error || {},
          key_id_prefix: process.env.RAZORPAY_KEY_ID?.substring(0, 8),
          key_secret_length: process.env.RAZORPAY_KEY_SECRET?.length
        })
      };
    }
  } catch (error) {
    console.error('[Debug] Server error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Server error',
        message: error.message,
        key_id_exists: !!process.env.RAZORPAY_KEY_ID,
        key_secret_exists: !!process.env.RAZORPAY_KEY_SECRET
      })
    };
  }
};
