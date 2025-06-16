# PRACHETAS Foundation NGO Website

This repository contains the source code for the PRACHETAS Foundation NGO website, featuring a donation system with Razorpay integration for both one-time and recurring (SIP) payments.

## Project Structure

```
evergreen-compassion-web/
├── public/              # Static assets
├── src/                 # Frontend source code
│   ├── components/      # React components
│   │   ├── DonationForm.tsx # Main donation form component
│   │   └── ui/         # Reusable UI components
│   ├── lib/            # Utilities and services
│   │   ├── razorpay.ts # Razorpay integration
│   │   ├── payment-service.ts # Payment verification service
│   │   └── supabase.ts # Supabase client and donation service
│   └── pages/          # Page components
├── server/             # Backend API server
│   ├── config/         # Server configuration
│   │   └── supabase.cjs # Supabase configuration for server
│   ├── controllers/    # Request handlers
│   │   └── donation.controller.cjs # Donation controller
│   ├── middleware/     # Express middleware
│   │   └── error.middleware.cjs # Error handling middleware
│   ├── routes/         # API routes
│   │   ├── donation.routes.cjs # Donation-related routes
│   │   └── payment.routes.cjs # Payment-related routes
│   └── server.cjs      # Main server file
└── .env*               # Environment variables for different environments
```

## Features

- One-time donations with any amount
- Monthly SIP (recurring) donations with pre-configured plans
- Proper server-side Razorpay integration
- Database integration with Supabase for donation tracking
- Responsive UI with clear donation steps

## Tech Stack

- **Frontend**: React, TypeScript, Vite, ShadcnUI, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **Payment**: Razorpay
- **Deployment**: PM2 (for Node.js production deployment)

## Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
   - Copy `.env.example` to `.env` for development
   - Update with your Razorpay and Supabase credentials

3. **Development mode**:
```bash
npm run dev:server
```
This starts both the frontend and backend servers.

## Database Setup

### Supabase Schema

Create the following table in your Supabase project:

```sql
CREATE TABLE donations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_name TEXT NOT NULL,
    donor_email TEXT NOT NULL,
    donor_phone TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    payment_type TEXT NOT NULL,
    payment_id TEXT,
    subscription_id TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_donations_email ON donations(donor_email);
CREATE INDEX idx_donations_payment_id ON donations(payment_id);
CREATE INDEX idx_donations_subscription_id ON donations(subscription_id);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_created_at ON donations(created_at);
```

## Production Deployment

1. **Build the frontend**:
```bash
npm run build
```

2. **Set up production environment**:
   - Configure `.env.production` with your production credentials
   - Make sure to use production keys for Razorpay and Supabase

3. **Run with PM2**:
```bash
npm install -g pm2
pm2 start ecosystem.config.js --env production
```

## Razorpay Integration

The application integrates with Razorpay for both one-time and recurring payments:

- **One-time payments**: Uses the standard Razorpay checkout flow with order creation
- **Recurring (SIP) payments**: Uses Razorpay subscriptions with pre-configured plans

For SIP donations, the following plan IDs are used:
- ₹100/month: `plan_Qh8r9nUPEt3Dbv`
- ₹200/month: `plan_Qh8s8EzXQr7DXu`
- ₹500/month: `plan_QhlbDG7RIgx5Ov`
- ₹1000/month: `plan_QhlcT03kYhZf6v`

For testing, you can use the following Razorpay test card:
- Card number: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits

## API Endpoints

### Payment API

- `POST /api/create-subscription`: Creates a new subscription
- `POST /api/verify-subscription`: Verifies a subscription payment
- `POST /api/verify-payment`: Verifies a one-time payment
- `GET /api/get-plan-id`: Gets the appropriate plan ID for a donation amount
- `POST /api/create-order`: Creates a payment order for one-time payments

### Donation API

- `POST /api/donations`: Saves donation details to database
- `GET /api/donations`: Gets all donations with pagination

## License

Copyright © 2025 PRACHETAS Foundation. All rights reserved.
