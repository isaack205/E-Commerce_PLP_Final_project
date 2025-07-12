// Imports
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const { createAddress, getAllAddresses, getAddressById, getAddressesByUserId, updateAddress, deleteAddress }= require('../controllers/addressController');

// Create a new address for a user
router.post('/', protect, authorize(['customer']), createAddress);

// Get all addresses (admin access)
router.get('/', protect, authorize(['admin', 'manager']), getAllAddresses);

// Get a single address by ID
router.get('/:id', protect, authorize(['customer', 'admin']), getAddressById); // User can get their own address, admin any

// Get addresses for a specific user
router.get('/user/:userId', protect, authorize(['admin', 'customer']), getAddressesByUserId); // User can get their own addresses

// Update an address by ID
router.put('/:id', protect, authorize(['customer', 'admin']), updateAddress);

// Delete an address by ID
router.delete('/:id', protect, authorize(['customer', 'admin']), deleteAddress);

// Export
module.exports = router;