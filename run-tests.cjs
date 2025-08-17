require('dotenv').config();

// Simulate Netlify function environment
process.env.DATABASE_URL = process.env.DATABASE_URL;
process.env.RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
process.env.RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

const testDatabaseHandler = require('./netlify/functions/test-database-routes.cjs');

async function runDatabaseTests() {
  console.log('🧪 Running Database Routes Test...\n');
  
  // Simulate Netlify function event
  const event = {
    httpMethod: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ test: true })
  };
  
  const context = {};
  
  try {
    const result = await testDatabaseHandler.handler(event, context);
    
    console.log('Status Code:', result.statusCode);
    
    if (result.body) {
      const response = JSON.parse(result.body);
      
      if (response.success) {
        console.log('✅ Database routes test completed successfully!\n');
        
        const results = response.results;
        console.log(`📊 Test Summary: ${results.summary.passed}/${results.summary.total} tests passed (${results.summary.successRate})`);
        console.log(`Status: ${results.summary.status}\n`);
        
        console.log('📋 Individual Test Results:');
        results.tests.forEach((test, index) => {
          const status = test.success ? '✅' : '❌';
          console.log(`${status} ${test.test}`);
          if (!test.success && test.error) {
            console.log(`   Error: ${test.error}`);
          }
        });
        
        if (results.summary.status === 'ALL_TESTS_PASSED') {
          console.log('\n🎉 All database routes are working perfectly!');
          console.log('🚀 Your ISKCON donation system is ready for production!');
        } else {
          console.log('\n⚠️  Some tests failed, but basic functionality is working.');
        }
        
      } else {
        console.error('❌ Test failed:', response.error);
      }
    }
    
  } catch (error) {
    console.error('❌ Error running tests:', error.message);
  }
}

runDatabaseTests();
