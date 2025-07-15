// controllers/addressController.js
const Address = require('../models/address');

// Create a new address
exports.createAddress = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from authenticated token
        const addressData = { ...req.body, user: userId };

        const address = await Address.create(addressData)
        res.status(201).json({message: "Address created successfully", address});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all addresses
exports.getAllAddresses = async (req, res) => {
    try {
        const addresses = await Address.find()
            .populate('user', 'username email');
        if (!addresses || addresses.length === 0) {
            return res.status(200).json({ message: 'Addresses not found' });
        }
        res.status(200).json({message: "Addresses fetched successfully", addresses});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single address by ID
exports.getAddressById = async (req, res) => {
    try {
        const { id } = req.params;
        const authenticatedUserId = req.user.id;
        const authenticatedUserRole = req.user.role;

        const address = await Address.findById(id).populate('user', 'username email');
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Authorization check: Customer can only get their own address
        if (authenticatedUserRole === 'customer' && address.user._id.toString() !== authenticatedUserId) {
            return res.status(403).json({ message: "Forbidden: You can only view your own addresses." });
        }
        res.status(200).json({message: "Address fetched successfully", address});
    } catch (error) {
        console.error('Error fetching address by ID:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get addresses by user ID
exports.getAddressesByUserId = async (req, res) => {
    try {
        const requestedUserId = req.params.userId;
        const authenticatedUserId = req.user.id;
        const authenticatedUserRole = req.user.role;

        // Authorization check: Customer can only get their own addresses
        if (authenticatedUserRole === 'customer' && requestedUserId !== authenticatedUserId) {
            return res.status(403).json({ message: "Forbidden: You can only view your own addresses." });
        }

        const addresses = await Address.find({ user: requestedUserId }).populate('user', 'username email');
        if (!addresses || addresses.length === 0) {
            return res.status(200).json({ message: 'No addresses found for this user.', addresses: [] });
        }
        res.status(200).json({message: "Addresses fetched successfully for particular user", addresses});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an address by ID
exports.updateAddress = async (req, res) => {
    try {
        const authenticatedUserId = req.user.id;
        const authenticatedUserRole = req.user.role;
        const updates = req.body;

        // Find the address to check ownership/existence
        const addressToUpdate = await Address.findById(req.params.id);
        if (!addressToUpdate) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Authorization check: Customer can only update their own addresses
        if (authenticatedUserRole === 'customer' && addressToUpdate.user.toString() !== authenticatedUserId) {
            return res.status(403).json({ message: "Forbidden: You can only update your own addresses." });
        }
        const updatedAddress = await Address.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!updatedAddress) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.status(200).json({message: "Address updated successfully", updatedAddress});
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(400).json({ error: error.message });
    }
};

// Delete an address by ID
exports.deleteAddress = async (req, res) => {
    try {
        const authenticatedUserId = req.user.id;
        const authenticatedUserRole = req.user.role;

        // Find the address to check ownership/existence
        const addressToDelete = await Address.findById(req.params.id);
        if (!addressToDelete) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Authorization check: Customer can only delete their own addresses
        if (authenticatedUserRole === 'customer' && addressToDelete.user.toString() !== authenticatedUserId) {
            return res.status(403).json({ message: "Forbidden: You can only delete your own addresses." });
        }

        const deletedAddress = await Address.findByIdAndDelete(req.params.id);
        if (!deletedAddress) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ error: error.message });
    }
};