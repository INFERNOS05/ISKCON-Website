const { neon } = require('@netlify/neon');
require('dotenv').config();

const sql = neon(process.env.NETLIFY_DATABASE_URL);

async function checkDonations() {
  try {
    console.log('📊 Fetching all donations from database...');
    
    const donations = await sql`
      SELECT * FROM donations ORDER BY created_at DESC LIMIT 5;
    `;
    
    console.log('📋 Recent donations:');
    donations.forEach((donation, index) => {
      console.log(`\n${index + 1}. ID: ${donation.id}`);
      console.log(`   Name: ${donation.donor_name}`);
      console.log(`   Email: ${donation.donor_email}`);
      console.log(`   Phone: ${donation.donor_phone || 'N/A'}`);
      console.log(`   PAN Card: ${donation.pan_card || 'N/A'}`);
      console.log(`   Address: ${donation.address || 'N/A'}`);
      console.log(`   Amount: ₹${donation.amount}`);
      console.log(`   Type: ${donation.payment_type}`);
      console.log(`   Status: ${donation.status}`);
      console.log(`   Created: ${donation.created_at}`);
    });
    
  } catch (error) {
    console.error('❌ Error fetching donations:', error);
  }
}

checkDonations();
