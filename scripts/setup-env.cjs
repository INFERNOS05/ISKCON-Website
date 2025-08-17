const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * Environment Setup Script
 * Generates secure secrets and updates .env file
 */

console.log('🔧 Setting up environment variables...\n');

// Generate secure JWT secret
const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log('✅ Generated JWT secret');

// Default environment values
const envDefaults = {
  // Database - Remove actual connection string from script
  DATABASE_URL: 'your_neon_database_url_here',
  
  // Razorpay Test Keys - Remove actual keys from script
  RAZORPAY_KEY_ID: 'rzp_test_your_key_id_here',
  RAZORPAY_KEY_SECRET: 'your_razorpay_key_secret_here',
  
  // Site URLs for local development
  SITE_URL: 'http://localhost:8888',
  URL: 'http://localhost:8888',
  
  // Security
  JWT_SECRET: jwtSecret,
  
  // Test mode
  TEST_MODE: 'true',
  
  // Email defaults - Remove hardcoded values
  SMTP_HOST: 'smtp.gmail.com',
  SMTP_PORT: '587',
  SMTP_USER: 'donations@iskcon.org',
  SMTP_PASS: 'your_email_app_password_here'
};

// Read existing .env file
const envPath = path.join(__dirname, '..', '.env');
let envContent = '';

try {
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    console.log('📄 Found existing .env file');
  } else {
    console.log('📄 Creating new .env file');
  }
} catch (error) {
  console.log('📄 Creating new .env file');
}

// Update or create environment variables
let updatedContent = envContent;
let updatedCount = 0;

Object.entries(envDefaults).forEach(([key, value]) => {
  const regex = new RegExp(`^${key}=.*$`, 'm');
  const newLine = `${key}=${value}`;
  
  if (regex.test(updatedContent)) {
    // Update existing variable only if it's a placeholder
    const currentMatch = updatedContent.match(regex);
    if (currentMatch && (currentMatch[0].includes('your_') || currentMatch[0].includes('_here'))) {
      updatedContent = updatedContent.replace(regex, newLine);
      updatedCount++;
      console.log(`🔄 Updated ${key}`);
    } else {
      console.log(`⏭️  Skipped ${key} (already configured)`);
    }
  } else {
    // Add new variable
    updatedContent += `\n${newLine}`;
    updatedCount++;
    console.log(`➕ Added ${key}`);
  }
});

// Write updated .env file
try {
  fs.writeFileSync(envPath, updatedContent);
  console.log(`\n✅ Environment setup complete! Updated ${updatedCount} variables.`);
  console.log('🚀 You can now start the development server with: npm run dev');
} catch (error) {
  console.error('❌ Error writing .env file:', error.message);
  process.exit(1);
}

// Validation check
console.log('\n🧪 Environment validation:');
Object.keys(envDefaults).forEach(key => {
  const hasValue = updatedContent.includes(`${key}=`) && 
                   !updatedContent.includes(`${key}=your_`) && 
                   !updatedContent.includes(`${key}=_here`);
  console.log(`${hasValue ? '✅' : '❌'} ${key}`);
});

console.log('\n🎯 Next steps:');
console.log('1. Review the .env file and update any remaining placeholders');
console.log('2. Start development server: npm run dev');
console.log('3. Test routes: npm run validate');
console.log('4. Open browser: http://localhost:8888');
