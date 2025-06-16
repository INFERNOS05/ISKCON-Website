// Supabase client configuration
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Donation service using Supabase
export const donationService = {
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
            donor_name: `${donationData.firstName} ${donationData.lastName}`,
            donor_email: donationData.email,
            donor_phone: donationData.phone || null,
            amount: donationData.amount,
            currency: donationData.currency || 'INR',
            payment_type: donationData.isMonthly ? 'monthly_sip' : 'one_time',
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
   * Get donations with optional filtering by email
   * @param {string} email - Optional email to filter donations
   * @param {number} page - Page number for pagination (default: 1)
   * @param {number} pageSize - Items per page (default: 20)
   * @returns {Promise} - Supabase query response with pagination
   */
  async getDonations(email = '', page = 1, pageSize = 20) {
    try {
      let query = supabase
        .from('donations')
        .select('*', { count: 'exact' });
        
      // Add email filter if provided
      if (email && email.trim() !== '') {
        query = query.ilike('donor_email', `%${email.trim()}%`);
      }
      
      // Add pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      // Add sorting by created_at (newest first)
      query = query
        .order('created_at', { ascending: false })
        .range(from, to);
      
      const { data, error, count } = await query;
      
      if (error) {
        console.error('Error fetching donations:', error);
        throw error;
      }
      
      // Return data with pagination info
      return {
        donations: data || [],
        totalCount: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
      };
    } catch (error) {
      console.error('Failed to fetch donations:', error);
      throw error;
    }
  },


  /**
   * Get donation by ID
   * @param {string} id - Donation ID
   * @returns {Promise} - Donation details
   */
  async getDonationById(id) {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching donation:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error(`Failed to fetch donation with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get donations by email
   * @param {string} email - Donor email
   * @returns {Promise} - Donations list
   */
  async getDonationsByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('donor_email', email)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching donations by email:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error(`Failed to fetch donations for email ${email}:`, error);
      throw error;
    }
  },

  /**
   * Update donation status
   * @param {string} id - Donation ID
   * @param {string} status - New status
   * @returns {Promise} - Updated donation
   */
  async updateDonationStatus(id, status) {
    try {
      const { data, error } = await supabase
        .from('donations')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error updating donation status:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error(`Failed to update status for donation ${id}:`, error);
      throw error;
    }
  }
};

// Export default supabase client
export default supabase;
