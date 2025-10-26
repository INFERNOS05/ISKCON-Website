/**
 * Test Razorpay API connectivity
 */

require('dotenv').config();
const Razorpay = require('razorpay');

console.log('\n🧪 Testing Razorpay API Connection\n');
console.log('='.repeat(60));

// Check credentials
console.log('\n1. Checking credentials...');
console.log(`   Key ID: ${process.env.RAZORPAY_KEY_ID}`);
console.log(`   Secret: ${process.env.RAZORPAY_KEY_SECRET?.substring(0, 4)}****`);

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('\n❌ Razorpay credentials not found in .env file!');
  process.exit(1);
}

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log('\n2. Testing API connection...');

// Test: List existing plans (this should work even with 0 plans)
async function testAPI() {
  try {
    console.log('\n   Attempting to fetch plans list...');
    const plans = await razorpay.plans.all();
    console.log(`   ✅ API connection successful!`);
    console.log(`   Found ${plans.items?.length || 0} existing plans`);
    
    if (plans.items && plans.items.length > 0) {
      console.log('\n   Existing plans:');
      plans.items.forEach((plan, index) => {
        console.log(`     ${index + 1}. ${plan.id} - ₹${plan.item.amount / 100} (${plan.period})`);
      });
    }
    
    // Test: Create a test plan
    console.log('\n3. Testing plan creation...');
    const testPlan = {
      period: 'monthly',
      interval: 1,
      item: {
        name: 'Test Plan - ₹100',
        description: 'Test monthly donation plan',
        amount: 10000, // ₹100 in paise
        currency: 'INR'
      }
    };
    
    console.log('   Creating test plan...');
    const createdPlan = await razorpay.plans.create(testPlan);
    console.log(`   ✅ Plan created successfully!`);
    console.log(`   Plan ID: ${createdPlan.id}`);
    console.log(`   Amount: ₹${createdPlan.item.amount / 100}`);
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests passed! Razorpay is working correctly.');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ API Test Failed!');
    console.error('\nError details:');
    console.error('   Status:', error.statusCode);
    console.error('   Code:', error.error?.code);
    console.error('   Description:', error.error?.description);
    console.error('   Full error:', error);
    
    console.log('\n' + '='.repeat(60));
    console.log('Troubleshooting tips:');
    console.log('1. Verify your Razorpay credentials are correct');
    console.log('2. Make sure you\'re using TEST mode keys (rzp_test_...)');
    console.log('3. Check if your Razorpay account is activated');
    console.log('4. Verify API access is enabled in Razorpay dashboard');
    console.log('='.repeat(60));
    
    process.exit(1);
  }
}

testAPI();
