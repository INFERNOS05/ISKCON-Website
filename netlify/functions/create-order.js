const Razorpay = require('razorpay');

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
    const { amount, currency = 'INR', notes = {} } = JSON.parse(event.body);

    if (!amount || isNaN(amount)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Invalid amount'
        })
      };
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency,
      notes: {
        ...notes,
        payment_type: 'one_time'
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        order
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
