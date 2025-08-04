const sql = require('../config/postgres.cjs');

// Donation controller for handling donation-related routes
const donationController = {
  /**
   * Save donation details to database
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async saveDonation(req, res) {
    try {
      const donationData = req.body;
      
      // Validate required fields
      if (!donationData.donorName || !donationData.donorEmail || !donationData.amount) {
        return res.status(400).json({
          success: false,
          error: 'Missing required donation fields'
        });
      }

      // Save donation to Neon DB using @netlify/neon
      const result = await sql`
        INSERT INTO donations (
          donor_name, donor_email, donor_phone, amount, currency, payment_type, payment_id, subscription_id, message, status, created_at
        ) VALUES (
          ${donationData.donorName},
          ${donationData.donorEmail},
          ${donationData.donorPhone || null},
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
      return res.status(200).json({
        success: true,
        donation: result[0]
      });
    } catch (error) {
      console.error('Error saving donation:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to save donation'
      });
    }
  },

  /**
   * Get all donations with pagination
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getDonations(req, res) {
    try {
      const { page = 1, pageSize = 10 } = req.query;
      
      // Get donations from Neon DB using @netlify/neon
      const offset = (parseInt(page) - 1) * parseInt(pageSize);
      const donations = await sql`
        SELECT * FROM donations ORDER BY created_at DESC LIMIT ${parseInt(pageSize)} OFFSET ${offset};
      `;
      const totalCountResult = await sql`SELECT COUNT(*) FROM donations;`;
      const totalCount = parseInt(totalCountResult[0].count);
      return res.status(200).json({
        success: true,
        donations,
        totalCount,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalPages: Math.ceil(totalCount / parseInt(pageSize))
      });
    } catch (error) {
      console.error('Error fetching donations:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch donations'
      });
    }
  }
};

module.exports = donationController;
