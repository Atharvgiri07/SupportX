import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import Loader from '../../components/Loader';
import { useAuth } from '../../context/AuthContext';
import {
  FiAward,
  FiTrendingUp,
  FiCheckCircle,
  FiUser,
  FiZap,
  FiBriefcase,
  FiStar,
} from 'react-icons/fi';
import './Leaderboard.css';

const PODIUM_CONFIG = [
  { rank: 1, title: 'Top Performer', crown: '🥇', color: '#eab308', bg: 'rgba(234, 179, 8, 0.12)', border: '#eab308' },
  { rank: 2, title: 'Silver Performer', crown: '🥈', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.12)', border: '#94a3b8' },
  { rank: 3, title: 'Bronze Performer', crown: '🥉', color: '#b45309', bg: 'rgba(180, 83, 9, 0.12)', border: '#b45309' },
];

const Leaderboard = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await api.get('/performance/leaderboard');
        setRows(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error('Could not load leaderboard');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <Loader />;

  const topThree = rows.slice(0, 3);
  const remainingRows = rows.slice(3);
  const userRankIndex = rows.findIndex((r) => r._id === user?._id);

  return (
    <div className="leaderboard-page-root">
      {/* Page Header */}
      <div className="leaderboard-header">
        <div className="header-title-row">
          <div className="header-icon-badge leaderboard-badge-glow">
            <FiAward size={22} color="#ffffff" />
          </div>
          <div>
            <h1 className="header-main-title">Workforce Leaderboard</h1>
            <p className="header-sub-title">
              Employee rankings based on ticket resolution speed, volume, and SLA performance points.
            </p>
          </div>
        </div>
      </div>

      {/* Logged-in User Rank Banner */}
      {userRankIndex !== -1 && (
        <div className="card user-rank-banner">
          <div className="rank-banner-left">
            <FiZap size={20} color="var(--color-primary)" />
            <div>
              <span className="rank-banner-title">Your Current Ranking</span>
              <p className="rank-banner-sub">
                You are currently ranked <strong>#{userRankIndex + 1}</strong> out of {rows.length} team members with <strong>{rows[userRankIndex]?.performanceScore || 0} pts</strong>.
              </p>
            </div>
          </div>
          <div className="rank-banner-score-pill">
            <FiTrendingUp size={16} />
            <span>#{userRankIndex + 1}</span>
          </div>
        </div>
      )}

      {/* Top 3 Championship Podium */}
      {topThree.length > 0 && (
        <div className="podium-section">
          <h3 className="podium-section-title">🏆 Top Performers</h3>
          <div className="podium-grid">
            {topThree.map((item, idx) => {
              const cfg = PODIUM_CONFIG[idx] || PODIUM_CONFIG[2];
              const isYou = item._id === user?._id;

              return (
                <div
                  key={item._id}
                  className={`card podium-card${isYou ? ' is-you-podium' : ''}`}
                  style={{ borderColor: cfg.border }}
                >
                  <div className="podium-crown-badge" style={{ background: cfg.bg, color: cfg.color }}>
                    <span className="crown-emoji">{cfg.crown}</span>
                    <span className="podium-rank-text">#{cfg.rank}</span>
                  </div>

                  <div className="podium-avatar-circle" style={{ borderColor: cfg.color }}>
                    {item.name?.charAt(0).toUpperCase() || 'U'}
                  </div>

                  <h4 className="podium-user-name">
                    {item.name} {isYou && <span className="you-chip">(You)</span>}
                  </h4>
                  <span className="podium-dept-tag">
                    <FiBriefcase size={12} /> {item.department?.name || 'Unassigned'}
                  </span>

                  <div className="podium-stats-row">
                    <div className="podium-stat">
                      <span className="stat-label">Resolved</span>
                      <span className="stat-value"><FiCheckCircle size={12} color="#10b981" /> {item.totalResolved || 0}</span>
                    </div>
                    <div className="podium-stat">
                      <span className="stat-label">Score</span>
                      <span className="stat-value score-val" style={{ color: cfg.color }}>
                        <FiStar size={12} /> {item.performanceScore || 0} pts
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Leaderboard Table / Card List */}
      <div className="card leaderboard-card">
        <div className="leaderboard-card-header">
          <h3>Team Standings</h3>
          <span className="total-members-chip">{rows.length} Employees Ranked</span>
        </div>

        <div className="leaderboard-list">
          {rows.map((row, index) => {
            const isYou = row._id === user?._id;
            return (
              <div
                key={row._id}
                className={`leaderboard-row-item${isYou ? ' is-you-row' : ''}`}
              >
                <div className="row-left">
                  <span className={`rank-badge${index < 3 ? ' top-three' : ''}`}>
                    #{index + 1}
                  </span>
                  <div className="row-avatar">
                    {row.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="row-user-details">
                    <div className="row-name">
                      {row.name} {isYou && <span className="you-chip">(You)</span>}
                    </div>
                    <div className="row-dept">
                      {row.department?.name || 'Unassigned'}
                    </div>
                  </div>
                </div>

                <div className="row-right">
                  <div className="row-stat-col">
                    <span className="stat-number">{row.totalResolved || 0}</span>
                    <span className="stat-caption">Resolved</span>
                  </div>

                  <div className="row-score-badge">
                    <FiTrendingUp size={14} />
                    <span>{row.performanceScore || 0} pts</span>
                  </div>
                </div>
              </div>
            );
          })}

          {rows.length === 0 && (
            <div className="empty-leaderboard">
              <FiUser size={28} color="var(--color-text-muted)" />
              <p>No employee rankings available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
