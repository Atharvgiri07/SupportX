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
const seedBadges = async (retries = 3, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const count = await Badge.countDocuments();
      if (count === 0) {
        await Badge.insertMany(DEFAULT_BADGES);
        console.log(`🏅 Seeded ${DEFAULT_BADGES.length} default badges`);
      }
      return;
    } catch (error) {
      if (i === retries - 1) {
        console.warn('⚠️  Badge seeding notice (will auto-seed on next activity):', error.message);
      } else {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
};

// Call after any action that changes totalResolved/performanceScore.
// Returns the badges newly earned in this call (for a toast/notification).
const checkAndAwardBadges = async (userId) => {
  try {
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
  } catch (err) {
    console.warn('Badge check error:', err.message);
    return [];
  }
};

module.exports = { seedBadges, checkAndAwardBadges };
