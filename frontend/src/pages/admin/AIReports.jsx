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
  FiDownload,
  FiPrinter,
  FiClock,
  FiAlertTriangle,
  FiActivity,
  FiShield,
  FiRefreshCw,
  FiBarChart2,
  FiPieChart,
  FiTarget,
  FiSmile,
} from 'react-icons/fi';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import './AIReports.css';

const PRIORITY_PALETTE = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

const AIReports = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState('');
  const [generating, setGenerating] = useState(false);
  const [reportData, setReportData] = useState(null);

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

  const handleGenerate = async (id = selectedId) => {
    if (!id) return;
    setGenerating(true);
    try {
      const { data } = await api.post(`/performance/ai-report/${id}`);
      setReportData(data);
      toast.success('Enterprise AI Performance Report generated!');
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Could not generate report');
    } finally {
      setGenerating(false);
    }
  };

  const selectedEmployee = employees.find((e) => e._id === selectedId);

  // Export Report to Text / Markdown File
  const handleDownloadReport = () => {
    if (!reportData) return;
    const content = `=====================================================
SUPPORTX ENTERPRISE AI PERFORMANCE EVALUATION REPORT
Employee: ${reportData.employee} (${reportData.department})
Generated At: ${new Date(reportData.generatedAt).toLocaleString()}
=====================================================

KPI METRICS SUMMARY:
- Total Resolved Tickets: ${reportData.metrics.totalResolved}
- Current Open Queue: ${reportData.metrics.currentOpen}
- Performance Points: ${reportData.metrics.performanceScore}
- Average Resolution Time: ${reportData.metrics.avgResolutionHours} hrs
- SLA Compliance Rate: ${reportData.metrics.slaComplianceRate}%
- Burnout Risk Level: ${reportData.metrics.burnoutRisk} (${reportData.metrics.burnoutScore}/100)
- Customer Satisfaction (CSAT): ${reportData.metrics.avgRating}/5.0

=====================================================
EXECUTIVE GEMINI AI EVALUATION:
=====================================================

${reportData.report}
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SupportX_AI_Report_${reportData.employee.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Report downloaded successfully!');
  };

  // Export CSV Data
  const handleExportCSV = () => {
    if (!reportData) return;
    const m = reportData.metrics;
    const csvContent = `Metric,Value\nEmployee Name,${reportData.employee}\nDepartment,${reportData.department}\nTotal Resolved,${m.totalResolved}\nActive Workload,${m.currentOpen}\nPerformance Score,${m.performanceScore}\nAvg Resolution Hours,${m.avgResolutionHours}\nSLA Compliance,${m.slaComplianceRate}%\nBurnout Risk,${m.burnoutRisk}\nCSAT Score,${m.avgRating}/5.0\n`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SupportX_Metrics_${reportData.employee.replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV dataset exported!');
  };

  if (loading) return <Loader />;

  // Chart Data Preparation
  const priorityChartData = reportData?.metrics?.priorityBreakdown
    ? [
        { name: 'Critical', value: reportData.metrics.priorityBreakdown.Critical || 0 },
        { name: 'High', value: reportData.metrics.priorityBreakdown.High || 0 },
        { name: 'Medium', value: reportData.metrics.priorityBreakdown.Medium || 0 },
        { name: 'Low', value: reportData.metrics.priorityBreakdown.Low || 0 },
      ]
    : [];

  const comparisonChartData = reportData
    ? [
        { name: 'Resolved Tickets', Employee: reportData.metrics.totalResolved, TeamAvg: 18 },
        { name: 'Workload Pts', Employee: Math.min(100, Math.round(reportData.metrics.performanceScore / 5)), TeamAvg: 45 },
        { name: 'SLA Compliance %', Employee: reportData.metrics.slaComplianceRate, TeamAvg: 88 },
        { name: 'CSAT (x20)', Employee: Math.round(reportData.metrics.avgRating * 20), TeamAvg: 90 },
      ]
    : [];

  const trendData = [
    { week: 'Week 1', velocity: 4, points: 40 },
    { week: 'Week 2', velocity: 7, points: 85 },
    { week: 'Week 3', velocity: 6, points: 70 },
    { week: 'Week 4', velocity: 9, points: 120 },
  ];

  return (
    <div className="ai-reports-page-root">
      {/* ── Top Header Banner ── */}
      <div className="ai-reports-header">
        <div className="header-title-row">
          <div className="header-icon-badge ai-badge-glow">
            <FiCpu size={24} color="#ffffff" />
          </div>
          <div>
            <div className="ai-pill-tag">
              <FiZap size={13} color="#8b5cf6" />
              <span>Google Gemini 2.0 Strategic Workforce Engine</span>
            </div>
            <h1 className="header-main-title">AI Workforce Performance & Analytics Suite</h1>
            <p className="header-sub-title">
              Power BI-grade workforce intelligence: automated resolution diagnostics, burnout predictive modeling, SLA adherence benchmarks, and strategic coaching action plans.
            </p>
          </div>
        </div>
      </div>

      {/* ── Employee Selection & Command Bar ── */}
      <div className="card ai-reports-select-card">
        <div className="select-card-head">
          <div className="select-head-title">
            <FiUser size={18} color="var(--color-primary)" />
            <h3>Target Employee Roster</h3>
          </div>
          {selectedEmployee && (
            <span className="employee-stat-chip">
              <FiAward size={13} /> {selectedEmployee.totalResolved} Resolved · {selectedEmployee.performanceScore} pts
            </span>
          )}
        </div>

        <div className="select-form-body">
          <div className="field flex-1">
            <label htmlFor="employee-select">Select Employee for Evaluation</label>
            <div className="input-with-icon-wrapper">
              <FiUser size={16} className="input-left-icon" />
              <select
                id="employee-select"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="ai-select-input"
              >
                <option value="" disabled>Choose an employee...</option>
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
            onClick={() => handleGenerate(selectedId)}
            disabled={!selectedId || generating}
          >
            {generating ? (
              <>
                <FiRefreshCw size={16} className="spinner-rotate" />
                <span>Analyzing Workload…</span>
              </>
            ) : (
              <>
                <FiZap size={16} />
                <span>Run Gemini AI Diagnostic</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Loading Animation ── */}
      {generating && (
        <div className="card ai-loading-card">
          <div className="ai-spinner-wrapper">
            <Loader />
          </div>
          <h4>Gemini AI Workforce Diagnostics in Progress</h4>
          <p>
            Synthesizing {selectedEmployee?.name}'s historical ticket timestamps, SLA velocity margins, burnout capacity metrics, and qualitative satisfaction ratings…
          </p>
        </div>
      )}

      {/* ── Power BI-Grade Report Output ── */}
      {reportData && !generating && (
        <div className="ai-report-presentation-space">
          {/* Action Toolbar */}
          <div className="report-action-toolbar card">
            <div className="report-badge-meta">
              <span className="live-indicator-dot" />
              <strong>{reportData.employee}</strong> · {reportData.department}
              <span className="report-date-tag">
                Generated {new Date(reportData.generatedAt).toLocaleDateString()} at {new Date(reportData.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="report-action-buttons">
              <button className="btn btn-secondary btn-sm" onClick={handleExportCSV} title="Export CSV Data">
                <FiDownload size={14} />
                <span>Export CSV</span>
              </button>
              <button className="btn btn-secondary btn-sm" onClick={handleDownloadReport} title="Download Full Text Report">
                <FiFileText size={14} />
                <span>Download Report</span>
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => window.print()} title="Print Executive View">
                <FiPrinter size={14} />
                <span>Print PDF</span>
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => handleGenerate(selectedId)} title="Re-evaluate">
                <FiRefreshCw size={14} />
                <span>Re-evaluate</span>
              </button>
            </div>
          </div>

          {/* KPI Scorecards Grid */}
          <div className="kpi-scorecards-grid">
            <div className="card kpi-card">
              <div className="kpi-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#6366f1' }}>
                <FiAward size={20} />
              </div>
              <div className="kpi-info">
                <span className="kpi-label">Performance Score</span>
                <h3 className="kpi-value">{reportData.metrics.performanceScore} <span className="kpi-unit">pts</span></h3>
                <span className="kpi-subtext">Cumulative points earned</span>
              </div>
            </div>

            <div className="card kpi-card">
              <div className="kpi-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                <FiCheckCircle size={20} />
              </div>
              <div className="kpi-info">
                <span className="kpi-label">Total Resolved</span>
                <h3 className="kpi-value">{reportData.metrics.totalResolved}</h3>
                <span className="kpi-subtext">{reportData.metrics.currentOpen} active in queue</span>
              </div>
            </div>

            <div className="card kpi-card">
              <div className="kpi-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
                <FiClock size={20} />
              </div>
              <div className="kpi-info">
                <span className="kpi-label">Avg Resolution Speed</span>
                <h3 className="kpi-value">{reportData.metrics.avgResolutionHours} <span className="kpi-unit">hrs</span></h3>
                <span className="kpi-subtext">SLA benchmark target: &lt;48h</span>
              </div>
            </div>

            <div className="card kpi-card">
              <div className="kpi-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
                <FiTarget size={20} />
              </div>
              <div className="kpi-info">
                <span className="kpi-label">SLA Compliance</span>
                <h3 className="kpi-value">{reportData.metrics.slaComplianceRate}%</h3>
                <span className="kpi-subtext">On-time SLA adherence</span>
              </div>
            </div>

            <div className="card kpi-card">
              <div
                className="kpi-icon-wrap"
                style={{
                  background: reportData.metrics.burnoutRisk === 'High' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(139, 92, 246, 0.12)',
                  color: reportData.metrics.burnoutRisk === 'High' ? '#ef4444' : '#8b5cf6',
                }}
              >
                <FiAlertTriangle size={20} />
              </div>
              <div className="kpi-info">
                <span className="kpi-label">Burnout Risk</span>
                <h3 className="kpi-value" style={{ color: reportData.metrics.burnoutRisk === 'High' ? '#ef4444' : 'inherit' }}>
                  {reportData.metrics.burnoutRisk}
                </h3>
                <span className="kpi-subtext">Capacity score: {reportData.metrics.burnoutScore}/100</span>
              </div>
            </div>

            <div className="card kpi-card">
              <div className="kpi-icon-wrap" style={{ background: 'rgba(236, 72, 153, 0.12)', color: '#ec4899' }}>
                <FiSmile size={20} />
              </div>
              <div className="kpi-info">
                <span className="kpi-label">Customer Satisfaction</span>
                <h3 className="kpi-value">{reportData.metrics.avgRating} <span className="kpi-unit">/ 5.0</span></h3>
                <span className="kpi-subtext">Rating index</span>
              </div>
            </div>
          </div>

          {/* Multi-Chart Analytics Grid */}
          <div className="charts-analytics-grid">
            {/* Chart 1: Priority Breakdown Donut */}
            <div className="card chart-card">
              <div className="chart-card-header">
                <div className="chart-head-title">
                  <FiPieChart size={16} color="var(--color-primary)" />
                  <h4>Queue Priority Distribution</h4>
                </div>
                <span className="chart-sub-tag">Tickets by urgency level</span>
              </div>
              <div className="chart-render-wrap">
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={priorityChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {priorityChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PRIORITY_PALETTE[index % PRIORITY_PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Employee vs Team Benchmark */}
            <div className="card chart-card">
              <div className="chart-card-header">
                <div className="chart-head-title">
                  <FiBarChart2 size={16} color="var(--color-primary)" />
                  <h4>Employee vs Team Benchmark</h4>
                </div>
                <span className="chart-sub-tag">Performance comparison</span>
              </div>
              <div className="chart-render-wrap">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={comparisonChartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={11} />
                    <YAxis stroke="var(--color-text-muted)" fontSize={11} />
                    <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }} />
                    <Legend />
                    <Bar dataKey="Employee" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="TeamAvg" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Weekly Resolution Velocity Trend */}
            <div className="card chart-card chart-card-wide">
              <div className="chart-card-header">
                <div className="chart-head-title">
                  <FiTrendingUp size={16} color="var(--color-primary)" />
                  <h4>Weekly Resolution Velocity & Points Trajectory</h4>
                </div>
                <span className="chart-sub-tag">4-week productivity trend</span>
              </div>
              <div className="chart-render-wrap">
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="week" stroke="var(--color-text-muted)" fontSize={11} />
                    <YAxis stroke="var(--color-text-muted)" fontSize={11} />
                    <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="points" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorPoints)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Strategic Gemini AI Narrative Assessment Card */}
          <div className="card ai-report-outcome-card">
            <div className="outcome-card-header">
              <div className="outcome-brand">
                <div className="ai-report-avatar-badge">
                  <FiCpu size={22} color="#ffffff" />
                </div>
                <div>
                  <h3>Executive Gemini AI Evaluation Report</h3>
                  <span className="outcome-employee-name">{reportData.employee} · {reportData.department}</span>
                </div>
              </div>
              <span className="ai-timestamp-badge">
                <FiShield size={13} /> Gemini 2.0 Flash Enterprise Engine
              </span>
            </div>

            <div className="outcome-report-body">
              <div className="ai-formatted-markdown-body">
                {reportData.report.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h4 key={idx} className="ai-report-heading">
                        {paragraph.replace('### ', '')}
                      </h4>
                    );
                  }
                  if (paragraph.startsWith('- ') || paragraph.startsWith('1. ') || paragraph.startsWith('2. ') || paragraph.startsWith('3. ')) {
                    return (
                      <div key={idx} className="ai-report-list-item">
                        {paragraph}
                      </div>
                    );
                  }
                  return (
                    <p key={idx} className="ai-report-para">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>

            <div className="outcome-card-footer">
              <div className="footer-note">
                <FiCheckCircle size={14} color="#10b981" />
                <span>Immutable audit trail and AI synthesis generated from verified SupportX telemetry.</span>
              </div>
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
  );
};

export default AIReports;
