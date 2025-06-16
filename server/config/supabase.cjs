const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Get Supabase URL and anon key from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client with service role key for server-side operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Donation service using Supabase
const donationService = {
  /**
   * Save donation details to Supabase
   * @param {Object} donationData - Donation information
   * @returns {Promise} - Supabase insert response
   */
  async saveDonation(donationData) {
    try {
      const { data, error } = await supabase
        .from('donations')
        .insert([
          {
            donor_name: donationData.donorName,
            donor_email: donationData.donorEmail,
            donor_phone: donationData.donorPhone || null,
            amount: donationData.amount,
            currency: donationData.currency || 'INR',
            payment_type: donationData.paymentType,
            payment_id: donationData.paymentId,
            subscription_id: donationData.subscriptionId || null,
            message: donationData.message || null,
            status: donationData.status || 'completed',
            created_at: new Date().toISOString(),
          }
        ])
        .select();

      if (error) {
        console.error('Error saving donation:', error);
        throw error;
      }

      console.log('Donation saved successfully:', data);
      return data;
    } catch (error) {
      console.error('Failed to save donation:', error);
      throw error;
    }
  },

  /**
   * Get all donations with pagination
   * @param {number} page - Page number
   * @param {number} pageSize - Items per page
   * @returns {Promise} - Donations list
   */
  async getDonations(page = 1, pageSize = 10) {
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from('donations')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.error('Error fetching donations:', error);
        throw error;
      }

      return {
        donations: data,
        totalCount: count,
        page,
        pageSize,
        totalPages: Math.ceil(count / pageSize)
      };
    } catch (error) {
      console.error('Failed to fetch donations:', error);
      throw error;
    }
  }
};

module.exports = { supabase, donationService };
