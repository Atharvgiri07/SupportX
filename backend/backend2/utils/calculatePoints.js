const POINTS_BY_PRIORITY = {
  Low: 5,
  Medium: 10,
  High: 20,
  Critical: 30,
};

const FAST_FIX_BONUS = 5;
const FAST_FIX_WINDOW_MS = 2 * 60 * 60 * 1000; // 2 hours

/**
 * Calculates points earned for resolving a ticket.
 * Base points depend on priority; a +5 speed bonus applies if resolved
 * within 2 hours of creation.
 */
const calculatePoints = (priority, createdAt) => {
  const basePoints = POINTS_BY_PRIORITY[priority] || 0;
  const elapsedMs = Date.now() - new Date(createdAt).getTime();
  const bonus = elapsedMs <= FAST_FIX_WINDOW_MS ? FAST_FIX_BONUS : 0;
  return basePoints + bonus;
};

module.exports = calculatePoints;
