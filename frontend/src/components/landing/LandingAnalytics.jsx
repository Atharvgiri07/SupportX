import { motion } from 'framer-motion';
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
import {
  FiInbox,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiUsers,
  FiFolder,
  FiBarChart2,
} from 'react-icons/fi';

const DEMO_STATUS_DATA = [
  { _id: 'Open', count: 18 },
  { _id: 'In Progress', count: 32 },
  { _id: 'Pending', count: 12 },
  { _id: 'Resolved', count: 145 },
  { _id: 'Closed', count: 98 },
];

const DEMO_PRIORITY_DATA = [
  { _id: 'Low', count: 42, color: '#94a3b8' },
  { _id: 'Medium', count: 110, color: '#3b82f6' },
  { _id: 'High', count: 68, color: '#f97316' },
  { _id: 'Critical', count: 25, color: '#ef4444' },
];

const DEMO_DEPT_DATA = [
  { department: 'IT Infrastructure', count: 64 },
  { department: 'DevOps', count: 52 },
  { department: 'Software Support', count: 88 },
  { department: 'Billing & Account', count: 41 },
];

const STAT_ITEMS = [
  { label: 'Total Tickets', value: 305, icon: FiInbox, color: '#3b82f6' },
  { label: 'Open / In Progress', value: 50, icon: FiClock, color: '#f59e0b' },
  { label: 'Pending', value: 12, icon: FiAlertTriangle, color: '#a855f7' },
  { label: 'Resolved Tickets', value: 243, icon: FiCheckCircle, color: '#10b981' },
  { label: 'Departments', value: 4, icon: FiFolder, color: '#ec4899' },
  { label: 'Active Employees', value: 16, icon: FiUsers, color: '#8b5cf6' },
];

const LandingAnalytics = () => {
  return (
    <section className="landing-section" id="analytics">
      <div className="landing-container">
        {/* Header */}
        <div className="landing-section-header text-center">
          <span className="section-eyebrow">ADMINISTRATIVE DASHBOARD</span>
          <h2 className="section-title">Real-time metrics for total visibility.</h2>
          <p className="section-subtitle">
            Comprehensive admin analytics track ticket volumes, resolution velocities, and department capacity in real time.
          </p>
        </div>

        {/* Analytics Interactive Widget */}
        <div className="analytics-preview-wrapper card">
          {/* Stat Cards Row */}
          <div className="analytics-stats-grid">
            {STAT_ITEMS.map((st) => {
              const Icon = st.icon;
              return (
                <div key={st.label} className="analytics-stat-card">
                  <div className="analytics-stat-header">
                    <span className="stat-lbl">{st.label}</span>
                    <Icon size={16} color={st.color} />
                  </div>
                  <div className="stat-val" style={{ color: st.color }}>
                    {st.value}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="analytics-charts-grid">
            {/* Status Bar Chart */}
            <div className="chart-container-card">
              <h4 className="chart-title">Tickets by Status</h4>
              <div style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DEMO_STATUS_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="_id" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        color: 'var(--color-text)',
                      }}
                    />
                    <Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Tickets" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Priority Pie Chart */}
            <div className="chart-container-card">
              <h4 className="chart-title">Tickets by Priority</h4>
              <div style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={DEMO_PRIORITY_DATA}
                      dataKey="count"
                      nameKey="_id"
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      innerRadius={40}
                      paddingAngle={3}
                      label={(e) => `${e._id}`}
                    >
                      {DEMO_PRIORITY_DATA.map((entry) => (
                        <Cell key={entry._id} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        color: 'var(--color-text)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Department Bar Chart */}
            <div className="chart-container-card chart-wide">
              <h4 className="chart-title">Department Workloads</h4>
              <div style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DEMO_DEPT_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="department" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        color: 'var(--color-text)',
                      }}
                    />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Tickets" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingAnalytics;
