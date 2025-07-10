// Imports
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET; // Load environment variable

// Create user
exports.registerUser = async (req, res) => {
    const { firstname, lastname, username, email, password, role } = req.body;

    try {
        // Check if user with email exists
        let user = await User.findOne({ email });
        if(user) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Check if user with username exists
        user = await User.findOne({ username });
        if(user) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Hash password before creating the user
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        user = await User.create({ ...req.body, password: hashedPassword });

        // Generate token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            jwt_secret,
            { expiresIn: '12h' }
        );

        // Return the token
        res.status(200).json({ message: "User created successfully", user, token })
    } catch (error) {
        res.status(500).json({ message: "Error registering user", Error: error.message });
    }
};

// login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({ message: "Invalid email or password" })
        }

        // Compare password
        const isMatch =  await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(404).json({ message: "Invalid email or password" })
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            jwt_secret,
            { expiresIn: '12h' }
        );

        // Return the token
        res.status(201).json({ message: "Login successful", user, token })

    } catch (error) {
        res.status(500).json({message: "Error loging in user", Error: error.message})
    }
};

// Get current user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const updates = { ...req.body };
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }
        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true, runValidators: true, select: '-password' }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

// Delete user account
exports.deleteUser = async (req, res) => {
    try {
        // Use req.params.id if present (admin deletes any user), otherwise req.user.id (user deletes self)
        const userId = req.params.id || req.user.id;
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};
