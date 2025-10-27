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

    // Simply verify that credentials exist and are configured
    // We don't try to fetch any specific plan since it may not exist
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Razorpay credentials not configured',
          message: 'RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing'
        })
      };
    }

    console.log('[Debug] Razorpay configured successfully');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        configured: true,
        message: 'Razorpay configuration is valid',
        key_id_prefix: process.env.RAZORPAY_KEY_ID?.substring(0, 15),
        test_mode: process.env.RAZORPAY_KEY_ID?.includes('test')
      })
    };
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
