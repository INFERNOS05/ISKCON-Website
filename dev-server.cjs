const express = require('express');
const path = require('path');
const cors = require('cors');

// Load environment variables explicitly
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Set environment variables globally for child processes
Object.keys(process.env).forEach(key => {
  if (process.env[key]) {
    process.env[key] = process.env[key];
  }
});

// Debug environment loading
console.log('🔧 Environment Debug:');
console.log('DATABASE_URL length:', process.env.DATABASE_URL?.length || 0);
console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? 'Set' : 'Not set');
console.log('Working directory:', process.cwd());

const app = express();
const PORT = process.env.PORT || 8888;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// Import Netlify functions AFTER setting environment
const donationsHandler = require('./netlify/functions/donations.cjs');
const createOrderHandler = require('./netlify/functions/create-order.cjs');
const verifyPaymentHandler = require('./netlify/functions/verify-payment.cjs');
const createSubscriptionHandler = require('./netlify/functions/create-subscription.cjs');
const getPlanIdHandler = require('./netlify/functions/get-plan-id.cjs');
const testDatabaseHandler = require('./netlify/functions/test-database-routes.cjs');

// Function wrapper to convert Netlify format to Express
const wrapNetlifyFunction = (handler) => {
  return async (req, res) => {
    const event = {
      httpMethod: req.method,
      headers: req.headers,
      body: req.body ? JSON.stringify(req.body) : null,
      queryStringParameters: req.query,
      path: req.path
    };

    const context = {};

    try {
      const result = await handler.handler(event, context);
      
      // Set headers from the result
      if (result.headers) {
        Object.entries(result.headers).forEach(([key, value]) => {
          res.set(key, value);
        });
      }

      res.status(result.statusCode || 200);
      
      if (result.body) {
        try {
          const parsedBody = JSON.parse(result.body);
          res.json(parsedBody);
        } catch {
          res.send(result.body);
        }
      } else {
        res.end();
      }
    } catch (error) {
      console.error('Function error:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Internal server error' 
      });
    }
  };
};

// API Routes - mimic Netlify Functions
app.all('/.netlify/functions/donations', wrapNetlifyFunction(donationsHandler));
app.all('/.netlify/functions/create-order', wrapNetlifyFunction(createOrderHandler));
app.all('/.netlify/functions/verify-payment', wrapNetlifyFunction(verifyPaymentHandler));
app.all('/.netlify/functions/create-subscription', wrapNetlifyFunction(createSubscriptionHandler));
app.all('/.netlify/functions/get-plan-id', wrapNetlifyFunction(getPlanIdHandler));
app.all('/.netlify/functions/test-database-routes', wrapNetlifyFunction(testDatabaseHandler));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: {
      hasDatabase: !!process.env.DATABASE_URL,
      hasRazorpay: !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
      testMode: process.env.TEST_MODE === 'true'
    }
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ISKCON Website server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test database: http://localhost:${PORT}/.netlify/functions/test-database-routes`);
  console.log(`💰 Donations API: http://localhost:${PORT}/.netlify/functions/donations`);
  
  // Environment check
  console.log('\n🔧 Environment Status:');
  console.log(`Database: ${process.env.DATABASE_URL ? '✅ Connected' : '❌ Not configured'}`);
  console.log(`Razorpay: ${process.env.RAZORPAY_KEY_ID ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`Test Mode: ${process.env.TEST_MODE === 'true' ? '✅ Enabled' : '❌ Disabled'}`);
});

module.exports = app;
