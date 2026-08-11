const Comment = require('../models/Comment');
const Ticket = require('../models/Ticket');
const logActivity = require('../utils/logActivity');

// @desc   Add a comment to a ticket
// @route  POST /api/tickets/:id/comments
// @access Private
const addComment = async (req, res) => {
  try {
    const { text, isResolution } = req.body;
    if (!text || (typeof text === 'string' && !text.trim())) return res.status(400).json({ message: 'Comment text is required' });

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const comment = await Comment.create({
      ticket: ticket._id,
      user: req.user._id,
      text: text.trim(),
      isResolution: !!isResolution,
    });

    if (!Array.isArray(ticket.comments)) ticket.comments = [];
    ticket.comments.push(comment._id);
    if (ticket.status === 'Open') ticket.status = 'In Progress';
    await ticket.save();

    await logActivity(
      req.user._id,
      'Comment Added',
      `Comment added on ticket "${ticket.title}"`,
      req.ip
    );

    const populatedComment = await comment.populate('user', 'name avatar role');
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Delete a comment
// @route  DELETE /api/comments/:id
// @access Private
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.user?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Ticket.findByIdAndUpdate(comment.ticket, { $pull: { comments: comment._id } });
    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { addComment, deleteComment };
