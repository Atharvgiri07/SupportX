import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiUser,
  FiShield,
  FiArrowRight,
  FiCheck,
  FiLogIn,
  FiUserPlus,
  FiLock,
  FiCpu,
  FiZap,
} from 'react-icons/fi';
import './LandingPortals.css';

const LandingPortals = () => {
  return (
    <section className="landing-portals-section" id="portals">
      <div className="landing-container">
        <div className="landing-section-header text-center">
          <span className="section-eyebrow">PORTAL ACCESS GATEWAY</span>
          <h2 className="section-title">
            Choose Your <span className="hero-gradient-text">SupportX Workspace</span>
          </h2>
          <p className="section-subtitle">
            Dedicated authentication gateways designed specifically for employee operations and organizational governance.
          </p>
        </div>

        <div className="landing-portals-grid">
          {/* 👤 EMPLOYEE PORTAL CARD */}
          <motion.div
            className="portal-card employee-portal-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -6 }}
          >
            <div className="portal-badge-pill employee-badge">
              <FiUser size={14} />
              <span>Support Specialist Portal</span>
            </div>

            <div className="portal-icon-wrapper employee-icon-glow">
              <FiZap size={32} />
            </div>

            <h3 className="portal-card-title">Employee Workspace</h3>
            <p className="portal-card-desc">
              Fast-lane access for support engineers and service representatives to handle assigned queues, log resolutions, and earn performance points.
            </p>

            <ul className="portal-features-list">
              <li>
                <FiCheck className="portal-check-icon employee-check" size={16} />
                <span>Auto-routed ticket queues with SLA indicators</span>
              </li>
              <li>
                <FiCheck className="portal-check-icon employee-check" size={16} />
                <span>Gamified performance scoring & speed bonuses</span>
              </li>
              <li>
                <FiCheck className="portal-check-icon employee-check" size={16} />
                <span>Enterprise calendar & personal reminders</span>
              </li>
              <li>
                <FiCheck className="portal-check-icon employee-check" size={16} />
                <span>Departmental live team chat collaboration</span>
              </li>
            </ul>

            <div className="portal-actions-grid">
              <Link to="/login?role=employee" className="btn btn-primary portal-btn-login">
                <FiLogIn size={16} />
                <span>Employee Login</span>
              </Link>
              <Link to="/register" className="btn btn-secondary portal-btn-register">
                <FiUserPlus size={16} />
                <span>Join as Employee</span>
              </Link>
            </div>
          </motion.div>

          {/* 🛡️ ADMINISTRATOR PORTAL CARD */}
          <motion.div
            className="portal-card admin-portal-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            whileHover={{ y: -6 }}
          >
            <div className="portal-badge-pill admin-badge">
              <FiShield size={14} />
              <span>Executive & Admin Console</span>
            </div>

            <div className="portal-icon-wrapper admin-icon-glow">
              <FiCpu size={32} />
            </div>

            <h3 className="portal-card-title">Administrator Console</h3>
            <p className="portal-card-desc">
              High-privilege console for support directors, managers, and IT administrators to configure departments, monitor audit trails, and run AI reports.
            </p>

            <ul className="portal-features-list">
              <li>
                <FiCheck className="portal-check-icon admin-check" size={16} />
                <span>Executive Gemini AI performance & burnout reports</span>
              </li>
              <li>
                <FiCheck className="portal-check-icon admin-check" size={16} />
                <span>Department topology & employee roster management</span>
              </li>
              <li>
                <FiCheck className="portal-check-icon admin-check" size={16} />
                <span>Global ticket assignment policies & category trees</span>
              </li>
              <li>
                <FiCheck className="portal-check-icon admin-check" size={16} />
                <span>Pre-shared Admin Security Key verification & audit logs</span>
              </li>
            </ul>

            <div className="portal-actions-grid">
              <Link to="/login?role=admin" className="btn btn-admin portal-btn-admin-login">
                <FiLock size={16} />
                <span>Admin Login</span>
              </Link>
              <Link to="/admin-register" className="btn btn-secondary portal-btn-register">
                <FiShield size={16} />
                <span>Register Admin</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LandingPortals;
