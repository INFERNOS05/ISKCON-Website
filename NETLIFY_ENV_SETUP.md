# ISKCON Website - Netlify Environment Variables
# 
# Copy these environment variables to your Netlify site settings:
# Site Settings → Environment Variables
#
# ⚠️ IMPORTANT: Never commit actual values to your repository!

# Database Configuration
DATABASE_URL=postgresql://neondb_owner:npg_Ig8VsJh6ADFx@ep-raspy-star-a1qsvt5u-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

# Razorpay Configuration (Test Mode)
RAZORPAY_KEY_ID=rzp_test_5Gr07DWc1NdDc9
RAZORPAY_KEY_SECRET=qm2Ze9AEhjKjBr0e1tKArHYr

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=donations@iskcon.org
SMTP_PASS=your_actual_email_app_password

# Site Configuration
SITE_URL=https://your-site-name.netlify.app
URL=https://your-site-name.netlify.app

# Security
JWT_SECRET=f2f56ab758c5a3733a1fd9f4e3ae41df09e55d7589c07a0c5ed13eb1a3e9c42f

# Application Settings
TEST_MODE=true

# Netlify Configuration
NETLIFY_SITE_ID=2f4284b4-98bc-4228-822a-fcb1af3ea8d9

# ImageKit Configuration (if used)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

# Instructions:
# 1. Go to Netlify → Your Site → Site Settings → Environment Variables
# 2. Add each variable above with its actual value
# 3. Replace placeholder values with your real credentials
# 4. Deploy your site
