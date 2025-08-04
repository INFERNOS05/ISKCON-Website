const { neon } = require('@netlify/neon');
require('dotenv').config();

const sql = neon(process.env.NETLIFY_DATABASE_URL);

async function runMigration() {
  try {
    console.log('Running migration to add new columns...');
    
    // Add new columns
    await sql`
      ALTER TABLE donations 
      ADD COLUMN IF NOT EXISTS pan_card VARCHAR(20),
      ADD COLUMN IF NOT EXISTS address TEXT;
    `;
    
    console.log('✅ Migration completed successfully');
    
    // Test insert with new fields
    console.log('Testing insert with new fields...');
    const testData = {
      donorName: 'Test User',
      donorEmail: 'test@example.com',
      donorPhone: '1234567890',
      panCard: 'ABCDE1234F',
      address: 'Test Address, Test City',
      amount: 500,
      currency: 'INR',
      paymentType: 'one-time',
      message: 'Test donation',
      status: 'completed'
    };
    
    const result = await sql`
      INSERT INTO donations (
        donor_name, donor_email, donor_phone, pan_card, address, amount, currency, payment_type, payment_id, subscription_id, message, status, created_at
      ) VALUES (
        ${testData.donorName},
        ${testData.donorEmail},
        ${testData.donorPhone},
        ${testData.panCard},
        ${testData.address},
        ${testData.amount},
        ${testData.currency},
        ${testData.paymentType},
        ${null},
        ${null},
        ${testData.message},
        ${testData.status},
        ${new Date().toISOString()}
      ) RETURNING *;
    `;
    
    console.log('✅ Test insert successful:', result[0]);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

runMigration();
