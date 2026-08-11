const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createReminder, getMyReminders, completeReminder, deleteReminder } = require('../controllers/reminderController');

router.post('/', protect, createReminder);
router.get('/', protect, getMyReminders);
router.put('/:id/complete', protect, completeReminder);
router.delete('/:id', protect, deleteReminder);

module.exports = router;
