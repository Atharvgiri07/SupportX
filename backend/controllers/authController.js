const crypto = require('crypto');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const logActivity = require('../utils/logActivity');

// Password complexity regex: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+={}\[\]:;<>,.?/~`|]).{8,}$/;

// Helper to validate strong passwords
const isStrongPassword = (pwd) => {
  if (!pwd || typeof pwd !== 'string') return false;
  return STRONG_PASSWORD_REGEX.test(pwd);
};

// @desc   Public Registration — supports employee and admin creation
// @route  POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, department, phone, avatar, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Public registration is employee-only. Admin accounts are created by administrators.
    const assignedRole = 'employee';

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      role: assignedRole,
      department: department || null,
      phone: phone || '',
      avatar: avatar || '',
      tokenVersion: 0,
    });

    await logActivity(user._id, 'User Registered', `New user ${user.name} registered as ${user.role}`, req.ip);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      phone: user.phone,
      avatar: user.avatar,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Public Administrator Registration — secured by server-side ADMIN_SECURITY_KEY
// @route  POST /api/auth/register-admin
// @access Public
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, adminSecurityKey, department, phone, avatar } = req.body;

    if (!name || !email || !password || !adminSecurityKey) {
      return res.status(400).json({ message: 'Please fill all required fields, including the Admin Security Key.' });
    }

    // Verify Admin Security Key strictly on server
    const serverKey = process.env.ADMIN_SECURITY_KEY;
    if (!serverKey || adminSecurityKey !== serverKey) {
      return res.status(401).json({ message: 'Invalid administrator security credentials.' });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      role: 'admin',
      department: department || null,
      phone: phone || '',
      avatar: avatar || '',
      tokenVersion: 0,
    });

    await logActivity(user._id, 'Admin Registered', `New administrator ${user.name} registered successfully`, req.ip);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      phone: user.phone,
      avatar: user.avatar,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// @desc   Login user with Brute-force protection & 2FA support
// @route  POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
  try {
    const { email, password, totpCode, role, adminSecurityKey } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail })
      .select('+password +twoFactorSecret +twoFactorBackupCodes')
      .populate('department', 'name');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Account lockout check
    if (user.lockUntil && user.lockUntil > new Date()) {
      return res.status(429).json({ message: 'Too many failed login attempts. Account temporarily locked for 15 minutes.' });
    }

    // Password verification
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min lock
      }
      await user.save();

      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check account active status
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated. Please contact administrator.' });
    }

    // Role-specific validation
    const selectedRole = role || 'employee';

    if (selectedRole === 'admin') {
      // Admin login: verify DB role + security key
      if (user.role !== 'admin' || !adminSecurityKey || adminSecurityKey !== process.env.ADMIN_SECURITY_KEY) {
        return res.status(401).json({ message: 'Invalid administrator credentials.' });
      }
    } else {
      // Employee login: verify DB role + department assignment
      if (user.role !== 'employee') {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      if (!user.department) {
        return res.status(403).json({ message: 'Your employee account is not assigned to a department. Please contact an administrator.' });
      }
    }

    // 2FA Verification if enabled
    if (user.twoFactorEnabled) {
      if (!totpCode) {
        return res.json({
          require2FA: true,
          userId: user._id,
          message: 'Two-factor authentication code required',
        });
      }

      // Verify TOTP token
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: String(totpCode).trim(),
        window: 1,
      });

      let backupMatched = false;
      if (!verified && user.twoFactorBackupCodes && user.twoFactorBackupCodes.length > 0) {
        for (let i = 0; i < user.twoFactorBackupCodes.length; i++) {
          const match = await bcrypt.compare(String(totpCode).trim(), user.twoFactorBackupCodes[i]);
          if (match) {
            backupMatched = true;
            user.twoFactorBackupCodes.splice(i, 1);
            break;
          }
        }
      }

      if (!verified && !backupMatched) {
        return res.status(401).json({ message: 'Invalid two-factor authentication code' });
      }
    }

    // Reset login attempts & update last login
    user.loginAttempts = 0;
    user.lockUntil = null;
    user.lastLogin = new Date();
    user.lastLoginIP = req.ip || req.headers['x-forwarded-for'] || '';
    await user.save();

    await logActivity(user._id, 'User Login', `User ${user.name} logged in successfully`, req.ip);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      phone: user.phone || '',
      avatar: user.avatar || '',
      twoFactorEnabled: user.twoFactorEnabled,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Confirm current user password
// @route  POST /api/auth/confirm-password
// @access Private
const confirmPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Invalid password confirmation' });
    }

    res.json({ confirmed: true, message: 'Password confirmed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Forgot password
// @route  POST /api/auth/forgot-password
// @access Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Please provide email address' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    const GENERIC_MSG = 'If an account with that email exists, a password reset token has been generated.';

    if (!user) {
      return res.json({ message: GENERIC_MSG });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    res.json({
      message: GENERIC_MSG,
      resetToken,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Reset password using valid reset token
// @route  POST /api/auth/reset-password
// @access Public
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Reset token and new password are required' });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        message: 'New password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.',
      });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired password reset token' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    await logActivity(user._id, 'Password Reset', `Password reset completed for ${user.name}`, req.ip);

    res.json({ message: 'Password reset successful. Please log in with your new password.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Enable 2FA TOTP setup
// @route  POST /api/auth/2fa/enable
// @access Private
const enable2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+twoFactorSecret');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const secret = speakeasy.generateSecret({
      name: `SupportX (${user.email})`,
      length: 20,
    });

    user.twoFactorSecret = secret.base32;
    await user.save();

    const qrCodeDataUrl = await qrcode.toDataURL(secret.otpauth_url);

    res.json({
      secret: secret.base32,
      qrCode: qrCodeDataUrl,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to initiate 2FA setup', error: error.message });
  }
};

// @desc   Verify TOTP code to activate 2FA
// @route  POST /api/auth/2fa/verify
// @access Private
const verify2FA = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: '2FA verification code is required' });

    const user = await User.findById(req.user._id).select('+twoFactorSecret +twoFactorBackupCodes');
    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ message: '2FA setup has not been initiated' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: String(code).trim(),
      window: 1,
    });

    if (!verified) {
      return res.status(400).json({ message: 'Invalid 2FA verification code' });
    }

    const rawBackupCodes = [];
    const hashedBackupCodes = [];

    for (let i = 0; i < 8; i++) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      rawBackupCodes.push(code);
      const salt = await bcrypt.genSalt(8);
      const hashed = await bcrypt.hash(code, salt);
      hashedBackupCodes.push(hashed);
    }

    user.twoFactorEnabled = true;
    user.twoFactorBackupCodes = hashedBackupCodes;
    await user.save();

    await logActivity(user._id, '2FA Enabled', `Two-Factor Authentication enabled for ${user.name}`, req.ip);

    res.json({
      message: 'Two-Factor Authentication successfully enabled',
      backupCodes: rawBackupCodes,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to verify 2FA code', error: error.message });
  }
};

// @desc   Disable 2FA
// @route  POST /api/auth/2fa/disable
// @access Private
const disable2FA = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: 'Password confirmation required to disable 2FA' });
    }

    const user = await User.findById(req.user._id).select('+password +twoFactorSecret +twoFactorBackupCodes');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Password confirmation failed' });
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = '';
    user.twoFactorBackupCodes = [];
    await user.save();

    await logActivity(user._id, '2FA Disabled', `Two-Factor Authentication disabled for ${user.name}`, req.ip);

    res.json({ message: 'Two-Factor Authentication has been disabled' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to disable 2FA', error: error.message });
  }
};

// @desc   Get logged-in user's profile
// @route  GET /api/auth/profile
// @access Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('department', 'name');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Update logged-in user's profile
// @route  PUT /api/auth/profile
// @access Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.user.role !== 'admin') {
      delete req.body.role;
    }

    if (req.body.name) user.name = req.body.name.trim();
    if (req.body.phone !== undefined) user.phone = req.body.phone.trim();
    if (req.body.avatar !== undefined) user.avatar = req.body.avatar;

    if (req.body.email && req.body.email.trim().toLowerCase() !== user.email) {
      const targetEmail = req.body.email.trim().toLowerCase();
      const emailTaken = await User.findOne({ email: targetEmail });
      if (emailTaken) {
        return res.status(400).json({ message: 'Email address is already in use by another user' });
      }
      user.email = targetEmail;
    }

    const updatedUser = await user.save();
    const populated = await User.findById(updatedUser._id).populate('department', 'name');

    res.json({
      _id: populated._id,
      name: populated.name,
      email: populated.email,
      role: populated.role,
      department: populated.department,
      phone: populated.phone || '',
      avatar: populated.avatar || '',
      twoFactorEnabled: populated.twoFactorEnabled,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Change user password
// @route  PUT /api/auth/change-password
// @access Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new password' });
    }
    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        message: 'New password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.',
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user || !(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    await logActivity(user._id, 'Password Changed', `Password updated for ${user.name}`, req.ip);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Admin: assign or change an employee's department
// @route  PUT /api/auth/employees/:id/department
// @access Private/Admin
const updateEmployeeDepartment = async (req, res) => {
  try {
    const { department } = req.body;
    const employee = await User.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    employee.department = department || null;
    await employee.save();

    const updated = await User.findById(employee._id).populate('department', 'name');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
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
};

