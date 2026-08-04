const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  updateEmployeeDepartment,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.put('/employees/:id/department', protect, admin, updateEmployeeDepartment);

module.exports = router;
