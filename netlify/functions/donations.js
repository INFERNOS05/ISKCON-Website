const { neon } = require('@netlify/neon');
require('dotenv').config();

const sql = neon(process.env.NETLIFY_DATABASE_URL);

exports.handler = async function(event, context) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  if (event.httpMethod === 'POST') {
    try {
      const donationData = JSON.parse(event.body);
      if (!donationData.donorName || !donationData.donorEmail || !donationData.amount) {
        return {
          statusCode: 400,
          body: JSON.stringify({ success: false, error: 'Missing required donation fields' })
        };
      }
      const result = await sql`
        INSERT INTO donations (
          donor_name, donor_email, donor_phone, pan_card, address, amount, currency, payment_type, payment_id, subscription_id, message, status, created_at
        ) VALUES (
          ${donationData.donorName},
          ${donationData.donorEmail},
          ${donationData.donorPhone || null},
          ${donationData.panCard || null},
          ${donationData.address || null},
          ${donationData.amount},
          ${donationData.currency || 'INR'},
          ${donationData.paymentType || null},
          ${donationData.paymentId || null},
          ${donationData.subscriptionId || null},
          ${donationData.message || null},
          ${donationData.status || 'completed'},
          ${new Date().toISOString()}
        ) RETURNING *;
      `;
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ success: true, donation: result[0] })
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ success: false, error: error.message || 'Failed to save donation' })
      };
    }
  }

  if (event.httpMethod === 'GET') {
    try {
      const page = parseInt(event.queryStringParameters.page) || 1;
      const pageSize = parseInt(event.queryStringParameters.pageSize) || 10;
      const offset = (page - 1) * pageSize;
      const donations = await sql`
        SELECT * FROM donations ORDER BY created_at DESC LIMIT ${pageSize} OFFSET ${offset};
      `;
      const totalCountResult = await sql`SELECT COUNT(*) FROM donations;`;
      const totalCount = parseInt(totalCountResult[0].count);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: true,
          donations,
          totalCount,
          page,
          pageSize,
          totalPages: Math.ceil(totalCount / pageSize)
        })
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ success: false, error: error.message || 'Failed to fetch donations' })
      };
    }
  }

  return {
    statusCode: 405,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ success: false, error: 'Method Not Allowed' })
  };
}
