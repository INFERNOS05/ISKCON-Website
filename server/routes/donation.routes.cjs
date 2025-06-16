const express = require('express');
const donationController = require('../controllers/donation.controller.cjs');

const router = express.Router();

// Route to save donation details
router.post('/donations', donationController.saveDonation);

// Route to get all donations with pagination
router.get('/donations', donationController.getDonations);

module.exports = router;
