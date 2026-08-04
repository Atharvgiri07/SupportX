const express = require('express');
const router = express.Router();
const { getMyPerformance, getLeaderboard, getAllPerformance } = require('../controllers/performanceController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/my', protect, getMyPerformance);
router.get('/leaderboard', protect, getLeaderboard);
router.get('/all', protect, admin, getAllPerformance);

module.exports = router;
