const ActivityLog = require('../models/ActivityLog');

// @desc   Get audit activity logs (Admin view)
// @route  GET /api/activity-logs
// @access Private/Admin
const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getActivityLogs };
