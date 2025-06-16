# Supabase Integration Guide for Evergreen Compassion Web

This document outlines how to set up and use Supabase for the donation system and authentication in the Evergreen Compassion Web application.

## 1. Supabase Setup

### Create a Supabase Project

1. Sign up or log in at [https://supabase.com](https://supabase.com)
2. Create a new project and note down your:
   - Project URL
   - API Keys (anon/public key and service role key)

### Database Schema

Create the following table in your Supabase SQL editor:

```sql
-- Donations table to store all donation records
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  donor_phone TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_type TEXT NOT NULL,
  payment_id TEXT,
  subscription_id TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Add an index on donor_email for faster lookups
CREATE INDEX idx_donations_donor_email ON donations(donor_email);

-- Add a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_donations_updated_at
BEFORE UPDATE ON donations
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- User roles table (optional - for admin access control)
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'viewer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, role)
);
```

## 2. Authentication Setup

### Enable Email Authentication

1. Go to **Authentication** -> **Providers** in your Supabase dashboard
2. Enable Email provider and configure as needed
3. Optionally, enable other providers (Google, GitHub, etc.)

### Create Admin User

1. Go to **Authentication** -> **Users** in your Supabase dashboard
2. Click "Invite User" and enter the admin email
3. Set a secure password
4. After creating the user, make note of their UUID

### Assign Admin Role (Option 1: Using SQL)

```sql
-- Insert admin role for a specific user
-- Replace the user_id with the UUID from the auth.users table
INSERT INTO user_roles (user_id, role)
VALUES ('user-uuid-here', 'admin');
```

### Assign Admin Role (Option 2: Using Code-based Whitelist)

We've implemented a simple email-based whitelist in `auth-context.tsx`. You can modify this list:

```typescript
// In auth-context.tsx
const adminEmails = ['admin@evergreen-compassion.org'];
setIsAdmin(adminEmails.includes(user.email || ''));
```

## 3. Environment Variables

Update your `.env` file with the following Supabase credentials:

```
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 4. Using the Donation Service

### Frontend Usage

```typescript
import { donationService } from "@/lib/supabase";

// Save a donation
const saveDonation = async (donationData) => {
  try {
    const result = await donationService.saveDonation({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "1234567890",
      amount: 1000,
      isMonthly: false,
      paymentId: "pay_123456789",
      status: "completed",
      message: "Best wishes"
    });
    return result;
  } catch (error) {
    console.error("Error saving donation:", error);
  }
};

// Fetch donations (admin only)
const fetchDonations = async () => {
  try {
    const result = await donationService.getDonations("", 1, 20);
    // result contains: donations, totalCount, page, pageSize, totalPages
    return result;
  } catch (error) {
    console.error("Error fetching donations:", error);
  }
};
```

### Backend Usage

```javascript
const { donationService } = require('../config/supabase.cjs');

// In your controller/route handler
app.post('/api/donations', async (req, res) => {
  try {
    const donationData = {
      donorName: `${req.body.firstName} ${req.body.lastName}`,
      donorEmail: req.body.email,
      donorPhone: req.body.phone,
      amount: req.body.amount,
      currency: 'INR',
      paymentType: req.body.isMonthly ? 'monthly_sip' : 'one_time',
      paymentId: req.body.paymentId,
      subscriptionId: req.body.subscriptionId,
      message: req.body.message,
      status: req.body.status || 'completed'
    };
    
    const result = await donationService.saveDonation(donationData);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

## 5. Authentication and Admin Dashboard

### Using the Auth Context

The `auth-context.tsx` provides authentication hooks:

```typescript
import { useAuth } from "@/lib/auth-context";

const MyComponent = () => {
  const { user, signIn, signOut, isAdmin } = useAuth();

  // Check if user is logged in
  if (user) {
    console.log("User is logged in:", user.email);
  }

  // Check if user has admin privileges
  if (isAdmin) {
    console.log("User is an admin");
  }

  // Login function
  const handleLogin = async () => {
    const { error } = await signIn("admin@example.com", "password");
    if (error) {
      console.error("Login error:", error.message);
    }
  };

  // Logout function
  const handleLogout = async () => {
    await signOut();
  };
};
```

### Protected Routes

The `ProtectedRoute` component secures routes for authenticated users:

```typescript
import ProtectedRoute from "@/components/ProtectedRoute";

// In your routing structure:
<Route path="/admin" element={
  <ProtectedRoute requireAdmin={true}>
    <AdminPage />
  </ProtectedRoute>
} />
```

## 6. Row Level Security (Recommended)

For added security, enable Row Level Security in Supabase:

```sql
-- Enable RLS
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users only"
ON donations
FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for all users"
ON donations
FOR INSERT
WITH CHECK (true);

-- Policy for the user_roles table
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Only admins can view or modify roles
CREATE POLICY "Only admins can view roles"
ON user_roles
FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  )
);

CREATE POLICY "Only admins can modify roles"
ON user_roles
USING (
  auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  )
);
```

## 7. Additional Features (Future Implementation)

- **Donation Analytics**: Extend the admin dashboard with charts and statistics
- **Email Notifications**: Set up webhooks to send thank you emails
- **Recurring Payment Management**: Add UI for donors to manage recurring donations
- **Admin User Management**: Create interfaces to manage admin users
- **Export Functionality**: Add options to export donation data as CSV/Excel
