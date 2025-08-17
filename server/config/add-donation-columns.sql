-- Add new columns to donations table for enhanced donation tracking
ALTER TABLE donations 
ADD COLUMN IF NOT EXISTS receive_updates BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'credit-card',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create index on status for better performance
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);

-- Create index on created_at for better performance
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at DESC);

-- Update existing records to have proper status values
UPDATE donations 
SET status = CASE 
  WHEN status IS NULL OR status = '' THEN 'completed'
  ELSE status 
END
WHERE status IS NULL OR status = '';

-- Add a trigger to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_donations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_donations_updated_at_trigger ON donations;
CREATE TRIGGER update_donations_updated_at_trigger
  BEFORE UPDATE ON donations
  FOR EACH ROW
  EXECUTE FUNCTION update_donations_updated_at();
