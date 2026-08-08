const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Department = require('../models/Department');

// @desc   Overview counts for the admin dashboard
// @route  GET /api/dashboard/stats
// @access Private/Admin
const getStats = async (req, res) => {
  try {
    const [totalTickets, openTickets, resolvedTickets, overdueTickets, totalEmployees, totalDepartments] = await Promise.all([
      Ticket.countDocuments(),
      Ticket.countDocuments({ status: { $in: ['Open', 'In Progress'] } }),
      Ticket.countDocuments({ status: 'Resolved' }),
      Ticket.countDocuments({
        status: { $in: ['Open', 'In Progress'] },
        dueDate: { $ne: null, $lt: new Date() },
      }),
      User.countDocuments({ role: 'employee' }),
      Department.countDocuments(),
    ]);

    res.json({ totalTickets, openTickets, resolvedTickets, overdueTickets, totalEmployees, totalDepartments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Data shaped for dashboard charts (tickets by status, priority, department)
// @route  GET /api/dashboard/chart-data
// @access Private/Admin
const getChartData = async (req, res) => {
  try {
    const byStatus = await Ticket.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    const byPriority = await Ticket.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]);

    const byDepartment = await Ticket.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'departments',
          localField: '_id',
          foreignField: '_id',
          as: 'departmentInfo',
        },
      },
      { $unwind: { path: '$departmentInfo', preserveNullAndEmptyArrays: true } },
      { $project: { department: { $ifNull: ['$departmentInfo.name', 'Unassigned'] }, count: 1, _id: 0 } },
    ]);

    res.json({ byStatus, byPriority, byDepartment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getStats, getChartData };
