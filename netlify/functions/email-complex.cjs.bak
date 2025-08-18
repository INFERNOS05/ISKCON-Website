const nodemailer = require('nodemailer');
require('dotenv').config();

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const generateReceiptHTML = (donationData) => {
  const {
    donorName,
    donorEmail,
    amount,
    transactionId,
    donationType,
    date,
    message = ''
  } = donationData;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Donation Receipt - ISKCON</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; background: linear-gradient(135deg, #FF6B35, #F7931E); color: white; padding: 30px 20px; border-radius: 10px 10px 0 0; }
        .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .content { background: #fff; padding: 30px; border: 1px solid #ddd; border-top: none; }
        .receipt-title { color: #FF6B35; font-size: 24px; margin-bottom: 20px; text-align: center; }
        .donation-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; padding: 8px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; color: #555; }
        .detail-value { color: #333; }
        .amount { font-size: 20px; font-weight: bold; color: #FF6B35; }
        .thank-you { background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #ddd; border-top: none; font-size: 14px; color: #666; }
        .contact-info { margin-top: 15px; }
        .message-section { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #FF6B35; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">🕉️ ISKCON</div>
        <p>International Society for Krishna Consciousness</p>
      </div>
      <div class="content">
        <h2 class="receipt-title">Donation Receipt</h2>
        <p>Dear ${donorName},</p>
        <p>Thank you for your generous donation to ISKCON. Your contribution helps us continue our mission of spreading Krishna consciousness and serving the community.</p>
        <div class="donation-details">
          <div class="detail-row"><span class="detail-label">Donor Name:</span><span class="detail-value">${donorName}</span></div>
          <div class="detail-row"><span class="detail-label">Email:</span><span class="detail-value">${donorEmail}</span></div>
          <div class="detail-row"><span class="detail-label">Donation Amount:</span><span class="detail-value amount">₹${amount}</span></div>
          <div class="detail-row"><span class="detail-label">Donation Type:</span><span class="detail-value">${donationType === 'one-time' ? 'One-time Donation' : 'Monthly Subscription'}</span></div>
          <div class="detail-row"><span class="detail-label">Transaction ID:</span><span class="detail-value">${transactionId}</span></div>
          <div class="detail-row"><span class="detail-label">Date:</span><span class="detail-value">${date}</span></div>
        </div>
        ${message ? `<div class="message-section"><strong>Your Message:</strong><p style="margin: 10px 0 0 0; font-style: italic;">"${message}"</p></div>` : ''}
        <div class="thank-you"><h3 style="color: #28a745; margin-top: 0;">🙏 Thank You!</h3><p>Your donation makes a difference in our community and helps us continue our spiritual and charitable activities.</p><p><strong>May Lord Krishna bless you and your family!</strong></p></div>
        <p><strong>Important Notes:</strong></p>
        <ul><li>This email serves as your official donation receipt</li><li>Please keep this receipt for your tax records</li><li>This donation may be tax-deductible under applicable laws</li><li>If you have any questions, please contact us using the information below</li></ul>
      </div>
      <div class="footer"><div class="contact-info"><p><strong>ISKCON Temple</strong></p><p>Email: donations@iskcon.org | Phone: +91-XXX-XXX-XXXX</p><p>Address: [Your Temple Address]</p><p>Website: www.iskcon.org</p></div><p style="margin-top: 15px; font-size: 12px;">This is an automated email. Please do not reply to this email address.</p></div>
    </body>
    </html>
  `;
};

const sendDonationReceipt = async (donationData) => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    const mailOptions = {
      from: {
        name: 'ISKCON Donations',
        address: process.env.SMTP_USER
      },
      to: donationData.donorEmail,
      subject: `Donation Receipt - Thank you ${donationData.donorName}!`,
      html: generateReceiptHTML(donationData),
      text: `Dear ${donationData.donorName},\n\nThank you for your generous donation to ISKCON!\n\nDonation Details:\n- Amount: ₹${donationData.amount}\n- Type: ${donationData.donationType === 'one-time' ? 'One-time Donation' : 'Monthly Subscription'}\n- Transaction ID: ${donationData.transactionId}\n- Date: ${donationData.date}\n\n${donationData.message ? `Your Message: \"${donationData.message}\"` : ''}\n\nThis email serves as your official donation receipt. Please keep it for your records.\n\nMay Lord Krishna bless you and your family!\n\nISKCON Temple\nEmail: donations@iskcon.org\nWebsite: www.iskcon.org\n      `
    };
    const result = await transporter.sendMail(mailOptions);
    return {
      success: true,
      messageId: result.messageId,
      message: 'Receipt email sent successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to send receipt email'
    };
  }
};

module.exports = {
  sendDonationReceipt
};
