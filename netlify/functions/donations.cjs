const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const sql = neon(process.env.NETLIFY_DATABASE_URL);

// Temporarily remove email dependency to fix handler issue
// const { sendDonationReceipt } = require('./email.cjs');

exports.handler = async function(event, context) {
  console.log('Donation function called:', {
    method: event.httpMethod,
    body: event.body,
    query: event.queryStringParameters
  });

  if (event.httpMethod === 'OPTIONS') {
    console.log('OPTIONS preflight received');
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, PATCH, OPTIONS',
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
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ success: false, error: 'Missing required donation fields' })
        };
      }
      console.log('Parsed donationData:', donationData);
      
      const result = await sql`
        INSERT INTO donations (
          donor_name, donor_email, donor_phone, pan_card, address, amount, currency, 
          payment_type, payment_id, subscription_id, message, status, 
          created_at, receive_updates, payment_method
        ) VALUES (
          ${donationData.donorName},
          ${donationData.donorEmail},
          ${donationData.donorPhone || null},
          ${donationData.panCard || null},
          ${donationData.address || null},
          ${donationData.amount},
          ${donationData.currency || 'INR'},
          ${donationData.paymentType || 'one-time'},
          ${donationData.paymentId || null},
          ${donationData.subscriptionId || null},
          ${donationData.message || null},
          ${donationData.status || 'pending'},
          ${donationData.createdAt || new Date().toISOString()},
          ${donationData.receiveUpdates || false},
          ${donationData.paymentMethod || 'credit-card'}
        ) RETURNING *;
      `;

      console.log('Donation saved to DB:', result);

      // Email functionality temporarily disabled to fix handler issues
      // Will re-enable once main API is working
      const emailResult = null;

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ success: true, donation: result[0], email: emailResult })
      };
    } catch (error) {
      console.error('Error in POST /donations:', error);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ success: false, error: error.message || 'Failed to save donation' })
      };
    }
  }

  if (event.httpMethod === 'PATCH') {
    try {
      const updateData = JSON.parse(event.body);
      console.log('PATCH donation update:', updateData);
      
      if (!updateData.donationId) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ success: false, error: 'Missing donation ID' })
        };
      }

      // Update donation status
      console.log('PATCH donation update:', updateData);
      
      // Build dynamic update query
      let updateSetClause = [];
      let hasUpdates = false;

      if (updateData.status !== undefined) {
        updateSetClause.push('status = ' + sql`${updateData.status}`);
        hasUpdates = true;
      }

      if (updateData.paymentId !== undefined) {
        updateSetClause.push('payment_id = ' + sql`${updateData.paymentId}`);
        hasUpdates = true;
      }

      if (updateData.subscriptionId !== undefined) {
        updateSetClause.push('subscription_id = ' + sql`${updateData.subscriptionId}`);
        hasUpdates = true;
      }

      // Always update timestamp
      updateSetClause.push('updated_at = ' + sql`${updateData.updatedAt || new Date().toISOString()}`);

      if (!hasUpdates) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ success: false, error: 'No valid update fields provided' })
        };
      }

      const result = await sql`
        UPDATE donations 
        SET 
          status = ${updateData.status || sql`status`},
          payment_id = ${updateData.paymentId || sql`payment_id`},
          subscription_id = ${updateData.subscriptionId || sql`subscription_id`},
          updated_at = ${updateData.updatedAt || new Date().toISOString()}
        WHERE id = ${updateData.donationId}
        RETURNING *;
      `;

      if (result.length === 0) {
        return {
          statusCode: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ success: false, error: 'Donation not found' })
        };
      }

      console.log('Donation updated:', result[0]);

      // Email functionality temporarily disabled
      const emailResult = null;

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ success: true, donation: result[0], email: emailResult })
      };
    } catch (error) {
      console.error('Error in PATCH /donations:', error);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ success: false, error: error.message || 'Failed to update donation' })
      };
    }
  }

  if (event.httpMethod === 'GET') {
    try {
      console.log('GET donations called:', event.queryStringParameters);
      const page = parseInt(event.queryStringParameters.page) || 1;
      const pageSize = parseInt(event.queryStringParameters.pageSize) || 10;
      const offset = (page - 1) * pageSize;
      const donations = await sql`
        SELECT * FROM donations ORDER BY created_at DESC LIMIT ${pageSize} OFFSET ${offset};
      `;
      const totalCountResult = await sql`SELECT COUNT(*) FROM donations;`;
      const totalCount = parseInt(totalCountResult[0].count);
      console.log('Fetched donations:', donations.length);
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
      console.error('Error in GET /donations:', error);
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
};