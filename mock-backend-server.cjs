/**
 * Mock Backend Server for Testing Custom SIP Donations
 * This runs the Netlify Functions locally without needing Netlify CLI
 */

// Load environment variables first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

// Load Netlify Functions
const getPlanId = require('./netlify/functions/get-plan-id.cjs');
const createOrder = require('./netlify/functions/create-order.cjs');
const createSubscription = require('./netlify/functions/create-subscription.cjs');
const checkRazorpay = require('./netlify/functions/check-razorpay.cjs');

const app = express();
const PORT = 8888;

// Middleware
app.use(cors());
app.use(express.json());

// Mock Netlify Functions
app.all('/.netlify/functions/:functionName', async (req, res) => {
  const { functionName } = req.params;
  
  console.log(`\n📡 Function called: ${functionName}`);
  console.log(`   Method: ${req.method}`);
  console.log(`   Query:`, req.query);
  console.log(`   Body:`, req.body);
  
  // Create mock Netlify event
  const event = {
    httpMethod: req.method,
    headers: req.headers,
    queryStringParameters: req.query,
    body: JSON.stringify(req.body),
    path: req.path,
  };
  
  // Create mock Netlify context
  const context = {};
  
  let handler;
  
  try {
    switch (functionName) {
      case 'get-plan-id':
        handler = getPlanId.handler;
        break;
      case 'create-order':
        handler = createOrder.handler;
        break;
      case 'create-subscription':
        handler = createSubscription.handler;
        break;
      case 'check-razorpay':
        handler = checkRazorpay.handler;
        break;
      default:
        return res.status(404).json({ error: `Function ${functionName} not found` });
    }
    
    const result = await handler(event, context);
    
    console.log(`   ✅ Result: ${result.statusCode}`);
    
    res.status(result.statusCode || 200)
      .set(result.headers || {})
      .send(result.body);
      
  } catch (error) {
    console.error(`   ❌ Error:`, error);
    res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mock backend server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 Mock Backend Server Started!');
  console.log('='.repeat(70));
  console.log(`\n📍 Server running at: http://localhost:${PORT}`);
  console.log(`\n📋 Available functions:`);
  console.log(`   - /.netlify/functions/get-plan-id`);
  console.log(`   - /.netlify/functions/create-order`);
  console.log(`   - /.netlify/functions/create-subscription`);
  console.log(`   - /.netlify/functions/check-razorpay`);
  console.log('\n💡 Make sure your frontend is configured to use this backend');
  console.log('='.repeat(70));
  console.log('\nPress Ctrl+C to stop the server\n');
});
