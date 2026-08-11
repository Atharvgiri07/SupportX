const Badge = require('../models/Badge');
const User = require('../models/User');

const DEFAULT_BADGES = [
  {
    name: 'First Resolve',
    description: 'Resolved your first ticket',
    icon: '🎯',
    criteria: { type: 'totalResolved', threshold: 1 },
  },
  {
    name: 'Problem Solver',
    description: 'Resolved 10 tickets',
    icon: '🛠️',
    criteria: { type: 'totalResolved', threshold: 10 },
  },
  {
    name: 'Veteran',
    description: 'Resolved 50 tickets',
    icon: '🏅',
    criteria: { type: 'totalResolved', threshold: 50 },
  },
  {
    name: 'Rising Star',
    description: 'Reached 100 performance points',
    icon: '⭐',
    criteria: { type: 'performanceScore', threshold: 100 },
  },
  {
    name: 'Top Performer',
    description: 'Reached 500 performance points',
    icon: '🏆',
    criteria: { type: 'performanceScore', threshold: 500 },
  },
];

// Runs once on server startup — creates the default badge set if none exist yet.
const seedBadges = async () => {
  try {
    const count = await Badge.countDocuments();
    if (count === 0) {
      await Badge.insertMany(DEFAULT_BADGES);
      console.log(`🏅 Seeded ${DEFAULT_BADGES.length} default badges`);
    }
  } catch (error) {
    console.error('Badge seeding failed:', error);
  }
};

// Call after any action that changes totalResolved/performanceScore.
// Returns the badges newly earned in this call (for a toast/notification).
const checkAndAwardBadges = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return [];

  const allBadges = await Badge.find();
  const newlyAwarded = [];

  for (const badge of allBadges) {
    const alreadyHas = user.badges.some((b) => b.toString() === badge._id.toString());
    if (alreadyHas) continue;

    const currentValue = badge.criteria.type === 'totalResolved' ? user.totalResolved : user.performanceScore;

    if (currentValue >= badge.criteria.threshold) {
      user.badges.push(badge._id);
      newlyAwarded.push(badge);
    }
  }

  if (newlyAwarded.length > 0) {
    await user.save();
  }

  return newlyAwarded;
};

module.exports = { seedBadges, checkAndAwardBadges };
