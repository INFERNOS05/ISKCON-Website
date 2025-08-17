require('dotenv').config({ path: '../../.env' });

console.log('🔧 Environment Check:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? `Set (${process.env.DATABASE_URL.length} chars)` : 'Not set');
console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? 'Set' : 'Not set');

const { neon } = require('@neondatabase/serverless');

async function testDatabase() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    console.log('\n📊 Testing database connection...');
    const result = await sql`SELECT NOW() as current_time, COUNT(*) as donation_count FROM donations`;
    
    console.log('✅ Database connection successful!');
    console.log('Current time:', result[0].current_time);
    console.log('Donation count:', result[0].donation_count);
    
    // Test table structure
    const columns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'donations' 
      ORDER BY ordinal_position
    `;
    
    console.log('\n📋 Table structure:');
    columns.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type}`);
    });
    
    console.log('\n🎯 Database is ready for route testing!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    process.exit(1);
  }
}

testDatabase();
