const { donationService } = require('../config/supabase.cjs');

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

      // Save donation to Supabase
      const savedDonation = await donationService.saveDonation(donationData);
      
      return res.status(200).json({
        success: true,
        donation: savedDonation[0]
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
      
      // Get donations from Supabase
      const donations = await donationService.getDonations(
        parseInt(page),
        parseInt(pageSize)
      );
      
      return res.status(200).json({
        success: true,
        ...donations
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
