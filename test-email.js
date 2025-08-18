// test-email.js - Test the email functionality
const testEmailFunction = async () => {
  const testPayload = {
    to: 'prachetastrial@gmail.com', // Using the same email as sender for testing
    donorName: 'Test Donor',
    amount: 1000,
    currency: 'INR',
    paymentId: 'pay_test_' + Date.now(),
    donationType: 'One-time Test Donation',
    timestamp: new Date().toISOString()
  };

  console.log('🧪 Testing email function with payload:', testPayload);

  try {
    const response = await fetch('/.netlify/functions/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload)
    });

    console.log('📡 Response status:', response.status);
    
    const result = await response.json();
    console.log('📧 Email test result:', result);

    if (response.ok) {
      console.log('✅ Email test successful!');
    } else {
      console.log('❌ Email test failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Email test error:', error);
  }
};

// Run the test
testEmailFunction();
