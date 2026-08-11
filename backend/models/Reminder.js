const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', default: null },
  title: { type: String, required: true, trim: true },
  reminderDate: { type: Date, required: true },
  isCompleted: { type: Boolean, default: false },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);
