#!/usr/bin/env node

/**
 * Database Routes Validation Script
 * 
 * This script validates that all database routes work properly with the Razorpay test API
 * Run this script to verify your setup before going live
 */

const https = require('https');
const http = require('http');

// Configuration
const CONFIG = {
  // Change this to your actual Netlify site URL or local development server
  baseUrl: process.env.SITE_URL || 'http://localhost:8888',
  
  // Test data for validation
  testDonation: {
    fullName: 'Test Donor Route Validation',
    email: 'test-routes@example.com',
    phoneNumber: '9999999999',
    amount: '100',
    donationType: 'one-time',
    paymentMethod: 'credit-card',
    message: 'Test donation for route validation',
    receiveUpdates: true
  }
};

// ANSI color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Helper function to make HTTP requests
function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const requestModule = isHttps ? https : http;
    
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'ISKCON-Route-Validator/1.0'
      }
    };

    if (data && (method === 'POST' || method === 'PATCH')) {
      const dataString = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(dataString);
    }

    const req = requestModule.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: parsedData
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: responseData,
            parseError: error.message
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data && (method === 'POST' || method === 'PATCH')) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Test logging helper
function logTest(testName, status, details = '') {
  const statusColor = status === 'PASS' ? colors.green : 
                     status === 'FAIL' ? colors.red : colors.yellow;
  
  console.log(`${statusColor}${status}${colors.reset} ${colors.bold}${testName}${colors.reset}`);
  if (details) {
    console.log(`     ${details}`);
  }
}

// Main validation function
async function validateDatabaseRoutes() {
  console.log(`${colors.blue}${colors.bold}🔍 ISKCON Website - Database Routes Validation${colors.reset}`);
  console.log(`${colors.blue}Testing against: ${CONFIG.baseUrl}${colors.reset}\n`);

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    tests: []
  };

  // Test 1: Check if database test route is available
  try {
    console.log(`${colors.yellow}📋 Test 1: Database Route Test Function${colors.reset}`);
    
    const response = await makeRequest(`${CONFIG.baseUrl}/.netlify/functions/test-database-routes`, 'POST');
    results.total++;
    
    if (response.statusCode === 200 && response.data.success) {
      results.passed++;
      logTest('Database Test Route', 'PASS', `All database operations working: ${response.data.results.summary.successRate}`);
      
      // Log detailed test results
      if (response.data.results && response.data.results.tests) {
        response.data.results.tests.forEach(test => {
          const status = test.success ? 'PASS' : 'FAIL';
          logTest(`  └─ ${test.test}`, status, test.error || '');
        });
      }
    } else {
      results.failed++;
      logTest('Database Test Route', 'FAIL', `Status: ${response.statusCode}, Error: ${response.data.error || 'Unknown error'}`);
    }
  } catch (error) {
    results.total++;
    results.failed++;
    logTest('Database Test Route', 'FAIL', `Network Error: ${error.message}`);
  }

  console.log();

  // Test 2: Check donations endpoint
  try {
    console.log(`${colors.yellow}📋 Test 2: Donations API Endpoint${colors.reset}`);
    
    const response = await makeRequest(`${CONFIG.baseUrl}/.netlify/functions/donations?page=1&pageSize=1`);
    results.total++;
    
    if (response.statusCode === 200 && response.data.success) {
      results.passed++;
      logTest('Donations GET Endpoint', 'PASS', `Retrieved donations successfully`);
    } else {
      results.failed++;
      logTest('Donations GET Endpoint', 'FAIL', `Status: ${response.statusCode}`);
    }
  } catch (error) {
    results.total++;
    results.failed++;
    logTest('Donations GET Endpoint', 'FAIL', `Network Error: ${error.message}`);
  }

  console.log();

  // Test 3: Check create-order endpoint
  try {
    console.log(`${colors.yellow}📋 Test 3: Razorpay Create Order Endpoint${colors.reset}`);
    
    const orderData = {
      amount: 10000, // ₹100 in paise
      currency: 'INR',
      receipt: 'test_receipt_' + Date.now()
    };

    const response = await makeRequest(`${CONFIG.baseUrl}/.netlify/functions/create-order`, 'POST', orderData);
    results.total++;
    
    if (response.statusCode === 200 && response.data.success) {
      results.passed++;
      logTest('Create Order Endpoint', 'PASS', `Order created with ID: ${response.data.order?.id || 'N/A'}`);
    } else {
      results.failed++;
      logTest('Create Order Endpoint', 'FAIL', `Status: ${response.statusCode}, Error: ${response.data.error || 'Unknown'}`);
    }
  } catch (error) {
    results.total++;
    results.failed++;
    logTest('Create Order Endpoint', 'FAIL', `Network Error: ${error.message}`);
  }

  console.log();

  // Test 4: Check get-plan-id endpoint
  try {
    console.log(`${colors.yellow}📋 Test 4: Get Plan ID Endpoint${colors.reset}`);
    
    const response = await makeRequest(`${CONFIG.baseUrl}/.netlify/functions/get-plan-id?amount=500`);
    results.total++;
    
    if (response.statusCode === 200 && response.data.success) {
      results.passed++;
      logTest('Get Plan ID Endpoint', 'PASS', `Plan ID: ${response.data.planId}, Amount: ₹${response.data.amount}`);
    } else {
      results.failed++;
      logTest('Get Plan ID Endpoint', 'FAIL', `Status: ${response.statusCode}, Error: ${response.data.error || 'Unknown'}`);
    }
  } catch (error) {
    results.total++;
    results.failed++;
    logTest('Get Plan ID Endpoint', 'FAIL', `Network Error: ${error.message}`);
  }

  console.log();

  // Test 5: Environment Configuration Check
  try {
    console.log(`${colors.yellow}📋 Test 5: Environment Configuration${colors.reset}`);
    
    const envChecks = [
      { name: 'DATABASE_URL', value: process.env.DATABASE_URL },
      { name: 'RAZORPAY_KEY_ID', value: process.env.RAZORPAY_KEY_ID },
      { name: 'RAZORPAY_KEY_SECRET', value: process.env.RAZORPAY_KEY_SECRET }
    ];

    let envScore = 0;
    envChecks.forEach(check => {
      if (check.value) {
        envScore++;
        logTest(`  └─ ${check.name}`, 'PASS', 'Configured');
      } else {
        logTest(`  └─ ${check.name}`, 'FAIL', 'Missing or empty');
      }
    });

    results.total++;
    if (envScore === envChecks.length) {
      results.passed++;
      logTest('Environment Configuration', 'PASS', 'All required variables configured');
    } else {
      results.failed++;
      logTest('Environment Configuration', 'FAIL', `${envScore}/${envChecks.length} variables configured`);
    }
  } catch (error) {
    results.total++;
    results.failed++;
    logTest('Environment Configuration', 'FAIL', `Error: ${error.message}`);
  }

  // Final Results
  console.log(`\n${colors.blue}${colors.bold}📊 Final Results${colors.reset}`);
  console.log(`${colors.blue}─────────────────${colors.reset}`);
  
  const successRate = results.total > 0 ? ((results.passed / results.total) * 100).toFixed(1) : 0;
  const overallStatus = results.failed === 0 ? 'PASS' : 'FAIL';
  const statusColor = overallStatus === 'PASS' ? colors.green : colors.red;
  
  console.log(`${colors.bold}Total Tests:${colors.reset} ${results.total}`);
  console.log(`${colors.green}${colors.bold}Passed:${colors.reset} ${results.passed}`);
  console.log(`${colors.red}${colors.bold}Failed:${colors.reset} ${results.failed}`);
  console.log(`${colors.bold}Success Rate:${colors.reset} ${successRate}%`);
  console.log(`${statusColor}${colors.bold}Overall Status: ${overallStatus}${colors.reset}`);

  if (overallStatus === 'PASS') {
    console.log(`\n${colors.green}${colors.bold}✅ All database routes are working correctly with Razorpay test API!${colors.reset}`);
    console.log(`${colors.green}Your ISKCON donation system is ready for testing.${colors.reset}`);
  } else {
    console.log(`\n${colors.red}${colors.bold}❌ Some tests failed. Please review the errors above.${colors.reset}`);
    console.log(`${colors.yellow}Fix the failing tests before deploying to production.${colors.reset}`);
  }

  return overallStatus === 'PASS';
}

// Check if script is run directly
if (require.main === module) {
  validateDatabaseRoutes()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error(`${colors.red}${colors.bold}❌ Validation script failed:${colors.reset}`, error.message);
      process.exit(1);
    });
}

module.exports = { validateDatabaseRoutes, makeRequest };
