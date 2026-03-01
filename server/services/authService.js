const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/authRepository');

// ─── Auth Service ─────────────────────────────────────────────────────────────
// Business logic for authentication (register, login, token generation).

/**
 * Generate a JWT token for a user.
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

/**
 * Register a new user with email and password.
 * @returns {{ token, user }} — JWT + sanitized user object
 * @throws {Error} with statusCode if email already exists
 */
const registerUser = async ({ name, email, password }) => {
  // Check for existing email
  const existingUser = await authRepository.findByEmail(email);
  if (existingUser) {
    const err = new Error('An account with this email already exists.');
    err.statusCode = 409;
    throw err;
  }

  // Create user (password is hashed by pre-save hook)
  const user = await authRepository.createUser({ name, email, password });

  const token = generateToken(user._id);

  // Return sanitized user (no password)
  const sanitized = { _id: user._id, name: user.name, email: user.email, role: user.role };

  return { token, user: sanitized };
};

/**
 * Authenticate a user with email and password.
 * @returns {{ token, user }} — JWT + sanitized user object
 * @throws {Error} with statusCode if credentials are invalid
 */
const loginUser = async ({ email, password }) => {
  const user = await authRepository.findByEmail(email);

  if (!user || !user.password) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }

  const token = generateToken(user._id);

  const sanitized = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
  };

  return { token, user: sanitized };
};

module.exports = { generateToken, registerUser, loginUser };
