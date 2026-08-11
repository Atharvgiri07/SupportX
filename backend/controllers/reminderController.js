const Reminder = require('../models/Reminder');

const createReminder = async (req, res) => {
  try {
    const { title, reminderDate, ticket, notes } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }
    if (!reminderDate) {
      return res.status(400).json({ message: 'Reminder date is required' });
    }

    const reminder = await Reminder.create({
      user: req.user._id,
      title: title.trim(),
      reminderDate,
      ticket: ticket || null,
      notes: notes ? notes.trim() : ''
    });

    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create reminder', error: error.message });
  }
};

const getMyReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user._id })
      .populate('ticket', 'title status')
      .sort({ reminderDate: 1 });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get reminders', error: error.message });
  }
};

const completeReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, user: req.user._id });
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
    reminder.isCompleted = !reminder.isCompleted;
    await reminder.save();
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update reminder', error: error.message });
  }
};

const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
    res.json({ message: 'Reminder deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete reminder', error: error.message });
  }
};

module.exports = { createReminder, getMyReminders, completeReminder, deleteReminder };
