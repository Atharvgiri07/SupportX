const mongoose = require('mongoose');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Badge = require('../models/Badge');
const { seedBadges } = require('../utils/checkBadges');

// @desc   Get logged-in user's own performance stats
// @route  GET /api/performance/my
// @access Private
const getMyPerformance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      'name email performanceScore totalResolved currentOpen department badges'
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

// @desc   Logged-in user's resolved-ticket count and points, by month (last 6 months)
// @route  GET /api/performance/monthly
// @access Private
const getMonthlyPerformance = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 6;
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const monthlyData = await Ticket.aggregate([
      {
        $match: {
          assignedTo: userId,
          status: { $in: ['Resolved', 'Closed'] },
          $or: [
            { resolvedAt: { $gte: startDate } },
            { resolvedAt: { $exists: false }, updatedAt: { $gte: startDate } },
            { resolvedAt: null, updatedAt: { $gte: startDate } }
          ]
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: { $ifNull: ['$resolvedAt', '$updatedAt'] } } },
          resolved: { $sum: 1 },
          points: { $sum: '$pointsAwarded' },
          avgHours: {
            $avg: {
              $divide: [{ $subtract: [{ $ifNull: ['$resolvedAt', '$updatedAt'] }, '$createdAt'] }, 3600000]
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const result = monthlyData.map(m => ({
      month: m._id,
      resolved: m.resolved,
      points: m.points,
      avgResolutionHours: Number((m.avgHours || 0).toFixed(1))
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get monthly performance', error: error.message });
  }
};

// @desc   Get badges status for user
// @route  GET /api/performance/badges
// @access Private
const getMyBadges = async (req, res) => {
  try {
    await seedBadges();
    const user = await User.findById(req.user._id).populate('badges');
    const allBadges = await Badge.find();
    
    const userBadgeIds = (user?.badges || []).map(b => b._id?.toString()).filter(Boolean);
    
    const result = allBadges.map(badge => ({
      _id: badge._id,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      criteria: badge.criteria,
      earned: userBadgeIds.includes(badge._id.toString()),
      earnedAt: null
    }));
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get badges', error: error.message });
  }
};

module.exports = {
  getMyPerformance,
  getLeaderboard,
  getAllPerformance,
  getMonthlyPerformance,
  getMyBadges,
};
