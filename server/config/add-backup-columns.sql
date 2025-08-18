-- Add backup_save column to track entries saved via fallback method
ALTER TABLE donations ADD COLUMN IF NOT EXISTS backup_save BOOLEAN DEFAULT FALSE;

-- Add index for better performance on backup saves
CREATE INDEX IF NOT EXISTS idx_donations_backup_save ON donations(backup_save);

-- Add index on payment_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_donations_payment_id ON donations(payment_id);

-- Update the table to ensure we have all necessary columns
ALTER TABLE donations ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'razorpay';
ALTER TABLE donations ADD COLUMN IF NOT EXISTS receive_updates BOOLEAN DEFAULT TRUE;

-- Verify table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'donations' 
ORDER BY ordinal_position;
