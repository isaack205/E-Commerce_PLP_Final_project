const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const { validateUserRegistration, validateUserLogin } = require('../middlewares/userValidation');
const { registerUser, loginUser, getProfile, getProfileById, updateProfile, deleteUser, getAllUsers } = require('../controllers/authController');

// Register a new user
router.post('/register', validateUserRegistration, registerUser);

// Login user
router.post('/login', validateUserLogin, loginUser);

// Get own profile
router.get('/me', protect, getProfile);

// Update own profile
router.put('/me', protect, updateProfile);

// Delete own profile
router.delete('/me', protect, deleteUser);

// Admin get all users
router.get('/users', protect, authorize(['admin', 'manager']), getAllUsers);

// Admin get user by id
router.get('/:id', protect, authorize(['admin', 'manager']), getProfileById);

// Admin delete user
router.delete('/users/:id', protect, authorize(['admin', 'manager']), deleteUser);

// Export
module.exports = router;