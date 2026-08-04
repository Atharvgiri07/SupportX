const express = require('express');
const router = express.Router();
const { getStats, getChartData } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/stats', protect, admin, getStats);
router.get('/chart-data', protect, admin, getChartData);

module.exports = router;
