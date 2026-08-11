const express = require('express');
const router = express.Router();
const { getStats, getChartData } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/rbac');

router.get('/stats', protect, requireAdmin, getStats);
router.get('/chart-data', protect, requireAdmin, getChartData);

module.exports = router;
