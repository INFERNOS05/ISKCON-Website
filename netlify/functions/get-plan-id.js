const Razorpay = require('razorpay');

// Initialize Razorpay with environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Plan IDs for different SIP amounts (monthly subscription plans)
const PLAN_IDS = {
  100: "plan_Qh8r9nUPEt3Dbv",
  200: "plan_Qh8s8EzXQr7DXu", 
  500: "plan_QhlbDG7RIgx5Ov", 
  1000: "plan_QhlcT03kYhZf6v"
};

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

  const amount = parseInt(event.queryStringParameters?.amount);

  if (isNaN(amount) || amount <= 0) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        success: false,
        error: `Invalid subscription amount: ${amount}`
      })
    };
  }

  try {
    // Valid amounts for SIP plans
    const validAmounts = Object.keys(PLAN_IDS).map(Number);
    
    // Find the exact match or closest match
    let exactMatch = false;
    let matchedAmount = validAmounts[validAmounts.length - 1]; // Default to highest amount
    
    // Try to find an exact match first
    for (const validAmount of validAmounts) {
      if (Math.abs(amount - validAmount) < 1) {
        matchedAmount = validAmount;
        exactMatch = true;
        break;
      }
    }
    
    // If no exact match, find the closest valid amount
    if (!exactMatch) {
      let minDiff = Number.MAX_VALUE;
      for (const validAmount of validAmounts) {
        const diff = Math.abs(amount - validAmount);
        if (diff < minDiff) {
          minDiff = diff;
          matchedAmount = validAmount;
        }
      }
    }
    
    // Get the plan ID from our mapping
    const planId = PLAN_IDS[matchedAmount];
    
    if (!planId) {
      throw new Error(`No plan found for amount ₹${matchedAmount}`);
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        planId,
        amount: matchedAmount,
        exactMatch
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
