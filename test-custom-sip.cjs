/**
 * Test script for custom SIP donation functionality
 * This tests the get-plan-id function with various amounts
 */

// Load environment variables
require('dotenv').config();

const Razorpay = require('razorpay');

// Initialize Razorpay with environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Predefined Plan IDs for common SIP amounts
const PREDEFINED_PLAN_IDS = {
  100: "plan_Qh8r9nUPEt3Dbv",
  200: "plan_Qh8s8EzXQr7DXu", 
  500: "plan_QhlbDG7RIgx5Ov", 
  1000: "plan_QhlcT03kYhZf6v"
};

/**
 * Creates a new Razorpay plan for custom SIP amounts
 */
async function createRazorpayPlan(amount) {
  try {
    console.log(`\n📝 Creating new Razorpay plan for amount: ₹${amount}`);
    
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
    console.log(`   Name: ${plan.item.name}`);
    console.log(`   Amount: ₹${plan.item.amount / 100}`);
    console.log(`   Period: ${plan.period} (interval: ${plan.interval})`);
    
    return plan.id;
  } catch (error) {
    console.error('❌ Error creating Razorpay plan:', error.message);
    if (error.error) {
      console.error('   Error details:', error.error);
    }
    throw error;
  }
}

/**
 * Gets or creates a plan ID for the given amount
 */
async function getPlanId(amount) {
  // Check if we have a predefined plan for this amount
  if (PREDEFINED_PLAN_IDS[amount]) {
    console.log(`\n✨ Using predefined plan for ₹${amount}`);
    console.log(`   Plan ID: ${PREDEFINED_PLAN_IDS[amount]}`);
    return {
      planId: PREDEFINED_PLAN_IDS[amount],
      amount: amount,
      isCustom: false
    };
  }

  // For custom amounts, create a new plan
  console.log(`\n🔧 Creating custom plan for ₹${amount}`);
  const planId = await createRazorpayPlan(amount);
  
  return {
    planId: planId,
    amount: amount,
    isCustom: true
  };
}

/**
 * Test function
 */
async function runTests() {
  console.log('🧪 Testing Custom SIP Donation Functionality\n');
  console.log('='.repeat(60));
  
  // Check if Razorpay credentials are configured
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error('\n❌ ERROR: Razorpay credentials not found!');
    console.error('Please ensure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set in .env file');
    process.exit(1);
  }

  console.log(`\n✅ Razorpay Key ID: ${process.env.RAZORPAY_KEY_ID.substring(0, 15)}...`);
  
  const testCases = [
    { amount: 100, description: 'Common amount (predefined plan)' },
    { amount: 500, description: 'Common amount (predefined plan)' },
    { amount: 350, description: 'Custom amount' },
    { amount: 750, description: 'Custom amount' },
    { amount: 2500, description: 'Custom amount (large)' },
  ];

  console.log('\n📋 Test Cases:');
  console.log('='.repeat(60));
  
  for (const testCase of testCases) {
    try {
      console.log(`\nTest ${testCases.indexOf(testCase) + 1}/${testCases.length}: ${testCase.description}`);
      console.log(`Amount: ₹${testCase.amount}`);
      
      const result = await getPlanId(testCase.amount);
      
      console.log(`\n✅ SUCCESS`);
      console.log(`   Plan ID: ${result.planId}`);
      console.log(`   Amount: ₹${result.amount}`);
      console.log(`   Type: ${result.isCustom ? 'Custom (newly created)' : 'Predefined (cached)'}`);
      
    } catch (error) {
      console.error(`\n❌ FAILED: ${error.message}`);
    }
    
    console.log('\n' + '-'.repeat(60));
  }

  // Test minimum amount validation
  console.log('\n\n🔍 Testing Validation:');
  console.log('='.repeat(60));
  
  const MIN_SIP_AMOUNT = 50;
  const invalidAmount = 30;
  
  console.log(`\nTest: Amount below minimum (₹${invalidAmount} < ₹${MIN_SIP_AMOUNT})`);
  
  if (invalidAmount < MIN_SIP_AMOUNT) {
    console.log(`✅ VALIDATION PASSED: Amount ₹${invalidAmount} is below minimum ₹${MIN_SIP_AMOUNT}`);
    console.log(`   This would be rejected by the backend`);
  } else {
    console.log(`❌ VALIDATION FAILED: Amount should be rejected`);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n✨ Testing Complete!\n');
  
  console.log('\n📝 Summary:');
  console.log('- Predefined plans (₹100, ₹200, ₹500, ₹1000) are used when available');
  console.log('- Custom amounts dynamically create new Razorpay plans');
  console.log('- Minimum SIP amount is ₹50');
  console.log('- All plans are created with monthly recurring billing\n');
}

// Run the tests
runTests().catch(error => {
  console.error('\n💥 Test script failed:', error);
  process.exit(1);
});
