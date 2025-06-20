const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { errorHandler } = require('./middleware/error.middleware.cjs');

// Import routes
const paymentRoutes = require('./routes/payment.routes.cjs');
const donationRoutes = require('./routes/donation.routes.cjs');

// Load environment variables
dotenv.config();

// Validate required environment variables
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('ERROR: Missing required environment variables:');
  console.error('Make sure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set in .env file');
  process.exit(1);
}

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api', paymentRoutes);
app.use('/api', donationRoutes);

// Error handling
app.use(errorHandler);

// Port configuration
const PORT = process.env.PORT || 8082; // Changed to 8082

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 Server is running!
📡 PORT: ${PORT}
🔗 URL: http://localhost:${PORT}
⚡ Environment: ${process.env.NODE_ENV || 'development'}
💳 Razorpay: ${process.env.RAZORPAY_KEY_ID}
  `);
});
