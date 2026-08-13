import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import {
  FiPlusCircle,
  FiFileText,
  FiTag,
  FiGrid,
  FiClock,
  FiZap,
  FiCheckCircle,
  FiUserCheck,
  FiAlertCircle,
  FiArrowRight,
} from 'react-icons/fi';
import './CreateTicket.css';

const PRIORITIES = [
  { level: 'Low', pts: 5, sla: '72 hrs', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  { level: 'Medium', pts: 10, sla: '48 hrs', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  { level: 'High', pts: 20, sla: '24 hrs', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  { level: 'Critical', pts: 30, sla: '4 hrs', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
];

const CreateTicket = () => {
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
    department: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [assignmentResult, setAssignmentResult] = useState(null);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [deptRes, catRes] = await Promise.all([
          api.get('/departments'),
          api.get('/categories')
        ]);
        const loadedDepts = Array.isArray(deptRes.data) ? deptRes.data : [];
        const loadedCats = Array.isArray(catRes.data) ? catRes.data.filter(c => c.isActive !== false) : [];
        setDepartments(loadedDepts);
        setCategories(loadedCats);

        setForm(prev => ({
          ...prev,
          category: prev.category || (loadedCats.length > 0 ? loadedCats[0].name : ''),
          department: prev.department || (loadedDepts.length > 0 ? loadedDepts[0]._id : ''),
        }));
      } catch (err) {
        console.error('Failed to fetch dropdown data:', err);
      }
    };
    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePrioritySelect = (level) => {
    setForm({ ...form, priority: level });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setAssignmentResult(null);
    try {
      const { data } = await api.post('/tickets', form);
      toast.success('Ticket created & auto-assigned successfully!');
      setAssignmentResult({
        ticket: data.ticket,
        info: data.assignmentInfo,
      });
      setForm({
        title: '',
        description: '',
        category: categories.length > 0 ? categories[0].name : '',
        priority: 'Medium',
        department: departments.length > 0 ? departments[0]._id : '',
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedPriorityObj = PRIORITIES.find(p => p.level === form.priority) || PRIORITIES[1];

  return (
    <div className="create-ticket-page-root">
      {/* Page Header */}
      <div className="create-ticket-header">
        <div className="header-title-row">
          <div className="header-icon-badge">
            <FiPlusCircle size={22} color="#ffffff" />
          </div>
          <div>
            <h1 className="header-main-title">Create Support Ticket</h1>
            <p className="header-sub-title">
              Tickets are intelligently auto-assigned to the employee with the lightest workload in the selected department.
            </p>
          </div>
        </div>
      </div>

      <div className="create-ticket-container">
        {/* Main Ticket Form Card */}
        <form onSubmit={handleSubmit} className="card create-ticket-card">
          <div className="form-section-head">
            <h3>Ticket Details</h3>
            <span className="form-head-badge">
              <FiZap size={13} /> SLA Target: {selectedPriorityObj.sla}
            </span>
          </div>

          {/* Ticket Title */}
          <div className="field">
            <label htmlFor="title">Ticket Title</label>
            <div className="input-with-icon-wrapper">
              <FiFileText size={16} className="input-left-icon" />
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Database connection pool timeout during peak hours"
                required
                className="create-ticket-input"
              />
            </div>
          </div>

          {/* Description */}
          <div className="field">
            <label htmlFor="description">Issue Description</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the issue in detail, error stack traces, step-by-step reproduction guide..."
              required
              className="create-ticket-textarea"
            />
          </div>

          {/* Category & Department Grid */}
          <div className="form-grid-two">
            <div className="field">
              <label htmlFor="category">Category</label>
              <div className="input-with-icon-wrapper">
                <FiTag size={16} className="input-left-icon" />
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="create-ticket-select"
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.icon || '🏷️'} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label htmlFor="department">Department (Workload Auto-Assign)</label>
              <div className="input-with-icon-wrapper">
                <FiGrid size={16} className="input-left-icon" />
                <select
                  id="department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  required
                  className="create-ticket-select"
                >
                  <option value="" disabled>Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Interactive Priority Selector Cards */}
          <div className="field">
            <label>Priority Level & Performance Points</label>
            <div className="priority-cards-grid">
              {PRIORITIES.map((p) => {
                const isSelected = form.priority === p.level;
                return (
                  <div
                    key={p.level}
                    className={`priority-card${isSelected ? ' selected' : ''}`}
                    style={{
                      borderColor: isSelected ? p.color : 'var(--color-border)',
                      background: isSelected ? p.bg : 'var(--color-surface)',
                    }}
                    onClick={() => handlePrioritySelect(p.level)}
                  >
                    <div className="priority-card-top">
                      <span className="priority-name" style={{ color: p.color }}>{p.level}</span>
                      {isSelected && <FiCheckCircle size={15} color={p.color} />}
                    </div>
                    <div className="priority-card-sub">
                      <span>+{p.pts} pts</span>
                      <span className="priority-sla-tag"><FiClock size={11} /> {p.sla} SLA</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            className="btn btn-primary btn-block submit-ticket-btn"
            disabled={submitting || !form.department || !form.category}
          >
            {submitting ? (
              <span>Creating & Auto-Assigning Ticket…</span>
            ) : (
              <>
                <span>Create & Auto-Assign Ticket</span>
                <FiArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Live Auto-Assignment Result Banner */}
        {assignmentResult && (
          <div className="card assignment-result-card">
            <div className="result-card-header">
              <FiUserCheck size={20} color="#10b981" />
              <h4>Workload Auto-Assignment Successful</h4>
            </div>
            <p className="result-card-info">{assignmentResult.info}</p>

            {assignmentResult.ticket && (
              <div className="result-ticket-preview">
                <div className="preview-row">
                  <span className="preview-lbl">Ticket Title:</span>
                  <span className="preview-val">{assignmentResult.ticket.title}</span>
                </div>
                <div className="preview-row">
                  <span className="preview-lbl">SLA Due Target:</span>
                  <span className="preview-val">
                    {assignmentResult.ticket.dueDate ? new Date(assignmentResult.ticket.dueDate).toLocaleString() : 'N/A'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTicket;
