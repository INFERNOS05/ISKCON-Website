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
    console.log('Creating subscription with request body:', event.body);
    const { planId, customerDetails, notes = {} } = JSON.parse(event.body);

    if (!planId) {
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
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Customer name and email are required'
        })
      };
    }

    console.log('Creating Razorpay subscription with:', {
      plan_id: planId,
      customer_notify: 1,
      notes: {
        donor_name: customerDetails.name,
        donor_email: customerDetails.email,
        donation_type: 'monthly_sip',
        ...notes
      }
    });

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 12, // 12 months subscription
      notes: {
        donor_name: customerDetails.name,
        donor_email: customerDetails.email,
        donation_type: 'monthly_sip',
        ...notes
      }
    });

    console.log('Subscription created successfully:', subscription);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        subscription
      })
    };
  } catch (error) {
    console.error('Error creating subscription:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Failed to create subscription'
      })
    };
  }
};
