// Test to simulate exact frontend form submission
const donationsHandler = require('../netlify/functions/donations.js').handler;

async function testFormSubmission() {
  try {
    console.log('🎯 Testing form submission exactly as frontend sends...');
    
    // This mimics the exact data structure your DonationForm.tsx sends
    const formData = {
      donorName: 'Vedant Singh',
      donorEmail: 'vedant@example.com',
      donorPhone: '0000000000',
      amount: 500,
      currency: 'INR',
      paymentType: 'one-time',
      message: 'Donation for a good cause',
      status: 'completed',
      panCard: 'PANCARD123',
      address: 'wakad,Pune'
    };
    
    const testEvent = {
      httpMethod: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    };
    
    console.log('📤 Sending form data:', formData);
    
    const result = await donationsHandler(testEvent, {});
    
    console.log('\n📥 Response Status:', result.statusCode);
    const responseBody = JSON.parse(result.body);
    console.log('📥 Response Body:', responseBody);
    
    if (result.statusCode === 200 && responseBody.success) {
      console.log('\n✅ Form submission test PASSED!');
      console.log('💾 Donation saved with ID:', responseBody.donation.id);
      console.log('📧 Donor Email:', responseBody.donation.donor_email);
      console.log('💰 Amount:', `₹${responseBody.donation.amount}`);
    } else {
      console.log('\n❌ Form submission test FAILED!');
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testFormSubmission();
