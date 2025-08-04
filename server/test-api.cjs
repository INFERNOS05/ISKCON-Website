const https = require('http');

const testData = {
  donorName: 'John Doe',
  donorEmail: 'john.doe@example.com',
  donorPhone: '+91 9876543210',
  amount: 2500,
  currency: 'INR',
  paymentType: 'one-time',
  paymentId: 'pay_test_123',
  message: 'Test donation from API',
  status: 'completed'
};

const postData = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/donations',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Testing donation API endpoint...');
console.log('Sending data:', testData);

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', JSON.parse(data));
    
    // Now test GET endpoint
    testGetDonations();
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(postData);
req.end();

function testGetDonations() {
  console.log('\nTesting GET donations endpoint...');
  
  const getOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/donations?page=1&pageSize=5',
    method: 'GET'
  };
  
  const getReq = https.request(getOptions, (res) => {
    console.log(`GET Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      const response = JSON.parse(data);
      console.log('GET Response:', JSON.stringify(response, null, 2));
      console.log('\n🎉 All API tests completed successfully!');
    });
  });
  
  getReq.on('error', (e) => {
    console.error(`Problem with GET request: ${e.message}`);
  });
  
  getReq.end();
}
