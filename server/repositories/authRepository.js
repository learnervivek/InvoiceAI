const User = require('../models/User');

// ─── Auth Repository ──────────────────────────────────────────────────────────
// Pure database operations — no business logic.

/**
 * Find a user by email, including the password field for authentication.
 */
const findByEmail = async (email) => {
  return User.findOne({ email }).select('+password');
};

/**
 * Find a user by ID, excluding sensitive fields.
 */
const findById = async (id) => {
  return User.findById(id).select('-password -refreshToken');
};

/**
 * Create a new user with email/password credentials.
 * Password hashing is handled by the User model's pre-save hook.
 */
const createUser = async ({ name, email, password }) => {
  return User.create({ name, email, password });
};

/**
 * Clear refresh token on logout.
 */
const clearRefreshToken = async (userId) => {
  return User.findByIdAndUpdate(userId, { refreshToken: '' });
};

module.exports = { findByEmail, findById, createUser, clearRefreshToken };
