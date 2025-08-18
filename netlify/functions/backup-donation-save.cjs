const { neon } = require('@neondatabase/serverless');

// Configure the Neon connection
const sql = neon(process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL);

exports.handler = async (event, context) => {
  console.log('🔄 Backup donation save triggered');

  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const donationData = JSON.parse(event.body);
    console.log('💾 Backup save - received donation data:', donationData);

    // Ensure we have required fields
    if (!donationData.donorName || !donationData.donorEmail || !donationData.amount || !donationData.paymentId) {
      console.error('❌ Missing required fields in donation data');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required fields',
          required: ['donorName', 'donorEmail', 'amount', 'paymentId']
        })
      };
    }

    // Insert into database with backup flag
    console.log('🗃️ Executing backup database insert...');
    const result = await sql`
      INSERT INTO donations (
        donor_name, donor_email, donor_phone, address, pan_card,
        amount, currency, payment_type, payment_id, subscription_id,
        status, message, receive_updates, payment_method, created_at
      ) VALUES (
        ${donationData.donorName},
        ${donationData.donorEmail},
        ${donationData.donorPhone || ''},
        ${donationData.address || ''},
        ${donationData.panCard || ''},
        ${donationData.amount},
        ${donationData.currency || 'INR'},
        ${donationData.paymentType || 'one_time'},
        ${donationData.paymentId},
        ${donationData.subscriptionId || null},
        ${donationData.status || 'completed'},
        ${donationData.message || 'Backup save - payment successful'},
        ${donationData.receiveUpdates || true},
        ${donationData.paymentMethod || 'razorpay'},
        ${donationData.createdAt || new Date().toISOString()}
      ) RETURNING id, payment_id;
    `;
    
    console.log('✅ Backup donation saved successfully:', result[0]);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Donation saved via backup method',
        donationId: result[0].id,
        paymentId: result[0].payment_id,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('❌ Backup donation save error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to save donation via backup method',
        details: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};
