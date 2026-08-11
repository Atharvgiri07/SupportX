const express = require('express');
const router = express.Router();
const {
  getMyPerformance,
  getLeaderboard,
  getAllPerformance,
  getMonthlyPerformance,
  getMyBadges,
} = require('../controllers/performanceController');
const { generateAIReport } = require('../controllers/aiReportController');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/rbac');

router.get('/my', protect, getMyPerformance);
router.get('/monthly', protect, getMonthlyPerformance);
router.get('/badges', protect, getMyBadges);
router.get('/leaderboard', protect, getLeaderboard);
router.get('/all', protect, requireAdmin, getAllPerformance);
router.post('/ai-report/:id', protect, requireAdmin, generateAIReport);

module.exports = router;
