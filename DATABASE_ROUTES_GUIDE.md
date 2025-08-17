# Database Routes & Payment Gateway Integration Guide

## Overview

This document explains how the ISKCON website's database routes are integrated with the Razorpay payment gateway, ensuring reliable data persistence regardless of payment status.

## 🏗️ Architecture

### Flow Diagram
```
User Fills Form → Save to Database (PENDING) → Payment Gateway → Update Status (COMPLETED/FAILED) → Send Email
```

### Core Principle
**💡 Form data is ALWAYS saved to the database first, before payment processing begins.**

## 📁 Database Routes

### 1. **POST** `/netlify/functions/donations`
**Purpose:** Create new donation record

**Request Body:**
```json
{
  "donorName": "John Doe",
  "donorEmail": "john@example.com", 
  "donorPhone": "9999999999",
  "amount": 500,
  "currency": "INR",
  "paymentType": "one-time", // or "monthly"
  "message": "Donation message",
  "status": "pending",
  "panCard": "ABCDE1234F",
  "address": "Full address",
  "receiveUpdates": true,
  "paymentMethod": "credit-card"
}
```

**Response:**
```json
{
  "success": true,
  "donation": {
    "id": "donation_123",
    "status": "pending",
    "created_at": "2024-01-01T10:00:00Z"
  }
}
```

### 2. **PATCH** `/netlify/functions/donations`
**Purpose:** Update donation status after payment

**Request Body:**
```json
{
  "donationId": "donation_123",
  "status": "completed", // or "failed", "cancelled"
  "paymentId": "pay_razorpay_123", // Optional
  "subscriptionId": "sub_razorpay_123", // Optional for monthly donations
  "updatedAt": "2024-01-01T10:05:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "donation": {
    "id": "donation_123",
    "status": "completed",
    "payment_id": "pay_razorpay_123"
  },
  "email": {
    "sent": true,
    "recipient": "john@example.com"
  }
}
```

### 3. **GET** `/netlify/functions/donations`
**Purpose:** Retrieve donation records with pagination

**Query Parameters:**
- `page`: Page number (default: 1)
- `pageSize`: Records per page (default: 10)

**Response:**
```json
{
  "success": true,
  "donations": [...],
  "totalCount": 150,
  "page": 1,
  "pageSize": 10,
  "totalPages": 15
}
```

## 💳 Payment Gateway Routes

### 1. **POST** `/netlify/functions/create-order`
**Purpose:** Create Razorpay order for one-time payments

**Request Body:**
```json
{
  "amount": 50000, // Amount in paise (₹500.00)
  "currency": "INR",
  "receipt": "donation_123",
  "notes": {
    "donationId": "donation_123",
    "donorName": "John Doe",
    "donorEmail": "john@example.com"
  }
}
```

### 2. **POST** `/netlify/functions/create-subscription`
**Purpose:** Create Razorpay subscription for monthly payments

**Request Body:**
```json
{
  "planId": "plan_Qh8r9nUPEt3Dbv",
  "customerDetails": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "notes": {
    "donationId": "donation_123",
    "donationType": "monthly"
  }
}
```

### 3. **GET** `/netlify/functions/get-plan-id?amount=500`
**Purpose:** Get subscription plan ID for specific amount

**Response:**
```json
{
  "success": true,
  "planId": "plan_Qh8r9nUPEt3Dbv",
  "amount": 500,
  "exactMatch": true
}
```

### 4. **POST** `/netlify/functions/verify-payment`
**Purpose:** Verify payment signature from Razorpay

**Request Body:**
```json
{
  "razorpay_order_id": "order_123",
  "razorpay_payment_id": "pay_123",
  "razorpay_signature": "signature_hash"
}
```

## 🔄 Complete Integration Flow

### One-Time Donation Flow

1. **User submits form** → `DonationForm.tsx` validates data
2. **Save to database** → `POST /donations` with status `"pending"`
3. **Create Razorpay order** → `POST /create-order`
4. **Open payment UI** → Razorpay checkout modal
5. **Payment completion** → Razorpay callback with payment details
6. **Verify payment** → `POST /verify-payment`
7. **Update donation** → `PATCH /donations` with status `"completed"`
8. **Send receipt** → Email triggered automatically

### Monthly Subscription Flow

1. **User submits form** → `DonationForm.tsx` validates data
2. **Save to database** → `POST /donations` with status `"pending"`
3. **Get plan ID** → `GET /get-plan-id?amount=500`
4. **Create subscription** → `POST /create-subscription`
5. **Open payment UI** → Razorpay subscription modal
6. **Payment completion** → Razorpay callback with subscription details
7. **Verify payment** → `POST /verify-payment`
8. **Update donation** → `PATCH /donations` with `subscriptionId`
9. **Send receipt** → Email triggered automatically

## 🛡️ Error Handling & Data Persistence

### Key Features

1. **Data Always Saved:** Form data is saved to database before payment processing
2. **Status Tracking:** Each donation has a status (`pending`, `completed`, `failed`, `cancelled`)
3. **Payment Recovery:** Failed payments can be retried without data loss
4. **Audit Trail:** Complete history with `created_at` and `updated_at` timestamps

### Error Scenarios

| Scenario | Database Status | User Experience | Recovery Action |
|----------|----------------|-----------------|-----------------|
| Payment fails | `failed` | Error message, retry option | User can retry payment |
| Payment cancelled | `cancelled` | Cancellation notice | User can start new donation |
| Network error | `pending` | Error message | System can retry automatically |
| Payment success | `completed` | Success message + email | Receipt sent |

## 🧪 Testing with Razorpay Test API

### Environment Variables Required

```bash
# Razorpay Test Keys
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret

# Database
DATABASE_URL=your_neon_database_url

# Site URL
URL=https://your-site.netlify.app
```

### Test Card Numbers (Razorpay Test Mode)

- **Success:** `4111111111111111`
- **Failure:** `4000000000000002`
- **Network Error:** `4000000000000119`

### Running Tests

1. **Automatic Testing:**
   ```bash
   node scripts/validate-routes.js
   ```

2. **Manual Testing:**
   ```bash
   # Test database routes
   curl -X POST https://your-site.netlify.app/.netlify/functions/test-database-routes
   
   # Test create order
   curl -X POST https://your-site.netlify.app/.netlify/functions/create-order \
     -H "Content-Type: application/json" \
     -d '{"amount": 50000, "currency": "INR", "receipt": "test_123"}'
   ```

## 📊 Database Schema

```sql
CREATE TABLE donations (
  id SERIAL PRIMARY KEY,
  donor_name VARCHAR(255) NOT NULL,
  donor_email VARCHAR(255) NOT NULL,
  donor_phone VARCHAR(20),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  payment_type VARCHAR(20) NOT NULL, -- 'one-time' or 'monthly'
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'cancelled'
  pan_card VARCHAR(20),
  address TEXT,
  payment_id VARCHAR(255), -- Razorpay payment ID
  subscription_id VARCHAR(255), -- Razorpay subscription ID
  receive_updates BOOLEAN DEFAULT false,
  payment_method VARCHAR(50), -- 'credit-card', 'paypal', 'bank-transfer'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_donations_email ON donations(donor_email);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_created_at ON donations(created_at);
CREATE INDEX idx_donations_payment_id ON donations(payment_id);
```

## 🚀 Deployment Checklist

### Before Going Live:

- [ ] Replace test Razorpay keys with live keys
- [ ] Update environment variables in Netlify
- [ ] Test all payment flows with live keys
- [ ] Set up proper error monitoring
- [ ] Configure email service for receipts
- [ ] Test database backup/restore procedures

### Monitoring:

- [ ] Set up database performance monitoring
- [ ] Configure payment failure alerts
- [ ] Monitor email delivery rates
- [ ] Track donation completion rates

## 🔧 Troubleshooting

### Common Issues:

1. **Payment Gateway Not Loading**
   - Check if Razorpay script is loaded in `index.html`
   - Verify `RAZORPAY_KEY_ID` environment variable

2. **Database Connection Errors**
   - Verify `DATABASE_URL` environment variable
   - Check Neon database status and connection limits

3. **Email Not Sending**
   - Check email service configuration
   - Verify SMTP settings if using custom email service

4. **CORS Errors**
   - Ensure all API functions include proper CORS headers
   - Verify domain configuration in Razorpay dashboard

### Debug Mode:

Add this to your `.env` file for detailed logging:
```bash
DEBUG=true
LOG_LEVEL=verbose
```

## 📞 Support

For issues with:
- **Payment Gateway:** Contact Razorpay support
- **Database:** Check Neon documentation
- **Deployment:** Review Netlify deployment logs
- **Email Service:** Verify email provider status

---

**✅ This integration ensures 100% data persistence regardless of payment status, providing a robust donation system for the ISKCON website.**
