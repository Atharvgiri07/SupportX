import { motion } from 'framer-motion';
import {
  FiAward,
  FiZap,
  FiCheckCircle,
  FiTrendingUp,
  FiStar,
  FiShield,
} from 'react-icons/fi';

const TOP_PERFORMERS = [
  {
    rank: 1,
    name: 'Sarah Chen',
    dept: 'DevOps & Systems',
    score: 982,
    resolved: 142,
    open: 1,
    badge: 'Speed Demon',
    badgeIcon: FiZap,
    avatarColor: '#eab308',
  },
  {
    rank: 2,
    name: 'Alex Rivera',
    dept: 'IT Infrastructure',
    score: 874,
    resolved: 118,
    open: 2,
    badge: 'Resolution King',
    badgeIcon: FiCheckCircle,
    avatarColor: '#94a3b8',
  },
  {
    rank: 3,
    name: 'Marcus Vance',
    dept: 'Software Support',
    score: 821,
    resolved: 104,
    open: 2,
    badge: 'Customer Champion',
    badgeIcon: FiStar,
    avatarColor: '#b45309',
  },
];

const LandingEmployeePerformance = () => {
  return (
    <section className="landing-section bg-alt" id="leaderboard">
      <div className="landing-container">
        {/* Header */}
        <div className="landing-section-header text-center">
          <span className="section-eyebrow">GAMIFIED WORKFORCE MOTIVATION</span>
          <h2 className="section-title">Recognize and reward support excellence.</h2>
          <p className="section-subtitle">
            SupportX awards points for every resolution based on SLA speed and priority level, keeping agent motivation high with live leaderboards and earned badges.
          </p>
        </div>

        {/* Leaderboard Showcase Grid */}
        <div className="performance-showcase-grid">
          {/* Leaderboard Visual Card */}
          <div className="leaderboard-card card">
            <div className="leaderboard-header">
              <div className="title-with-icon">
                <FiAward size={22} color="#eab308" />
                <div>
                  <h4 className="card-heading">Department Leaderboard</h4>
                  <span className="card-subheading">Ranked live by total performance points</span>
                </div>
              </div>
              <span className="monthly-pill">THIS MONTH</span>
            </div>

            <div className="leaderboard-list">
              {TOP_PERFORMERS.map((emp) => {
                const BadgeIcon = emp.badgeIcon;
                return (
                  <motion.div
                    key={emp.name}
                    className={`leaderboard-item rank-${emp.rank}`}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="rank-badge" style={{ color: emp.avatarColor }}>
                      #{emp.rank}
                    </div>
                    <div className="emp-main">
                      <div className="emp-name">{emp.name}</div>
                      <div className="emp-dept">{emp.dept}</div>
                    </div>
                    <div className="emp-badge-tag">
                      <BadgeIcon size={13} />
                      <span>{emp.badge}</span>
                    </div>
                    <div className="emp-stats">
                      <span className="emp-score">{emp.score} pts</span>
                      <span className="emp-resolved">{emp.resolved} resolved</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="leaderboard-footer-note">
              <FiTrendingUp size={14} color="var(--color-primary)" />
              <span>Rankings update dynamically as tickets are marked Resolved.</span>
            </div>
          </div>

          {/* Gamification Features Column */}
          <div className="gamify-features-column">
            <div className="gamify-card card">
              <h4 className="gamify-title">Dynamic Point Calculation</h4>
              <p className="gamify-desc">
                Points are calculated automatically based on priority level and speed of resolution before SLA expiry:
              </p>

              <div className="points-matrix">
                <div className="matrix-row">
                  <span className="matrix-priority p-critical">Critical Ticket</span>
                  <span className="matrix-pts">+350 Points</span>
                </div>
                <div className="matrix-row">
                  <span className="matrix-priority p-high">High Ticket</span>
                  <span className="matrix-pts">+200 Points</span>
                </div>
                <div className="matrix-row">
                  <span className="matrix-priority p-medium">Medium Ticket</span>
                  <span className="matrix-pts">+100 Points</span>
                </div>
                <div className="matrix-row">
                  <span className="matrix-priority p-low">Low Ticket</span>
                  <span className="matrix-pts">+50 Points</span>
                </div>
              </div>
            </div>

            <div className="gamify-card card">
              <div className="badge-system-header">
                <FiShield size={18} color="#8b5cf6" />
                <h4 className="gamify-title">Achievement Badges</h4>
              </div>
              <p className="gamify-desc">
                Employees earn permanent badges on their profile like <em>First Resolution</em>, <em>SLA Master</em>, and <em>Century Club (100+ Resolved)</em>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingEmployeePerformance;
