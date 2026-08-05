const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    pointsAwarded: { type: Number, default: 0 },
    resolvedAt: { type: Date, default: null },
    rating: { type: Number, min: 1, max: 5, default: null },
    customerRating: { type: Number, min: 1, max: 5, default: null },
    customerFeedback: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', ticketSchema);
