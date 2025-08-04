const donationsHandler = require('../netlify/functions/donations.js').handler;

async function testDonationFunction() {
  try {
    console.log('🧪 Testing Netlify Function with complete donation data...');
    
    const testEvent = {
      httpMethod: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        donorName: 'Test Donor',
        donorEmail: 'donor@example.com',
        donorPhone: '9876543210',
        panCard: 'XYZTF1234G',
        address: 'Test Address, Test City, Test State',
        amount: 1000,
        currency: 'INR',
        paymentType: 'one-time',
        message: 'Test donation via form',
        status: 'completed'
      })
    };
    
    const result = await donationsHandler(testEvent, {});
    
    console.log('📤 Function Response:');
    console.log('Status Code:', result.statusCode);
    console.log('Body:', JSON.parse(result.body));
    
    if (result.statusCode === 200) {
      console.log('✅ Donation function test successful!');
    } else {
      console.log('❌ Donation function test failed!');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testDonationFunction();
