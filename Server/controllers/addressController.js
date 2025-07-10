// controllers/addressController.js
const Address = require('../models/address');

// Create a new address
exports.createAddress = async (req, res) => {
    try {
        const address = await Address.create(req.body);
        res.status(201).json({message: "Address created successfully", address});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all addresses
exports.getAllAddresses = async (req, res) => {
    try {
        const addresses = await Address.find().populate('user');
        if (!addresses || addresses.length === 0) {
            return res.status(404).json({ message: 'Addresses not found' });
        }
        res.status(200).json({message: "Addresses fetched successfully", addresses});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single address by ID
exports.getAddressById = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id).populate('user');
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.status(200).json({message: "Addressfetched successfully", address});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get addresses by user ID
exports.getAddressesByUserId = async (req, res) => {
    try {
        const addresses = await Address.find({ user: req.params.userId }).populate('user');
        if (!addresses || addresses.length === 0) {
            return res.status(404).json({ message: 'Addresses for this specific user not found' });
        }
        res.status(200).json({message: "Addresses fetched successfully for particular user", addresses});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an address by ID
exports.updateAddress = async (req, res) => {
    try {
        const updatedAddress = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedAddress) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.status(200).json({message: "Address updated successfully", updatedAddress});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an address by ID
exports.deleteAddress = async (req, res) => {
    try {
        const deletedAddress = await Address.findByIdAndDelete(req.params.id);
        if (!deletedAddress) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};