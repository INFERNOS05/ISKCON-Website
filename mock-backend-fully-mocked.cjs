/**
 * Fully Mocked Backend Server for Testing Custom SIP Donations
 * This doesn't require real Razorpay credentials - perfect for UI testing
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8888;

// Middleware
app.use(cors());
app.use(express.json());

// Mock get-plan-id function
app.get('/.netlify/functions/get-plan-id', (req, res) => {
  const amount = parseInt(req.query.amount);
  
  console.log(`\n📡 get-plan-id called with amount: ₹${amount}`);
  
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({
      success: false,
      error: `Invalid subscription amount: ${amount}`
    });
  }
  
  if (amount < 50) {
    return res.status(400).json({
      success: false,
      error: `Minimum SIP amount is ₹50`
    });
  }
  
  // Predefined plans
  const predefinedPlans = {
    100: "plan_Qh8r9nUPEt3Dbv",
    200: "plan_Qh8s8EzXQr7DXu",
    500: "plan_QhlbDG7RIgx5Ov",
    1000: "plan_QhlcT03kYhZf6v"
  };
  
  let planId, isCustom;
  
  if (predefinedPlans[amount]) {
    planId = predefinedPlans[amount];
    isCustom = false;
    console.log(`   ✅ Using predefined plan: ${planId}`);
  } else {
    // Generate mock plan ID for custom amounts
    planId = `plan_mock_${Date.now()}_${amount}`;
    isCustom = true;
    console.log(`   🔧 Created mock custom plan: ${planId}`);
  }
  
  res.json({
    success: true,
    planId,
    amount,
    isCustom
  });
});

// Mock create-order function
app.post('/.netlify/functions/create-order', (req, res) => {
  const { amount, currency, receipt } = req.body;
  
  console.log(`\n📡 create-order called:`);
  console.log(`   Amount: ₹${amount / 100}`);
  console.log(`   Currency: ${currency}`);
  console.log(`   Receipt: ${receipt}`);
  
  const mockOrder = {
    id: `order_mock_${Date.now()}`,
    entity: 'order',
    amount,
    currency,
    receipt,
    status: 'created',
    created_at: Math.floor(Date.now() / 1000)
  };
  
  console.log(`   ✅ Mock order created: ${mockOrder.id}`);
  
  res.json({
    success: true,
    order: mockOrder
  });
});

// Mock create-subscription function
app.post('/.netlify/functions/create-subscription', (req, res) => {
  const { planId, customerDetails } = req.body;
  
  console.log(`\n📡 create-subscription called:`);
  console.log(`   Plan ID: ${planId}`);
  console.log(`   Customer: ${customerDetails.name}`);
  
  const mockSubscription = {
    id: `sub_mock_${Date.now()}`,
    entity: 'subscription',
    plan_id: planId,
    customer_email: customerDetails.email,
    status: 'created',
    created_at: Math.floor(Date.now() / 1000)
  };
  
  console.log(`   ✅ Mock subscription created: ${mockSubscription.id}`);
  
  res.json({
    success: true,
    subscription: mockSubscription
  });
});

// Mock check-razorpay function
app.get('/.netlify/functions/check-razorpay', (req, res) => {
  console.log(`\n📡 check-razorpay called`);
  console.log(`   ✅ Razorpay is configured (mocked)`);
  
  res.json({
    success: true,
    configured: true,
    message: 'Razorpay is configured (mock mode)',
    keyId: 'rzp_test_mock',
    mode: 'mock_testing'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Mock backend server is running',
    mode: 'fully_mocked'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 Mock Backend Server Started (Fully Mocked Mode)!');
  console.log('='.repeat(70));
  console.log(`\n📍 Server running at: http://localhost:${PORT}`);
  console.log(`\n💡 This server uses MOCK DATA - no real Razorpay API calls`);
  console.log(`   Perfect for testing the UI and custom SIP logic!`);
  console.log(`\n📋 Available endpoints:`);
  console.log(`   ✅ GET  /.netlify/functions/get-plan-id?amount=X`);
  console.log(`   ✅ POST /.netlify/functions/create-order`);
  console.log(`   ✅ POST /.netlify/functions/create-subscription`);
  console.log(`   ✅ GET  /.netlify/functions/check-razorpay`);
  console.log(`\n🔧 What works:`);
  console.log(`   - Predefined plan amounts (₹100, ₹200, ₹500, ₹1000)`);
  console.log(`   - Custom plan creation (generates mock plan IDs)`);
  console.log(`   - Minimum amount validation (₹50)`);
  console.log(`   - All backend logic validation`);
  console.log(`\n⚠️  What doesn't work:`);
  console.log(`   - Actual Razorpay payment processing`);
  console.log(`   - Real subscription creation`);
  console.log(`   - Payment verification`);
  console.log('\n='.repeat(70));
  console.log('\n🎯 Perfect for testing custom SIP donation UI!\n');
  console.log('Press Ctrl+C to stop the server\n');
});
