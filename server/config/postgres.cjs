// Neon DB PostgreSQL connection setup using @netlify/neon
const { neon } = require('@netlify/neon');

// Get connection string from environment variable
const connectionString = process.env.NETLIFY_DATABASE_URL || process.env.NEON_DATABASE_URL;

if (!connectionString) {
  console.error('No database connection string found. Please set NETLIFY_DATABASE_URL or NEON_DATABASE_URL in your .env file');
  process.exit(1);
}

const sql = neon(connectionString);

module.exports = sql;
