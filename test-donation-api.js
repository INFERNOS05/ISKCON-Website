// Test the donation API endpoint
const testDonationAPI = async () => {
  console.log('🧪 Testing donation API...');
  
  const testData = {
    donorName: 'Test API User',
    donorEmail: 'test-api@example.com',
    donorPhone: '1234567890',
    address: 'Test Address API',
    panCard: 'TEST123456',
    amount: 500,
    currency: 'INR',
    paymentType: 'one_time',
    paymentId: 'test_api_' + Date.now(),
    status: 'completed',
    message: 'API Test Donation',
    receiveUpdates: true,
    paymentMethod: 'razorpay'
  };

  try {
    console.log('📤 Sending test donation data:', testData);
    
    const response = await fetch('https://prachetas.netlify.app/.netlify/functions/donations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('📨 Response status:', response.status);
    const result = await response.json();
    console.log('📋 Response data:', result);

    if (response.ok && result.success) {
      console.log('✅ Donation API test PASSED');
      return { success: true, data: result };
    } else {
      console.log('❌ Donation API test FAILED');
      return { success: false, error: result };
    }
  } catch (error) {
    console.error('💥 API test error:', error);
    return { success: false, error: error.message };
  }
};

// Test backup API as well
const testBackupAPI = async () => {
  console.log('🧪 Testing backup donation API...');
  
  const testData = {
    donorName: 'Test Backup User',
    donorEmail: 'test-backup@example.com',
    donorPhone: '9876543210',
    address: 'Test Backup Address',
    panCard: 'BACKUP123',
    amount: 750,
    paymentId: 'backup_test_' + Date.now(),
    timestamp: new Date().toISOString(),
    source: 'api-test'
  };

  try {
    console.log('📤 Sending test backup data:', testData);
    
    const response = await fetch('https://prachetas.netlify.app/.netlify/functions/backup-donation-save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('📨 Backup response status:', response.status);
    const result = await response.json();
    console.log('📋 Backup response data:', result);

    if (response.ok && result.success) {
      console.log('✅ Backup API test PASSED');
      return { success: true, data: result };
    } else {
      console.log('❌ Backup API test FAILED');
      return { success: false, error: result };
    }
  } catch (error) {
    console.error('💥 Backup API test error:', error);
    return { success: false, error: error.message };
  }
};

// Run tests
const runTests = async () => {
  console.log('🚀 Starting API tests...');
  
  const mainTest = await testDonationAPI();
  const backupTest = await testBackupAPI();
  
  console.log('\n📊 Test Results:');
  console.log('Main API:', mainTest.success ? '✅ PASSED' : '❌ FAILED');
  console.log('Backup API:', backupTest.success ? '✅ PASSED' : '❌ FAILED');
  
  if (mainTest.success && backupTest.success) {
    console.log('\n🎉 All tests PASSED! Donation system is working.');
  } else {
    console.log('\n⚠️ Some tests failed. Check the logs above.');
  }
};

// Run the tests
runTests();
