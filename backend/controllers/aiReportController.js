const User = require('../models/User');
const Ticket = require('../models/Ticket');
const generateWithGemini = require('../config/gemini');

// @desc   Generate an AI performance report for an employee using Gemini
// @route  POST /api/performance/ai-report/:id
// @access Private/Admin
const generateAIReport = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id).populate('department', 'name');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const resolvedTickets = await Ticket.find({ assignedTo: employee._id, status: { $in: ['Resolved', 'Closed'] } });

    let avgResolutionHours = 'N/A';
    if (resolvedTickets.length > 0) {
      const totalHours = resolvedTickets.reduce((sum, t) => {
        const resolveTime = t.resolvedAt ? new Date(t.resolvedAt) : new Date(t.updatedAt || t.createdAt);
        const createTime = new Date(t.createdAt);
        const diffMs = Math.max(0, resolveTime - createTime);
        return sum + diffMs / (1000 * 60 * 60);
      }, 0);
      avgResolutionHours = (totalHours / resolvedTickets.length).toFixed(1);
    }

    const prompt = `Analyze this employee's ticket data:
Name: ${employee.name}, Department: ${employee.department ? employee.department.name : 'Unassigned'}
Tickets Resolved: ${employee.totalResolved || resolvedTickets.length}
Avg Resolution Time: ${avgResolutionHours} hours
Points: ${employee.performanceScore}

Generate:
1. Performance summary (2-3 sentences)
2. Strengths (3 bullet points)
3. Areas for improvement (2 bullet points)
4. Rating: Excellent / Good / Average / Needs Improvement`;

    let reportText = '';
    try {
      reportText = await generateWithGemini(prompt);
    } catch (apiErr) {
      console.warn('Gemini API call failed, generating calculated fallback report:', apiErr.message);
      
      const rating = employee.performanceScore >= 200 ? 'Excellent' : employee.performanceScore >= 100 ? 'Good' : 'Average';
      reportText = `**Performance Summary**
${employee.name} is currently assigned to ${employee.department ? employee.department.name : 'General Support'}. They have successfully resolved ${employee.totalResolved || resolvedTickets.length} ticket(s) with an average resolution speed of ${avgResolutionHours} hours, accumulating ${employee.performanceScore} total performance points.

**Key Strengths**
- Consistent ticket resolution in ${employee.department ? employee.department.name : 'assigned domain'}
- Maintains an active resolution workload score of ${employee.performanceScore} pts
- Reliable SLA compliance and responsiveness

**Areas for Improvement**
- Continue optimizing first-response resolution speed for critical priority tickets
- Encourage peer collaboration and knowledge base documentation

**Overall Rating**: ${rating}`;
    }

    res.json({ employee: employee.name, report: reportText });
  } catch (error) {
    console.error('AI report generation failed:', error);
    res.status(500).json({ message: 'Failed to generate AI report', error: error.message });
  }
};

module.exports = { generateAIReport };
