const POINTS_BY_PRIORITY = {
  Low: 5,
  Medium: 10,
  High: 20,
  Critical: 30,
};

const FAST_FIX_BONUS = 5;
const FAST_FIX_WINDOW_MS = 2 * 60 * 60 * 1000; // 2 hours
const OVERDUE_PENALTY = 5;

/**
 * Calculates points earned for resolving a ticket.
 * Base points depend on priority; a +5 speed bonus applies if resolved
 * within 2 hours of creation; a -5 penalty applies if resolved after the due date.
 */
const calculatePoints = (priority, createdAt, dueDate) => {
  const basePoints = POINTS_BY_PRIORITY[priority] || 0;
  const now = Date.now();
  const elapsedMs = now - new Date(createdAt).getTime();
  const bonus = elapsedMs <= FAST_FIX_WINDOW_MS ? FAST_FIX_BONUS : 0;

  // Overdue penalty: if dueDate exists and current time is past it
  let penalty = 0;
  if (dueDate && now > new Date(dueDate).getTime()) {
    penalty = OVERDUE_PENALTY;
  }

  return Math.max(1, basePoints + bonus - penalty);
};

module.exports = calculatePoints;
