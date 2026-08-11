const express = require('express');
const router = express.Router();
const {
  createTicket,
  getAllTickets,
  getMyTickets,
  getTicketById,
  updateTicketStatus,
  resolveTicket,
  rateTicket,
  deleteTicket,
} = require('../controllers/ticketController');
const { addComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/rbac');

router.post('/', protect, requireAdmin, createTicket);
router.get('/', protect, requireAdmin, getAllTickets);
router.get('/my', protect, getMyTickets); // must come before '/:id'
router.get('/:id', protect, getTicketById);
router.put('/:id/status', protect, updateTicketStatus);
router.put('/:id/resolve', protect, resolveTicket);
router.put('/:id/rate', protect, rateTicket);
router.delete('/:id', protect, requireAdmin, deleteTicket);

router.post('/:id/comments', protect, addComment);

module.exports = router;
