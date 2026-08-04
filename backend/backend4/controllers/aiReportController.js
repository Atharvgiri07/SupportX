const User = require('../models/User');
const Ticket = require('../models/Ticket');
const generateWithGemini = require('../config/gemini');

// @desc   Generate an AI performance report for an employee using Gemini
// @route  POST /api/performance/ai-report/:id
// @access Private/Admin
const generateAIReport = async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return res.status(500).json({ message: 'GEMINI_API_KEY is not set in your .env file yet' });
    }

    const employee = await User.findById(req.params.id).populate('department', 'name');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const resolvedTickets = await Ticket.find({ assignedTo: employee._id, status: 'Resolved' });
    const avgResolutionHours =
      resolvedTickets.length > 0
        ? (
            resolvedTickets.reduce((sum, t) => sum + (new Date(t.resolvedAt) - new Date(t.createdAt)), 0) /
            resolvedTickets.length /
            (1000 * 60 * 60)
          ).toFixed(1)
        : 'N/A';

    const prompt = `Analyze this employee's ticket data:
Name: ${employee.name}, Department: ${employee.department ? employee.department.name : 'Unassigned'}
Tickets Resolved: ${employee.totalResolved}
Avg Resolution Time: ${avgResolutionHours} hours
Points: ${employee.performanceScore}

Generate:
1. Performance summary (2-3 sentences)
2. Strengths (3 bullet points)
3. Areas for improvement (2 bullet points)
4. Rating: Excellent / Good / Average / Needs Improvement`;

    const reportText = await generateWithGemini(prompt);
    res.json({ employee: employee.name, report: reportText });
  } catch (error) {
    console.error('AI report generation failed:', error);
    res.status(500).json({ message: 'Failed to generate AI report', error: error.message });
  }
};

module.exports = { generateAIReport };
