const rateLimit = require('express-rate-limit');

// Strict rate limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 attempts per IP per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many login attempts from this IP address. Please try again after 15 minutes.',
  },
});

// Strict rate limiter for password reset endpoints
const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many password reset attempts. Please try again after 15 minutes.',
  },
});

// Rate limiter for 2FA TOTP verification
const twoFactorLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many 2FA verification attempts. Please try again after 15 minutes.',
  },
});

module.exports = {
  loginLimiter,
  passwordResetLimiter,
  twoFactorLimiter,
};
