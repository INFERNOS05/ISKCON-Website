const Razorpay = require('razorpay');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_5Gr07DWc1NdDc9',
  key_secret: process.env.RAZORPAY_SECRET_KEY || process.env.RAZORPAY_KEY_SECRET || 'qm2Ze9AEhjKjBr0e1tKArHYr'
});

// Plan IDs for different SIP amounts (monthly subscription plans)
const PLAN_IDS = {
  100: "plan_Qh8r9nUPEt3Dbv",
  200: "plan_Qh8s8EzXQr7DXu", 
  500: "plan_QhlbDG7RIgx5Ov", 
  1000: "plan_QhlcT03kYhZf6v"
};

module.exports = {
  razorpay,
  PLAN_IDS
};
