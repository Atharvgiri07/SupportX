const express = require('express');
const router = express.Router();
const { generateAIReport } = require('../controllers/aiReportController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/ai-report/:id', protect, admin, generateAIReport);

module.exports = router;
