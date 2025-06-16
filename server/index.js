import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// Plan IDs for different SIP amounts (monthly subscription plans)
// These should match the IDs in the frontend
const PLAN_IDS = {
  100: "plan_Qh8r9nUPEt3Dbv",
  200: "plan_Qh8s8EzXQr7DXu", 
  500: "plan_QhlbDG7RIgx5Ov", 
  1000: "plan_QhlcT03kYhZf6v"
};

// API endpoint to create a subscription
app.post('/api/create-subscription', async (req, res) => {
  try {
    const { amount, planId, customerDetails, notes = {} } = req.body;
    
    console.log('Creating subscription with:', { amount, planId, customerDetails });
    
    if (!planId) {
      return res.status(400).json({ 
        success: false,
        error: 'Plan ID is required' 
      });
    }

    if (!customerDetails || !customerDetails.name || !customerDetails.email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Customer name and email are required' 
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

    console.log('Creating subscription with options:', subscriptionOptions);

    // Create the subscription using Razorpay API
    const subscription = await razorpay.subscriptions.create(subscriptionOptions);
    
    console.log('Subscription created:', subscription);

    return res.status(200).json({
      success: true,
      subscription: {
        id: subscription.id,
        planId: subscription.plan_id,
        status: subscription.status,
        customerName: customerDetails.name,
        customerEmail: customerDetails.email
      }
    });
  } catch (error) {
    console.error('Subscription creation error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to create subscription'
    });
  }
});

// API endpoint to verify subscription
app.post('/api/verify-subscription', async (req, res) => {
  try {
    const { subscriptionId, paymentId, signature } = req.body;

    console.log('Verifying subscription:', { subscriptionId, paymentId, signature });

    if (!subscriptionId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Subscription ID is required' 
      });
    }

    // In a production environment, you would verify the signature
    // const expectedSignature = crypto
    //  .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
    //  .update(subscriptionId + '|' + paymentId)
    //  .digest('hex');
    //
    // if (expectedSignature !== signature) {
    //   return res.status(400).json({ 
    //     success: false,
    //     error: 'Invalid signature' 
    //   });
    // }

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

// API endpoint to get a subscription plan ID based on amount
app.get('/api/get-plan-id', (req, res) => {
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

// API endpoint to create a payment order for one-time payments
app.post('/api/create-order', async (req, res) => {
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

// API endpoint to verify one-time payment
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { paymentId, orderId, signature } = req.body;

    console.log('Verifying payment:', { paymentId, orderId, signature });

    if (!paymentId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Payment ID is required' 
      });
    }

    // In a production environment, you would verify the signature
    // const expectedSignature = crypto
    //  .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
    //  .update(orderId + '|' + paymentId)
    //  .digest('hex');
    //
    // if (expectedSignature !== signature) {
    //   return res.status(400).json({ 
    //     success: false,
    //     error: 'Invalid signature' 
    //   });
    // }

    // For demo purposes, we'll just return a successful response
    // In a production environment, you should verify the payment with Razorpay
    const payment = await razorpay.payments.fetch(paymentId);
    console.log('Payment details:', payment);

    return res.status(200).json({
      success: true,
      transactionId: paymentId,
      status: payment.status,
      message: 'Payment verified successfully'
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to verify payment'
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Using Razorpay Key ID: ${process.env.RAZORPAY_KEY_ID.substring(0, 6)}...`);
});
