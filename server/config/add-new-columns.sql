-- Migration: Add new columns to existing donations table
ALTER TABLE donations 
ADD COLUMN IF NOT EXISTS pan_card VARCHAR(20),
ADD COLUMN IF NOT EXISTS address TEXT;
