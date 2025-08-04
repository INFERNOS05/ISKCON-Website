const sql = require('./config/postgres.cjs');

async function testNeonDB() {
  try {
    console.log('Testing Neon DB connection...');
    
    // Test creating table
    console.log('Creating donations table...');
    await sql`
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
    `;
    console.log('✅ Table created successfully');

    // Test inserting sample data
    console.log('Inserting test donation...');
    const result = await sql`
      INSERT INTO donations (
        donor_name, donor_email, donor_phone, amount, currency, payment_type, payment_id, message, status, created_at
      ) VALUES (
        ${'Test Donor'},
        ${'test@example.com'},
        ${'+91 9876543210'},
        ${1000},
        ${'INR'},
        ${'test'},
        ${'test_payment_123'},
        ${'Test donation message'},
        ${'completed'},
        ${new Date().toISOString()}
      ) RETURNING *;
    `;
    console.log('✅ Test donation inserted:', result[0]);

    // Test fetching data
    console.log('Fetching donations...');
    const donations = await sql`SELECT * FROM donations ORDER BY created_at DESC LIMIT 5;`;
    console.log('✅ Donations fetched:', donations.length, 'records');

    // Test count
    const countResult = await sql`SELECT COUNT(*) FROM donations;`;
    console.log('✅ Total donations count:', countResult[0].count);

    console.log('🎉 All tests passed! Neon DB is working correctly.');
    
  } catch (error) {
    console.error('❌ Error testing Neon DB:', error);
    console.error('Make sure to set NETLIFY_DATABASE_URL in your .env file');
  }
}

testNeonDB();
