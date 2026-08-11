const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getMessages, sendMessage, getChatRooms } = require('../controllers/chatController');

router.get('/rooms', protect, getChatRooms);
router.get('/:room', protect, getMessages);
router.post('/:room', protect, sendMessage);

module.exports = router;
