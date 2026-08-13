import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import Loader from '../../components/Loader';
import {
  FiCpu,
  FiUser,
  FiZap,
  FiCheckCircle,
  FiTrendingUp,
  FiAward,
  FiFileText,
  FiArrowRight,
} from 'react-icons/fi';
import './AIReports.css';

const AIReports = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState('');
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data } = await api.get('/performance/all');
        const list = Array.isArray(data) ? data : [];
        setEmployees(list);
        if (list.length > 0) {
          setSelectedId(list[0]._id);
        }
      } catch (err) {
        console.error('Failed to load employees for AI reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleGenerate = async () => {
    if (!selectedId) return;
    setGenerating(true);
    setReport(null);
    try {
      const { data } = await api.post(`/performance/ai-report/${selectedId}`);
      setReport(data);
      toast.success('AI Performance Report generated!');
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Could not generate report');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <Loader />;

  const selectedEmployee = employees.find((e) => e._id === selectedId);

  return (
    <div className="ai-reports-page-root">
      {/* Page Header Banner */}
      <div className="ai-reports-header">
        <div className="header-title-row">
          <div className="header-icon-badge ai-badge-glow">
            <FiCpu size={24} color="#ffffff" />
          </div>
          <div>
            <div className="ai-pill-tag">
              <FiZap size={13} color="#8b5cf6" />
              <span>Gemini 1.5 Flash Model Engine</span>
            </div>
            <h1 className="header-main-title">Gemini AI Performance Reports</h1>
            <p className="header-sub-title">
              Generate AI-driven employee evaluations, resolution speed analysis, strengths, and actionable growth insights.
            </p>
          </div>
        </div>
      </div>

      <div className="ai-reports-container">
        {/* Employee Selection Form Card */}
        <div className="card ai-reports-select-card">
          <div className="select-card-head">
            <h3>Select Employee to Evaluate</h3>
            {selectedEmployee && (
              <span className="employee-stat-chip">
                <FiAward size={13} /> {selectedEmployee.totalResolved} Resolved · {selectedEmployee.performanceScore} pts
              </span>
            )}
          </div>

          <div className="select-form-body">
            <div className="field flex-1">
              <label htmlFor="employee-select">Employee Target</label>
              <div className="input-with-icon-wrapper">
                <FiUser size={16} className="input-left-icon" />
                <select
                  id="employee-select"
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="ai-select-input"
                >
                  <option value="" disabled>Select an employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} ({emp.department?.name || 'Unassigned'}) — {emp.totalResolved} tickets, {emp.performanceScore} pts
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              className="btn btn-primary generate-ai-btn"
              onClick={handleGenerate}
              disabled={!selectedId || generating}
            >
              {generating ? (
                <span>Evaluating…</span>
              ) : (
                <>
                  <FiZap size={16} />
                  <span>Generate AI Evaluation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading State Animation */}
        {generating && (
          <div className="card ai-loading-card">
            <div className="ai-spinner-wrapper">
              <Loader />
            </div>
            <h4>Gemini AI is Analyzing Data</h4>
            <p>
              Processing {selectedEmployee?.name}'s ticket history, resolution SLA speeds, and performance metrics…
            </p>
          </div>
        )}

        {/* Executive AI Report Outcome Presentation */}
        {report && !generating && (
          <div className="card ai-report-outcome-card">
            <div className="outcome-card-header">
              <div className="outcome-brand">
                <FiZap size={20} color="#8b5cf6" />
                <div>
                  <h3>Executive Evaluation Report</h3>
                  <span className="outcome-employee-name">{report.employee}</span>
                </div>
              </div>
              <span className="ai-timestamp-badge">Generated Live via Gemini</span>
            </div>

            <div className="outcome-report-body">
              <pre className="ai-formatted-report">{report.report}</pre>
            </div>

            <div className="outcome-card-footer">
              <div className="footer-note">
                <FiCheckCircle size={14} color="#10b981" />
                <span>AI Evaluation based on historical workload and points resolution data.</span>
              </div>
            </div>
          </div>
        )}

        {employees.length === 0 && (
          <div className="card empty-ai-card">
            <FiFileText size={32} color="var(--color-text-muted)" />
            <p>No employees found. Please register employees to generate AI performance reports.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIReports;
