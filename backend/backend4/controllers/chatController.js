const Message = require('../models/Message');
const User = require('../models/User');

const getMessages = async (req, res) => {
  try {
    const { room } = req.params;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = 50;
    const messages = await Message.find({ chatRoom: room })
      .populate('sender', 'name avatar role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: 'Failed to get messages', error: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { room } = req.params;
    const { text } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) return res.status(400).json({ message: 'Message text is required' });
    const message = await Message.create({
      sender: req.user._id,
      chatRoom: room,
      text: text.trim(),
      readBy: [req.user._id]
    });
    const populated = await Message.findById(message._id).populate('sender', 'name avatar role');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
};

const getChatRooms = async (req, res) => {
  try {
    const rooms = await Message.aggregate([
      { $sort: { createdAt: -1 } },
      { $group: {
        _id: '$chatRoom',
        lastMessage: { $first: '$text' },
        lastSender: { $first: '$sender' },
        lastTime: { $first: '$createdAt' },
        messageCount: { $sum: 1 }
      }},
      { $sort: { lastTime: -1 } }
    ]);
    
    const populatedRooms = await User.populate(rooms, { path: 'lastSender', select: 'name' });
    
    const result = populatedRooms.map(r => ({
      room: r._id,
      lastMessage: r.lastMessage,
      lastSenderName: r.lastSender?.name || 'Unknown',
      lastTime: r.lastTime,
      messageCount: r.messageCount
    }));
    
    // Always include global room
    if (!result.find(r => r.room === 'global')) {
      result.unshift({ room: 'global', lastMessage: 'No messages yet', lastSenderName: '', lastTime: new Date(), messageCount: 0 });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get chat rooms', error: error.message });
  }
};

module.exports = { getMessages, sendMessage, getChatRooms };
