import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import TicketCard from '../components/TicketCard';
import useCountUp from '../utils/useCountUp';
import {
  FiInbox,
  FiAward,
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiTrendingUp,
} from 'react-icons/fi';
import './Home.css';

const QUICK_LINKS = [
  { to: '/tickets', label: 'My Tickets', icon: FiInbox, desc: 'View tickets assigned to you', color: '#3b82f6', tint: 'rgba(59, 130, 246, 0.13)' },
  { to: '/performance', label: 'My Performance', icon: FiBarChart2, desc: 'See your points and stats', color: '#10b981', tint: 'rgba(16, 185, 129, 0.13)' },
  { to: '/leaderboard', label: 'Leaderboard', icon: FiAward, desc: 'See how you rank', color: '#eab308', tint: 'rgba(234, 179, 8, 0.13)' },
];

const StatCard = ({ label, value, icon: Icon, color, tint }) => {
  const animated = useCountUp(typeof value === 'number' ? value : 0);
  return (
    <div className="card home-stat">
      <div className="home-stat-top">
        <p className="home-stat-label">{label}</p>
        <span className="icon-box" style={{ background: tint }} aria-hidden="true">
          <Icon size={18} color={color} />
        </span>
      </div>
      <h2 className="home-stat-value" style={{ color }}>{animated}</h2>
    </div>
  );
};

const HomeSkeleton = () => (
  <div>
    <div className="page-header">
      <div className="skeleton" style={{ width: 200, height: 28 }} />
      <div className="skeleton" style={{ width: 260, height: 14, marginTop: 10 }} />
    </div>
    <div className="home-stats">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="card home-stat">
          <div className="home-stat-top">
            <div className="skeleton" style={{ width: 80, height: 12 }} />
            <div className="skeleton icon-box" style={{ background: 'var(--color-border)' }} />
          </div>
          <div className="skeleton" style={{ width: 50, height: 24, marginTop: 10 }} />
        </div>
      ))}
    </div>
  </div>
);

const Home = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0];

  const [performance, setPerformance] = useState(null);
  const [myTickets, setMyTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [perfRes, ticketsRes] = await Promise.all([
          api.get('/performance/my'),
          api.get('/tickets/my'),
        ]);
        setPerformance(perfRes.data);
        setMyTickets(Array.isArray(ticketsRes.data) ? ticketsRes.data : []);
      } catch (err) {
        console.error('Failed to load home dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <HomeSkeleton />;

  const openTickets = myTickets.filter((t) => t.status === 'Open' || t.status === 'In Progress');
  const overdueTickets = openTickets.filter((t) => t.dueDate && new Date(t.dueDate) < new Date());
  const recentTickets = myTickets.slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <h1>Welcome back, {firstName}</h1>
        <p>
          {performance?.department?.name
            ? `${performance.department.name} · here's where things stand today`
            : "Here's where you left off"}
        </p>
      </div>

      <div className="home-stats">
        <StatCard
          label="Performance Score"
          value={performance?.performanceScore ?? 0}
          icon={FiTrendingUp}
          color="#8b5cf6"
          tint="rgba(139, 92, 246, 0.13)"
        />
        <StatCard
          label="Resolved Tickets"
          value={performance?.totalResolved ?? 0}
          icon={FiCheckCircle}
          color="#10b981"
          tint="rgba(16, 185, 129, 0.13)"
        />
        <StatCard
          label="Current Workload"
          value={openTickets.length}
          icon={FiClock}
          color="#f59e0b"
          tint="rgba(245, 158, 11, 0.13)"
        />
        <StatCard
          label="Overdue"
          value={overdueTickets.length}
          icon={FiAlertTriangle}
          color="#ef4444"
          tint="rgba(239, 68, 68, 0.13)"
        />
      </div>

      <div className="home-section">
        <div className="home-section-header">
          <h3>Recent Tickets</h3>
          {myTickets.length > 0 && (
            <Link to="/tickets" className="home-section-link">View all</Link>
          )}
        </div>

        {recentTickets.length > 0 ? (
          <div className="home-tickets-grid">
            {recentTickets.map((t) => (
              <TicketCard key={t._id} ticket={t} />
            ))}
          </div>
        ) : (
          <div className="card empty-state">
            <FiInbox size={28} />
            <p className="empty-state-title">No tickets assigned yet</p>
            <p className="empty-state-desc">New tickets assigned to you will show up here.</p>
          </div>
        )}
      </div>

      <div className="home-section">
        <div className="home-section-header">
          <h3>Quick Actions</h3>
        </div>
        <div className="home-quicklinks">
          {QUICK_LINKS.map(({ to, label, icon: Icon, desc, color, tint }) => (
            <Link key={to} to={to} className="card home-quicklink">
              <span className="icon-box icon-box-lg" style={{ background: tint }} aria-hidden="true">
                <Icon size={20} color={color} />
              </span>
              <div>
                <div className="home-quicklink-label">{label}</div>
                <div className="home-quicklink-desc">{desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
