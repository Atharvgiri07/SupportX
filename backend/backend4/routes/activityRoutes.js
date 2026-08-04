const express = require('express');
const router = express.Router();
const { getActivityLogs } = require('../controllers/activityController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', protect, admin, getActivityLogs);

module.exports = router;
