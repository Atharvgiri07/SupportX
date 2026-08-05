const Ticket = require('../models/Ticket');
const User = require('../models/User');
const Department = require('../models/Department');
const findBestAssignee = require('../utils/autoAssign');
const calculatePoints = require('../utils/calculatePoints');
const { checkAndAwardBadges } = require('../utils/checkBadges');

// @desc   Create a ticket — auto-assigns it to the best available employee
// @route  POST /api/tickets
// @access Private/Admin
const createTicket = async (req, res) => {
  try {
    const { title, description, category, priority, department } = req.body;

    if (!title || !description || !category || !department) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const departmentExists = await Department.findById(department);
    if (!departmentExists) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const assignee = await findBestAssignee(department);

    const ticket = await Ticket.create({
      title,
      description,
      category,
      priority: priority || 'Medium',
      department,
      createdBy: req.user._id,
      assignedTo: assignee ? assignee._id : null,
    });

    // Keep the assignee's open-ticket counter in sync immediately,
    // so the NEXT ticket created sees the updated workload.
    if (assignee) {
      assignee.currentOpen += 1;
      await assignee.save();
    }

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('assignedTo', 'name email performanceScore currentOpen')
      .populate('createdBy', 'name email')
      .populate('department', 'name');

    res.status(201).json({
      ticket: populatedTicket,
      assignmentInfo: assignee
        ? `Auto-assigned to ${assignee.name} (now ${assignee.currentOpen} open ticket(s))`
        : 'No available employee in this department — assign manually',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Get all tickets
// @route  GET /api/tickets
// @access Private/Admin
const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('department', 'name')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Get tickets assigned to the logged-in employee
// @route  GET /api/tickets/my
// @access Private
const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ assignedTo: req.user._id })
      .populate('department', 'name')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Get a single ticket with its comments
// @route  GET /api/tickets/:id
// @access Private
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('department', 'name')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'name avatar role' },
      });

    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Update ticket status (e.g. Open -> In Progress)
// @route  PUT /api/tickets/:id/status
// @access Private
const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    ticket.status = status;
    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Resolve a ticket — awards points and frees up the employee
// @route  PUT /api/tickets/:id/resolve
// @access Private
const resolveTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    if (ticket.status === 'Resolved' || ticket.status === 'Closed') {
      return res.status(400).json({ message: 'Ticket is already resolved' });
    }

    const points = calculatePoints(ticket.priority, ticket.createdAt);

    ticket.status = 'Resolved';
    ticket.resolvedAt = new Date();
    ticket.pointsAwarded = points;
    await ticket.save();

    let newBadges = [];
    if (ticket.assignedTo) {
      const employee = await User.findById(ticket.assignedTo);
      if (employee) {
        employee.performanceScore += points;
        employee.totalResolved += 1;
        employee.currentOpen = Math.max(0, employee.currentOpen - 1);
        await employee.save();
        newBadges = await checkAndAwardBadges(employee._id);
      }
    }

    res.json({ message: 'Ticket resolved', ticket, pointsAwarded: points, newBadges });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Rate a resolved ticket (1-5) — admin rates the quality of resolution
// @route  PUT /api/tickets/:id/rate
// @access Private/Admin
const rateTicket = async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const rateVal = rating || req.body.customerRating;
    const feedbackVal = feedback || req.body.customerFeedback || '';

    if (!rateVal || rateVal < 1 || rateVal > 5) {
      return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    if (ticket.status !== 'Resolved' && ticket.status !== 'Closed') {
      return res.status(400).json({ message: 'Only resolved tickets can be rated' });
    }

    ticket.rating = rateVal;
    ticket.customerRating = rateVal;
    ticket.customerFeedback = feedbackVal;
    await ticket.save();

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Delete a ticket
// @route  DELETE /api/tickets/:id
// @access Private/Admin
const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    await ticket.deleteOne();
    res.json({ message: 'Ticket deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createTicket,
  getAllTickets,
  getMyTickets,
  getTicketById,
  updateTicketStatus,
  resolveTicket,
  rateTicket,
  deleteTicket,
};
