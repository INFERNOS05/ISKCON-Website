const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_5Gr07DWc1NdDc9',
  key_secret: process.env.RAZORPAY_SECRET_KEY || 'qm2Ze9AEhjKjBr0e1tKArHYr'
});

// Plan IDs for different amounts
const PLAN_IDS = {
  100: "plan_Qh8r9nUPEt3Dbv",
  200: "plan_Qh8s8EzXQr7DXu", 
  500: "plan_QhlbDG7RIgx5Ov", 
  1000: "plan_QhlcT03kYhZf6v"
};

// Get plan ID for amount
app.get('/api/get-plan-id', (req, res) => {
  try {
    const amount = parseInt(req.query.amount);
    
    if (!amount || isNaN(amount)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount provided'
      });
    }

    console.log(`Received request for amount: ₹${amount}`);
    
    const validAmounts = Object.keys(PLAN_IDS).map(Number);
    const closestAmount = validAmounts.reduce((prev, curr) => 
      Math.abs(curr - amount) < Math.abs(prev - amount) ? curr : prev
    );

    console.log(`Found matching plan: ₹${closestAmount}`);

    res.json({ 
      success: true, 
      planId: PLAN_IDS[closestAmount],
      amount: closestAmount 
    });
  } catch (error) {
    console.error('Error in get-plan-id:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create subscription
app.post('/api/create-subscription', async (req, res) => {
  try {
    const { planId, customerDetails, notes = {} } = req.body;

    if (!planId || !customerDetails?.name || !customerDetails?.email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    console.log('Creating subscription:', {
      planId,
      customerName: customerDetails.name
    });

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 12, // 12 months subscription
      notes: {
        donor_name: customerDetails.name,
        donor_email: customerDetails.email,
        donation_type: "monthly_sip",
        ...notes
      }
    });

    console.log('Subscription created:', {
      id: subscription.id,
      status: subscription.status
    });

    res.json({ 
      success: true, 
      subscription: {
        id: subscription.id,
        status: subscription.status,
        planId: subscription.plan_id
      }
    });
  } catch (error) {
    console.error('Error in create-subscription:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Verify payment
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { 
      razorpay_payment_id, 
      razorpay_subscription_id,
      razorpay_signature 
    } = req.body;

    const generated_signature = razorpay.webhooks.generateSignature(
      `${razorpay_payment_id}|${razorpay_subscription_id}`,
      process.env.RAZORPAY_WEBHOOK_SECRET || 'your_webhook_secret'
    );

    const isValid = generated_signature === razorpay_signature;

    res.json({
      success: isValid,
      message: isValid ? 'Payment verified successfully' : 'Invalid signature'
    });
  } catch (error) {
    console.error('Error in verify-payment:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
