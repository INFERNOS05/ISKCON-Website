exports.handler = async (event, context) => {
  console.log('📧 Email function called');

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
    const emailData = JSON.parse(event.body);
    console.log('📧 Email request received:', emailData);

    // For now, just log the email request
    // This prevents the 502 error and allows the system to work
    console.log('📧 Email would be sent to:', emailData.to);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Email logged successfully (sending functionality temporarily disabled)',
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('❌ Email function error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to process email request',
        details: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};
