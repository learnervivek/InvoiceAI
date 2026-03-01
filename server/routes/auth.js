const express = require('express');
const { register, login, googleAuth, googleCallback, getMe, updateProfile, logout } = require('../controllers/authController');
const auth = require('../middlewares/auth');

const router = express.Router();

// Email/Password auth
router.post('/register', register);
router.post('/login', login);

// Google OAuth
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

// Protected routes
router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);
router.post('/logout', auth, logout);

module.exports = router;
