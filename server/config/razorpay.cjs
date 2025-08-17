const Razorpay = require('razorpay');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Validate Razorpay credentials
const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_SECRET_KEY || process.env.RAZORPAY_KEY_SECRET;

if (!key_id || !key_secret) {
  throw new Error('Missing Razorpay credentials. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.');
}

console.log('🔑 Initializing Razorpay with:', {
  key_id: `${key_id.substring(0, 8)}...`,
  key_secret: '****'
});

// Initialize Razorpay with validation
let razorpay;
try {
  razorpay = new Razorpay({
    key_id,
    key_secret
  });
  console.log('✅ Razorpay initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Razorpay:', error);
  throw new Error('Razorpay initialization failed: ' + error.message);
}

// Plan IDs for different SIP amounts (monthly subscription plans)
const PLAN_IDS = {
  100: "plan_Qh8r9nUPEt3Dbv",
  200: "plan_Qh8s8EzXQr7DXu", 
  500: "plan_QhlbDG7RIgx5Ov", 
  1000: "plan_QhlcT03kYhZf6v"
};

// Verify plans exist
(async () => {
  try {
    console.log('🔍 Verifying subscription plans...');
    for (const [amount, planId] of Object.entries(PLAN_IDS)) {
      try {
        const plan = await razorpay.plans.fetch(planId);
        console.log(`✅ Verified plan for ₹${amount}: ${planId}`);
      } catch (error) {
        console.error(`❌ Failed to verify plan for ₹${amount}:`, error.message);
      }
    }
  } catch (error) {
    console.error('❌ Error verifying plans:', error);
  }
})();

module.exports = {
  razorpay,
  PLAN_IDS
};
