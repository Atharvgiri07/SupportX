const ActivityLog = require('../models/ActivityLog');
const Notification = require('../models/Notification');

/**
 * Log an activity to the audit trail
 */
const logActivity = async (userId, action, details = '', ipAddress = '') => {
  try {
    await ActivityLog.create({
      user: userId || null,
      action,
      details,
      ipAddress,
    });
  } catch (err) {
    console.error('Failed to log activity:', err.message);
  }
};

/**
 * Create a notification for a user
 */
const createNotification = async (userId, title, message, type = 'info', link = '') => {
  try {
    if (!userId) return;
    await Notification.create({
      user: userId,
      title,
      message,
      type,
      link,
    });
  } catch (err) {
    console.error('Failed to create notification:', err.message);
  }
};

module.exports = { logActivity, createNotification };
