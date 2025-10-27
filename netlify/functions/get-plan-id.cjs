const Razorpay = require('razorpay');

// Initialize Razorpay with environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Predefined Plan IDs for common SIP amounts (for faster lookup)
// NOTE: These plans need to exist in YOUR Razorpay account
// For now, we'll skip predefined plans and create all plans dynamically
const PREDEFINED_PLAN_IDS = {
  // Disabled until plans are created in your Razorpay account
  // 100: "plan_Qh8r9nUPEt3Dbv",
  // 200: "plan_Qh8s8EzXQr7DXu", 
  // 500: "plan_QhlbDG7RIgx5Ov", 
  // 1000: "plan_QhlcT03kYhZf6v"
};

// Headers for CORS and content type
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

/**
 * Creates a new Razorpay plan for custom SIP amounts
 */
async function createRazorpayPlan(amount) {
  try {
    console.log(`Creating new Razorpay plan for amount: ₹${amount}`);
    
    const planData = {
      period: 'monthly',
      interval: 1,
      item: {
        name: `Monthly Donation - ₹${amount}`,
        description: `Monthly recurring donation of ₹${amount} to Prachetas Foundation`,
        amount: amount * 100, // Convert to paise
        currency: 'INR'
      },
      notes: {
        plan_type: 'custom_sip',
        amount: String(amount),
        created_at: new Date().toISOString()
      }
    };

    const plan = await razorpay.plans.create(planData);
    console.log(`✅ Successfully created plan:`, plan.id);
    
    return plan.id;
  } catch (error) {
    console.error('❌ Error creating Razorpay plan:', error);
    throw new Error(`Failed to create subscription plan: ${error.message}`);
  }
}

/**
 * Gets or creates a plan ID for the given amount
 */
async function getPlanId(amount) {
  // Check if we have a predefined plan for this amount
  if (PREDEFINED_PLAN_IDS[amount]) {
    console.log(`Using predefined plan for ₹${amount}`);
    return {
      planId: PREDEFINED_PLAN_IDS[amount],
      amount: amount,
      isCustom: false
    };
  }

  // For custom amounts, create a new plan
  console.log(`Creating custom plan for ₹${amount}`);
  const planId = await createRazorpayPlan(amount);
  
  return {
    planId: planId,
    amount: amount,
    isCustom: true
  };
}

exports.handler = async (event, context) => {
  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers
    };
  }

  const amount = parseInt(event.queryStringParameters?.amount);

  // Validate amount
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

  // Set minimum amount for SIP (e.g., ₹50)
  const MIN_SIP_AMOUNT = 50;
  if (amount < MIN_SIP_AMOUNT) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        success: false,
        error: `Minimum SIP amount is ₹${MIN_SIP_AMOUNT}`
      })
    };
  }

  try {
    const result = await getPlanId(amount);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        planId: result.planId,
        amount: result.amount,
        isCustom: result.isCustom
      })
    };
  } catch (error) {
    console.error('Error in get-plan-id:', error);
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
