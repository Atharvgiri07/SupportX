const User = require('../models/User');

// @desc   Get logged-in user's own performance stats
// @route  GET /api/performance/my
// @access Private
const getMyPerformance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      'name email performanceScore totalResolved currentOpen department'
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Department leaderboard, ranked by performanceScore
// @route  GET /api/performance/leaderboard
// @access Private
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({ role: 'employee' })
      .select('name email performanceScore totalResolved department')
      .populate('department', 'name')
      .sort({ performanceScore: -1 });
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   All employees' stats (admin view)
// @route  GET /api/performance/all
// @access Private/Admin
const getAllPerformance = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' })
      .select('name email performanceScore totalResolved currentOpen isActive')
      .populate('department', 'name')
      .sort({ performanceScore: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getMyPerformance, getLeaderboard, getAllPerformance };
