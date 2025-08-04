-- SQL for Neon DB: Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id SERIAL PRIMARY KEY,
  donor_name VARCHAR(255) NOT NULL,
  donor_email VARCHAR(255) NOT NULL,
  donor_phone VARCHAR(20),
  amount NUMERIC(12,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  payment_type VARCHAR(50),
  payment_id VARCHAR(100),
  subscription_id VARCHAR(100),
  message TEXT,
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
