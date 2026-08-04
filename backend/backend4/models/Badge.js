const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    icon: { type: String, default: '🏆' },
    criteria: {
      type: {
        type: String,
        enum: ['totalResolved', 'performanceScore'],
        required: true,
      },
      threshold: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Badge', badgeSchema);
