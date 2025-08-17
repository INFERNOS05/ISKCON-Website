#!/usr/bin/env node

/**
 * Secrets Detection Script
 * 
 * This script checks for potential secrets in the repository files
 * before deployment to ensure Netlify secrets scanning will pass
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 ISKCON Website - Secrets Detection Check\n');

// Patterns that might be detected as secrets
const secretPatterns = [
  /postgresql:\/\/[^:\s]+:[^@\s]+@[^\/\s]+\/[^\s]+/gi, // Database URLs
  /rzp_(test|live)_[a-zA-Z0-9]+/gi, // Razorpay keys
  /sk_[a-zA-Z0-9_]+/gi, // Stripe-like secret keys
  /AKIA[0-9A-Z]{16}/gi, // AWS access keys
  /[0-9a-f]{40,}/gi, // Long hex strings (tokens, secrets)
  /ssh-rsa\s+[A-Za-z0-9+\/]+=*/gi, // SSH keys
];

// Files to check (excluding those that should contain env vars)
const filesToCheck = [
  'scripts/setup-env.cjs',
  'src/**/*.ts',
  'src/**/*.tsx',
  'src/**/*.js',
  'src/**/*.jsx',
  'netlify/functions/**/*.cjs',
  'netlify/functions/**/*.js',
  '*.md',
  '*.json',
  '*.toml'
];

// Files to ignore
const filesToIgnore = [
  '.env',
  '.env.local',
  '.env.example',
  'node_modules',
  'dist',
  '.git',
  'NETLIFY_ENV_SETUP.md', // This intentionally contains example secrets
  'run-tests.cjs',
  'dev-server.cjs'
];

let totalFilesChecked = 0;
let issuesFound = 0;

function shouldIgnoreFile(filePath) {
  return filesToIgnore.some(ignore => 
    filePath.includes(ignore) || 
    path.basename(filePath) === ignore
  );
}

function checkFileForSecrets(filePath) {
  if (shouldIgnoreFile(filePath)) {
    return { clean: true, ignored: true };
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    secretPatterns.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          // Skip obvious placeholders
          if (match.includes('your_') || 
              match.includes('_here') || 
              match.includes('example') ||
              match.includes('placeholder')) {
            return;
          }
          
          issues.push({
            pattern: index,
            match: match.substring(0, 50) + (match.length > 50 ? '...' : ''),
            line: content.substring(0, content.indexOf(match)).split('\n').length
          });
        });
      }
    });
    
    totalFilesChecked++;
    
    if (issues.length > 0) {
      issuesFound += issues.length;
      return { clean: false, issues, ignored: false };
    }
    
    return { clean: true, ignored: false };
    
  } catch (error) {
    return { clean: true, ignored: true, error: error.message };
  }
}

function scanDirectory(dir) {
  const results = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!shouldIgnoreFile(fullPath)) {
          results.push(...scanDirectory(fullPath));
        }
      } else if (stat.isFile()) {
        const result = checkFileForSecrets(fullPath);
        if (!result.ignored) {
          results.push({
            file: fullPath,
            ...result
          });
        }
      }
    });
  } catch (error) {
    console.log(`⚠️  Could not scan directory ${dir}: ${error.message}`);
  }
  
  return results;
}

// Start scanning
console.log('🔍 Scanning repository files for potential secrets...\n');

const results = scanDirectory('.');

// Report results
console.log('📊 Scan Results:');
console.log(`Files checked: ${totalFilesChecked}`);
console.log(`Issues found: ${issuesFound}\n`);

if (issuesFound === 0) {
  console.log('✅ No potential secrets detected in repository files!');
  console.log('🚀 Repository should pass Netlify secrets scanning.');
  console.log('\n🎯 Next steps:');
  console.log('1. Ensure all secrets are set in Netlify environment variables');
  console.log('2. Deploy to Netlify');
  console.log('3. Test the deployed application');
} else {
  console.log('❌ Potential secrets detected:');
  
  results.forEach(result => {
    if (!result.clean) {
      console.log(`\n📄 ${result.file}:`);
      result.issues.forEach(issue => {
        console.log(`  Line ${issue.line}: ${issue.match}`);
      });
    }
  });
  
  console.log('\n🔧 Fix suggestions:');
  console.log('1. Replace hardcoded secrets with environment variables');
  console.log('2. Move secrets to Netlify environment variables');
  console.log('3. Use placeholder values in code files');
  console.log('4. Add sensitive files to .gitignore');
}

console.log('\n📋 Environment Variables for Netlify:');
console.log('Set these in Netlify → Site Settings → Environment Variables:');
console.log('- DATABASE_URL');
console.log('- RAZORPAY_KEY_ID');
console.log('- RAZORPAY_KEY_SECRET');
console.log('- JWT_SECRET');
console.log('- SMTP_HOST');
console.log('- SMTP_PORT');
console.log('- SMTP_USER');
console.log('- SMTP_PASS');
console.log('- SITE_URL');
console.log('- URL');
console.log('- TEST_MODE');

process.exit(issuesFound > 0 ? 1 : 0);
