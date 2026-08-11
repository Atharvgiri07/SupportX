const ActivityLog = require('../models/ActivityLog');

/**
 * Non-blocking helper to record system activity logs.
 * Silently catches errors to ensure core operations never fail.
 */
const logActivity = async (userId, action, details = '', ipAddress = '') => {
  try {
    await ActivityLog.create({
      user: userId || null,
      action,
      details,
      ipAddress,
    });
  } catch (error) {
    console.error('Activity logging failed silently:', error.message);
  }
};

module.exports = logActivity;
