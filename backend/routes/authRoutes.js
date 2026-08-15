const express = require('express');
const router = express.Router();
const {
  registerUser,
  registerAdmin,
  loginUser,
  confirmPassword,
  forgotPassword,
  resetPassword,
  enable2FA,
  verify2FA,
  disable2FA,
  getProfile,
  updateProfile,
  changePassword,
  updateEmployeeDepartment,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/rbac');
const { loginLimiter, passwordResetLimiter, twoFactorLimiter } = require('../middleware/rateLimiter');

router.post('/register', registerUser);
router.post('/register-admin', loginLimiter, registerAdmin);
router.post('/login', loginLimiter, loginUser);

router.post('/forgot-password', passwordResetLimiter, forgotPassword);
router.post('/reset-password', passwordResetLimiter, resetPassword);
router.post('/confirm-password', protect, confirmPassword);

router.post('/2fa/enable', protect, enable2FA);
router.post('/2fa/verify', protect, twoFactorLimiter, verify2FA);
router.post('/2fa/disable', protect, disable2FA);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.put('/employees/:id/department', protect, requireAdmin, updateEmployeeDepartment);

module.exports = router;
