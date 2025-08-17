const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const sql = neon(process.env.NETLIFY_DATABASE_URL);

async function runMigration() {
  try {
    console.log('Running donation table migration...');
    
    // Execute each migration statement individually
    console.log('Adding receive_updates column...');
    await sql`ALTER TABLE donations ADD COLUMN IF NOT EXISTS receive_updates BOOLEAN DEFAULT FALSE`;
    
    console.log('Adding payment_method column...');
    await sql`ALTER TABLE donations ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'credit-card'`;
    
    console.log('Adding updated_at column...');
    await sql`ALTER TABLE donations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`;
    
    console.log('Creating status index...');
    await sql`CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status)`;
    
    console.log('Creating created_at index...');
    await sql`CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at DESC)`;
    
    console.log('Updating existing records...');
    await sql`UPDATE donations SET status = CASE WHEN status IS NULL OR status = '' THEN 'completed' ELSE status END WHERE status IS NULL OR status = ''`;
    
    console.log('Creating update function...');
    await sql`CREATE OR REPLACE FUNCTION update_donations_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = CURRENT_TIMESTAMP; RETURN NEW; END; $$ language 'plpgsql'`;
    
    console.log('Dropping existing trigger...');
    await sql`DROP TRIGGER IF EXISTS update_donations_updated_at_trigger ON donations`;
    
    console.log('Creating new trigger...');
    await sql`CREATE TRIGGER update_donations_updated_at_trigger BEFORE UPDATE ON donations FOR EACH ROW EXECUTE FUNCTION update_donations_updated_at()`;
    
    console.log('✅ Migration completed successfully!');
    
    // Test the table structure
    const tableInfo = await sql`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'donations' 
      ORDER BY ordinal_position
    `;
    
    console.log('📊 Updated table structure:');
    console.table(tableInfo);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
