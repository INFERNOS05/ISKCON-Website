// netlify/functions/email.cjs
const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const payload = JSON.parse(event.body);
    const { 
      to, 
      donorName, 
      amount, 
      currency = 'INR',
      paymentId, 
      donationId,
      donationType = 'One-time Donation',
      timestamp = new Date().toISOString(),
      donorAddress = '',
      donorPAN = '',
      donorPhone = ''
    } = payload;

    if (!to || !donorName || !amount || !paymentId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required fields: to, donorName, amount, paymentId' 
        })
      };
    }

    // Check if email credentials are configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('📧 Email credentials not configured, skipping email send');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Email credentials not configured - skipping email send',
          warning: 'Please configure SMTP credentials in Netlify environment variables'
        })
      };
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT || 587),
      secure: false, // STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Format amount
    const formattedAmount = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(amount);

    // Format timestamp
    const donationDate = new Date(timestamp).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Generate PDF receipt
    console.log('📄 Generating PDF receipt...');
    let pdfBuffer = null;
    
    try {
      const pdfPayload = {
        donorName,
        amount,
        paymentId,
        donationId,
        receiptDate: donationDate.split(',')[0], // Just the date part
        timestamp,
        donorAddress,
        donorPAN
      };

      // Call our PDF generation function internally
      const pdfEvent = {
        httpMethod: 'POST',
        body: JSON.stringify(pdfPayload)
      };

      // Import the PDF handler
      const { handler: pdfHandler } = require('./generate-receipt-pdf.cjs');
      const pdfResponse = await pdfHandler(pdfEvent);

      if (pdfResponse.statusCode === 200 && pdfResponse.isBase64Encoded) {
        pdfBuffer = Buffer.from(pdfResponse.body, 'base64');
        console.log('✅ PDF generated successfully, size:', pdfBuffer.length, 'bytes');
      } else {
        console.warn('⚠️ PDF generation failed:', pdfResponse.body);
      }
    } catch (pdfError) {
      console.warn('❌ PDF generation error:', pdfError.message);
    }

    // Create professional HTML email template
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Donation Receipt - ISKCON</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #ff8c00, #ffa500); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .header p { margin: 5px 0 0; opacity: 0.9; }
        .content { padding: 30px; }
        .receipt-box { background: #f8f9fa; border-left: 4px solid #ff8c00; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; color: #555; }
        .detail-value { color: #333; }
        .amount-highlight { font-size: 24px; font-weight: bold; color: #ff8c00; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        .thank-you { text-align: center; margin: 30px 0; }
        .thank-you h2 { color: #ff8c00; margin-bottom: 10px; }
        .btn { display: inline-block; background: #ff8c00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        @media (max-width: 600px) {
            .detail-row { flex-direction: column; }
            .detail-label, .detail-value { text-align: left; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🕉️ ISKCON</h1>
            <p>International Society for Krishna Consciousness</p>
        </div>
        
        <div class="content">
            <div class="thank-you">
                <h2>Thank You for Your Generous Donation!</h2>
                <p>Your contribution helps us spread the teachings of Lord Krishna and serve the community.</p>
            </div>
            
            <div class="receipt-box">
                <h3 style="margin-top: 0; color: #ff8c00;">📧 Donation Receipt</h3>
                
                <div class="detail-row">
                    <span class="detail-label">Donor Name:</span>
                    <span class="detail-value">${donorName}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${to}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Donation Amount:</span>
                    <span class="detail-value amount-highlight">${formattedAmount}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Donation Type:</span>
                    <span class="detail-value">${donationType}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Date & Time:</span>
                    <span class="detail-value">${donationDate}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Payment ID:</span>
                    <span class="detail-value" style="font-family: monospace; font-size: 12px;">${paymentId}</span>
                </div>
                
                ${donationId ? `
                <div class="detail-row">
                    <span class="detail-label">Donation ID:</span>
                    <span class="detail-value" style="font-family: monospace;">#${donationId}</span>
                </div>
                ` : ''}
                
                <div class="detail-row" style="border-bottom: none; margin-top: 20px;">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value" style="color: #28a745; font-weight: bold;">✅ Confirmed</span>
                </div>
            </div>
            
            <div style="background: #e8f5e8; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h4 style="color: #2d5a2d; margin-top: 0;">🙏 Your Impact</h4>
                <p style="margin-bottom: 0; color: #2d5a2d;">Your generous contribution supports our temple activities, food distribution programs, spiritual education, and community service initiatives. Every donation makes a meaningful difference in spreading Krishna consciousness and serving humanity.</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <p><strong>Keep this receipt for your records.</strong></p>
                ${pdfBuffer ? '<p>📎 <strong>Official ISKCON receipt PDF is attached to this email.</strong></p>' : ''}
                <p style="font-size: 14px; color: #666;">For any questions about your donation, please contact us at <a href="mailto:${process.env.SMTP_USER}">${process.env.SMTP_USER}</a></p>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>ISKCON Temple</strong></p>
            <p>Spreading the teachings of Lord Krishna worldwide</p>
            <p>🌐 Visit our website | 📱 Follow us on social media</p>
            <p style="font-size: 12px; margin-top: 15px;">This is an automated receipt. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
    `;

    // Plain text version for email clients that don't support HTML
    const textTemplate = `
🕉️ ISKCON - Donation Receipt

Dear ${donorName},

Thank you for your generous donation to ISKCON!

DONATION DETAILS:
-----------------
Donor Name: ${donorName}
Email: ${to}
Amount: ${formattedAmount}
Donation Type: ${donationType}
Date & Time: ${donationDate}
Payment ID: ${paymentId}
${donationId ? `Donation ID: #${donationId}` : ''}
Status: Confirmed ✅

Your contribution supports our temple activities, food distribution programs, spiritual education, and community service initiatives.

Keep this receipt for your records.

For any questions, contact us at ${process.env.SMTP_USER}

With gratitude,
ISKCON Team

---
This is an automated receipt. Please do not reply to this email.
    `;

    // Prepare email attachments
    const attachments = [];
    if (pdfBuffer) {
      const receiptNo = donationId ? `DR_API_${donationId}` : `DR_API_${paymentId.slice(-4)}`;
      attachments.push({
        filename: `ISKCON_Receipt_${receiptNo}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      });
    }

    // Send email
    const info = await transporter.sendMail({
      from: `"ISKCON Donations" <${process.env.SMTP_USER}>`,
      to: to,
      subject: `🙏 Donation Receipt - Thank You ${donorName}! (${formattedAmount})`,
      text: textTemplate,
      html: htmlTemplate,
      attachments: attachments
    });

    console.log('Email sent successfully:', {
      messageId: info.messageId,
      to: to,
      amount: formattedAmount,
      paymentId: paymentId
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        messageId: info.messageId,
        message: 'Receipt sent successfully'
      })
    };

  } catch (error) {
    console.error('Email sending failed:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: error.message,
        message: 'Failed to send receipt email'
      })
    };
  }
};
