import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import StatusBadge from '../../components/StatusBadge';
import useCountUp from '../../utils/useCountUp';
import {
  FiAlertTriangle,
  FiInbox,
  FiClock,
  FiCheckCircle,
  FiUsers,
  FiFolder,
  FiAward,
  FiBarChart2,
} from 'react-icons/fi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import './Dashboard.css';

const STAT_CONFIG = [
  { key: 'totalTickets', label: 'Total Tickets', icon: FiInbox, color: '#3b82f6', tint: 'rgba(59, 130, 246, 0.13)' },
  { key: 'openTickets', label: 'Open / In Progress', icon: FiClock, color: '#f59e0b', tint: 'rgba(245, 158, 11, 0.13)' },
  { key: 'resolvedTickets', label: 'Resolved Tickets', icon: FiCheckCircle, color: '#10b981', tint: 'rgba(16, 185, 129, 0.13)' },
  { key: 'overdueTickets', label: 'Overdue Items', icon: FiAlertTriangle, color: '#ef4444', tint: 'rgba(239, 68, 68, 0.13)' },
  { key: 'totalEmployees', label: 'Employees', icon: FiUsers, color: '#8b5cf6', tint: 'rgba(139, 92, 246, 0.13)' },
  { key: 'totalDepartments', label: 'Departments', icon: FiFolder, color: '#ec4899', tint: 'rgba(236, 72, 153, 0.13)' },
];

const PRIORITY_COLORS = {
  Low: '#94a3b8',
  Medium: '#3b82f6',
  High: '#f97316',
  Critical: '#ef4444',
};

const StatCard = ({ label, value, icon: Icon, color, tint }) => {
  const animated = useCountUp(typeof value === 'number' ? value : 0);
  return (
    <div className="card dashboard-stat">
      <div className="dashboard-stat-top">
        <p className="dashboard-stat-label">{label}</p>
        {Icon && (
          <span className="icon-box" style={{ background: tint }} aria-hidden="true">
            <Icon size={18} color={color} />
          </span>
        )}
      </div>
      <h2 className="dashboard-stat-value" style={{ color: color || 'var(--color-text)' }}>
        {animated}
      </h2>
    </div>
  );
};

const ChartEmptyState = () => (
  <div className="empty-state" style={{ padding: '48px 20px' }}>
    <FiBarChart2 size={28} />
    <p className="empty-state-title">No data yet</p>
    <p className="empty-state-desc">Chart will populate once tickets come in.</p>
  </div>
);

const DashboardSkeleton = () => (
  <div>
    <div className="page-header">
      <div className="skeleton" style={{ width: 220, height: 28 }} />
      <div className="skeleton" style={{ width: 320, height: 14, marginTop: 10 }} />
    </div>
    <div className="dashboard-stats">
      {STAT_CONFIG.map((s) => (
        <div key={s.key} className="card dashboard-stat">
          <div className="dashboard-stat-top">
            <div className="skeleton" style={{ width: 90, height: 12 }} />
            <div className="skeleton icon-box" style={{ background: 'var(--color-border)' }} />
          </div>
          <div className="skeleton" style={{ width: 60, height: 26, marginTop: 10 }} />
        </div>
      ))}
    </div>
    <div className="dashboard-charts">
      {[0, 1, 2].map((i) => (
        <div key={i} className={`card dashboard-chart${i === 2 ? ' dashboard-chart-wide' : ''}`}>
          <div className="skeleton" style={{ width: 140, height: 16, marginBottom: 16 }} />
          <div className="skeleton" style={{ width: '100%', height: 220 }} />
        </div>
      ))}
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [urgentTickets, setUrgentTickets] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, chartRes, ticketsRes, performanceRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/chart-data'),
          api.get('/tickets'),
          api.get('/performance/all'),
        ]);
        setStats(statsRes.data);
        setChartData(chartRes.data);

        const tList = Array.isArray(ticketsRes.data) ? ticketsRes.data : [];
        setUrgentTickets(
          tList.filter(
            (t) => t.priority === 'Critical' && t.status !== 'Resolved' && t.status !== 'Closed'
          )
        );

        const perfList = Array.isArray(performanceRes.data) ? performanceRes.data : [];
        setTopPerformers(perfList.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <DashboardSkeleton />;

  const hasTicketData = (stats?.totalTickets ?? 0) > 0;

  return (
    <div>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Real-time analytics, SLA tracking, and ticket metrics</p>
      </div>

      {urgentTickets.length > 0 && (
        <div className="card dashboard-urgent">
          <div className="dashboard-urgent-header">
            <FiAlertTriangle size={18} color="var(--color-danger)" />
            <h3>Urgent & Critical Tickets ({urgentTickets.length})</h3>
          </div>
          {urgentTickets.map((t) => (
            <Link key={t._id} to={`/tickets/${t._id}`} className="dashboard-urgent-item">
              <span style={{ fontWeight: 600 }}>{t.title}</span>
              <span className="dashboard-urgent-right">
                <StatusBadge status={t.status} />
                <span className="dashboard-urgent-assignee">{t.assignedTo?.name || 'Unassigned'}</span>
              </span>
            </Link>
          ))}
        </div>
      )}

      <div className="dashboard-stats">
        {STAT_CONFIG.map(({ key, label, icon, color, tint }) => (
          <StatCard key={key} label={label} value={stats?.[key] ?? 0} icon={icon} color={color} tint={tint} />
        ))}
      </div>

      <div className="dashboard-charts">
        <div className="card dashboard-chart">
          <h3 style={{ marginBottom: 16 }}>Tickets by Status</h3>
          {hasTicketData ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData?.byStatus || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--color-primary)" radius={[6, 6, 0, 0]} name="Tickets" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmptyState />
          )}
        </div>

        <div className="card dashboard-chart">
          <h3 style={{ marginBottom: 16 }}>Tickets by Priority</h3>
          {hasTicketData ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={chartData?.byPriority || []}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={(entry) => `${entry._id} (${entry.count})`}
                >
                  {(chartData?.byPriority || []).map((entry) => (
                    <Cell key={entry._id} fill={PRIORITY_COLORS[entry._id] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmptyState />
          )}
        </div>

        <div className="card dashboard-chart dashboard-chart-wide">
          <h3 style={{ marginBottom: 16 }}>Tickets by Department</h3>
          {hasTicketData ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData?.byDepartment || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="department" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Tickets" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmptyState />
          )}
        </div>
      </div>

      {topPerformers.length > 0 && (
        <div className="card dashboard-performers">
          <h3 style={{ marginBottom: 16 }}>
            <FiAward size={18} color="#eab308" style={{ verticalAlign: -3, marginRight: 6 }} />
            Top Employee Performers
          </h3>
          <div className="dashboard-performers-grid">
            {topPerformers.map((emp, index) => (
              <div key={emp._id} className="dashboard-performer">
                <span className="dashboard-performer-rank">#{index + 1}</span>
                <div>
                  <p className="dashboard-performer-name">{emp.name}</p>
                  <p className="dashboard-performer-dept">{emp.department?.name || 'Unassigned'}</p>
                  <p className="dashboard-performer-score">
                    {emp.performanceScore} pts &bull; {emp.totalResolved} resolved
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
