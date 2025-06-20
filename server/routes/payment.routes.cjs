const express = require('express');
const dotenv = require('dotenv');
const { razorpay, PLAN_IDS } = require('../config/razorpay.cjs');

// Load environment variables
dotenv.config();

const router = express.Router();

// Debug endpoint to test Razorpay connection
router.get('/test-razorpay', async (req, res) => {
  try {
    const items = await razorpay.plans.all();
    res.json({ success: true, plans: items });
  } catch (error) {
    console.error('Razorpay connection test failed:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Razorpay connection failed',
      details: error.message 
    });
  }
});

// Route to create a subscription
router.post('/create-subscription', async (req, res) => {
  try {
    const { planId, customerDetails, notes = {} } = req.body;
    
    console.log('📍 Starting subscription creation process');
    console.log('Received request data:', { 
      planId, 
      customerDetails, 
      notes 
    });
    
    // Validate inputs
    if (!planId) {
      console.error('❌ Missing plan ID');
      return res.status(400).json({ 
        success: false,
        error: 'Plan ID is required' 
      });
    }

    if (!customerDetails || !customerDetails.name || !customerDetails.email) {
      console.error('❌ Missing customer details');
      return res.status(400).json({ 
        success: false, 
        error: 'Customer name and email are required' 
      });
    }

    // Verify plan exists in Razorpay
    console.log('🔍 Verifying plan in Razorpay:', planId);
    try {
      const plan = await razorpay.plans.fetch(planId);
      console.log('✅ Plan verified:', {
        id: plan.id,
        amount: plan.item.amount,
        currency: plan.item.currency
      });
    } catch (planError) {
      console.error('❌ Plan verification failed:', planError);
      return res.status(400).json({
        success: false,
        error: 'Invalid plan ID. Please check the subscription amount.',
        details: planError.message
      });
    }

    // Create a new subscription
    const subscriptionOptions = {
      plan_id: planId,
      customer_notify: 1,
      total_count: 12, // 12 months subscription
      notes: {
        donor_name: customerDetails.name,
        donor_email: customerDetails.email,
        donation_type: "monthly_sip",
        ...notes
      }
    };

    console.log('📝 Creating subscription with options:', JSON.stringify(subscriptionOptions, null, 2));

    try {
      // Create the subscription using Razorpay API
      const subscription = await razorpay.subscriptions.create(subscriptionOptions);
      console.log('✅ Subscription created successfully:', {
        id: subscription.id,
        status: subscription.status,
        planId: subscription.plan_id
      });
      
      if (subscription.status === 'created') {
        return res.json({
          success: true,
          subscription: {
            id: subscription.id,
            status: subscription.status,
            planId: subscription.plan_id
          }
        });
      } else {
        console.error('❌ Unexpected subscription status:', subscription.status);
        throw new Error(`Unexpected subscription status: ${subscription.status}`);
      }
    } catch (subscriptionError) {
      console.error('❌ Subscription creation failed:', subscriptionError);
      return res.status(400).json({
        success: false,
        error: 'Failed to create subscription',
        details: subscriptionError.message
      });
    }
  } catch (error) {
    console.error('❌ Server error in /create-subscription:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Route to verify subscription
router.post('/verify-subscription', async (req, res) => {
  try {
    const { subscriptionId, paymentId, signature } = req.body;

    console.log('Verifying subscription:', { subscriptionId, paymentId, signature });

    if (!subscriptionId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Subscription ID is required' 
      });
    }

    // In production, verify the signature with Razorpay

    // Get subscription details from Razorpay
    const subscription = await razorpay.subscriptions.fetch(subscriptionId);
    console.log('Subscription details:', subscription);

    return res.status(200).json({
      success: true,
      transactionId: subscriptionId,
      status: subscription.status,
      message: 'Subscription verified successfully'
    });
  } catch (error) {
    console.error('Subscription verification error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to verify subscription'
    });
  }
});

// Route to verify payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { 
      razorpay_payment_id, 
      razorpay_subscription_id,
      razorpay_signature 
    } = req.body;

    console.log('Verifying payment:', {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature
    });

    // Verify the payment signature
    const generated_signature = razorpay.webhooks.generateSignature(
      `${razorpay_payment_id}|${razorpay_subscription_id}`,
      process.env.RAZORPAY_WEBHOOK_SECRET || 'your_webhook_secret'
    );

    if (generated_signature === razorpay_signature) {
      console.log('Payment verified successfully');
      return res.json({
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      console.error('Payment verification failed: Invalid signature');
      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({
      success: false,
      error: 'Payment verification failed',
      details: error.message
    });
  }
});

// Route to get a subscription plan ID based on amount
router.get('/get-plan-id', (req, res) => {
  try {
    const { amount } = req.query;
    
    console.log('Getting plan ID for amount:', amount);
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Valid amount is required' 
      });
    }
    
    const numAmount = parseFloat(amount);
    const validAmounts = Object.keys(PLAN_IDS).map(Number);
    
    // Find the exact match or closest match
    let exactMatch = false;
    let matchedAmount = validAmounts[validAmounts.length - 1]; // Default to highest amount
    
    // Try to find an exact match first
    for (const validAmount of validAmounts) {
      if (Math.abs(numAmount - validAmount) < 1) {
        matchedAmount = validAmount;
        exactMatch = true;
        break;
      }
    }
    
    // If no exact match, find the closest valid amount
    if (!exactMatch) {
      let minDiff = Number.MAX_VALUE;
      for (const validAmount of validAmounts) {
        const diff = Math.abs(numAmount - validAmount);
        if (diff < minDiff) {
          minDiff = diff;
          matchedAmount = validAmount;
        }
      }
      
      console.log(`No exact plan match for amount ₹${numAmount}, using closest plan for ₹${matchedAmount}`);
    } else {
      console.log(`Found exact plan match for amount ₹${matchedAmount}`);
    }
    
    const planId = PLAN_IDS[matchedAmount];
    
    if (!planId) {
      return res.status(404).json({ 
        success: false, 
        error: `No plan found for amount ₹${matchedAmount}` 
      });
    }
    
    return res.status(200).json({
      success: true,
      planId,
      amount: matchedAmount
    });
  } catch (error) {
    console.error('Error finding plan ID:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to find plan ID'
    });
  }
});

// Route to create a payment order for one-time payments
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes = {} } = req.body;
    
    console.log('Creating order with:', { amount, currency, receipt });
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Valid amount is required' 
      });
    }

    // Razorpay expects amount in paise (smallest currency unit)
    const amountInPaise = Math.round(parseFloat(amount) * 100);

    // Create order using Razorpay API
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: {
        payment_type: 'one_time',
        ...notes
      }
    });
    
    console.log('Order created:', order);

    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Order creation error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to create order'
    });
  }
});

module.exports = router;
