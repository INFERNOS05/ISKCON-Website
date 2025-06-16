# Razorpay Integration Server

This server provides backend endpoints for the NGO Donation Form to integrate with Razorpay's API for both one-time payments and recurring SIP donations.

## Features

- Creates Razorpay subscriptions using the proper Node.js SDK method
- Determines the appropriate Plan ID for SIP donations based on amount
- Verifies payments and subscriptions
- Creates payment orders for one-time donations

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

## Environment Variables

The server uses the following environment variables:
- `RAZORPAY_KEY_ID` - Your Razorpay key ID
- `RAZORPAY_SECRET_KEY` - Your Razorpay secret key
- `PORT` - Port the server runs on (default: 3001)

## Running the Server

To start the server:
```bash
npm run server
```

To run both frontend and backend together:
```bash
npm run dev:server
```
