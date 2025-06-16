# PRACHETAS Foundation NGO - Razorpay Integration Guide

This project integrates Razorpay for both one-time and monthly recurring (SIP) donations for the PRACHETAS Foundation NGO website.

## Features

- One-time donations with any amount
- Monthly SIP donations with pre-configured plans (₹100, ₹200, ₹500, ₹1000)
- Proper server-side subscription creation using Razorpay Node.js SDK
- Payment verification and error handling
- Responsive UI with clear donation steps

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your Razorpay credentials:
```
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_SECRET_KEY=your_secret_key
PORT=3001
```

3. Start the development server:
```bash
npm run dev:server
```

This will start both the frontend (Vite) and backend (Express) servers.

## Architecture

The project follows a client-server architecture:

### Frontend
- React with TypeScript
- Vite for development and building
- Razorpay JavaScript SDK for checkout UI

### Backend
- Express server for API endpoints
- Razorpay Node.js SDK for server-side operations

## API Endpoints

### Create Subscription
`POST /api/create-subscription`
Creates a new subscription using Razorpay's Node.js SDK.

### Get Plan ID
`GET /api/get-plan-id?amount=500`
Returns the appropriate plan ID for a given donation amount.

### Verify Subscription
`POST /api/verify-subscription`
Verifies a subscription payment.

### Create Order
`POST /api/create-order`
Creates a payment order for one-time donations.

### Verify Payment
`POST /api/verify-payment`
Verifies a one-time payment.

## Testing

For testing, you can use the following Razorpay test cards:
- Card number: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: Any 3 digits
- Name: Any name

## Production Deployment

Before deploying to production:
1. Update the Razorpay credentials to production keys
2. Remove any fallback/test code
3. Implement proper signature verification
4. Set up webhook endpoints for payment notifications
