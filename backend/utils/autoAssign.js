const User = require('../models/User');

/**
 * Finds the best employee in a department to receive a new ticket.
 *
 * Rule (from the implementation plan):
 *   1. Least open tickets wins.
 *   2. If tied, higher performanceScore wins.
 *
 * Instead of fetching everyone and comparing manually in JS, we let MongoDB
 * do the sorting — sort by currentOpen ascending, then performanceScore
 * descending, and the employee we want is simply the first result.
 */
const findBestAssignee = async (departmentId) => {
  const employees = await User.find({
    department: departmentId,
    role: 'employee',
    isActive: true,
  }).sort({ currentOpen: 1, performanceScore: -1 });

  if (employees.length === 0) return null;

  return employees[0];
};

module.exports = findBestAssignee;
