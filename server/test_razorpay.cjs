const { razorpay, PLAN_IDS } = require('./config/razorpay.cjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('Razorpay instance created successfully');
console.log('Testing Plan IDs:', PLAN_IDS);
console.log('Environment variables loaded:');
console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? 'Defined' : 'Undefined');
console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'Defined' : 'Undefined');

async function testSubscriptionCreation() {
  try {
    // Test creating a subscription
    const subscriptionOptions = {
      plan_id: PLAN_IDS[1000], // Testing the 1000 rupee plan specifically
      customer_notify: 1,
      total_count: 12,
      notes: {
        donor_name: 'Test User',
        donor_email: 'test@example.com',
        donation_type: "monthly_sip"
      }
    };

    console.log('Creating test subscription with options:', subscriptionOptions);

    // Create the subscription using Razorpay API
    const subscription = await razorpay.subscriptions.create(subscriptionOptions);
    
    console.log('Subscription created successfully:', subscription.id);
    return true;
  } catch (error) {
    console.error('Error creating subscription:', error);
    return false;
  }
}

testSubscriptionCreation()
  .then(result => {
    console.log('Test completed:', result ? 'SUCCESS' : 'FAILED');
    process.exit(result ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
