import { Link } from 'react-router-dom';
import {
  FiZap,
  FiMail,
  FiGithub,
  FiHeart,
  FiCheckCircle,
  FiShield,
  FiCpu,
  FiAward,
  FiHelpCircle,
  FiGrid,
  FiInbox,
  FiLayers,
} from 'react-icons/fi';

const LandingFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="landing-footer" id="footer-capabilities">
      <div className="landing-container">
        <div className="landing-footer-grid">
          {/* Brand Column */}
          <div className="landing-footer-brand-col">
            <Link to="/" className="landing-footer-logo">
              <div className="landing-logo-badge" style={{ width: 32, height: 32 }}>
                <FiZap size={18} color="#ffffff" />
              </div>
              <span className="landing-logo-text" style={{ fontSize: 18, color: '#ffffff' }}>
                Support<span className="landing-logo-accent" style={{ color: 'var(--color-primary)' }}>X</span>
              </span>
            </Link>
            <p className="landing-footer-desc">
              Enterprise Help Desk & Ticket Management System built on MERN.
              Automating workload routing, SLA tracking, employee gamification, and Gemini AI performance evaluations.
            </p>
          </div>

          {/* Portals & Workspaces */}
          <div className="landing-footer-col">
            <h4 className="landing-footer-heading">Portals & Workspaces</h4>
            <ul className="landing-footer-links">
              <li><Link to="/login?role=employee"><FiLayers size={13} /> Employee Portal Login</Link></li>
              <li><Link to="/register"><FiCheckCircle size={13} /> Employee Registration</Link></li>
              <li><Link to="/login?role=admin"><FiShield size={13} /> Administrator Console</Link></li>
              <li><Link to="/admin-register"><FiGrid size={13} /> Admin Provisioning</Link></li>
            </ul>
          </div>

          {/* Platform Security & Intelligence */}
          <div className="landing-footer-col">
            <h4 className="landing-footer-heading">Platform Highlights</h4>
            <ul className="landing-footer-links">
              <li><span className="footer-feature-item"><FiCpu size={13} /> Automated Workload Routing</span></li>
              <li><span className="footer-feature-item"><FiShield size={13} /> SLA Overdue Management</span></li>
              <li><span className="footer-feature-item"><FiAward size={13} /> Gamified Performance Scoring</span></li>
              <li><span className="footer-feature-item"><FiLayers size={13} /> Enterprise Multi-View Calendar</span></li>
            </ul>
          </div>


          {/* Quick Access & Contact */}
          <div className="landing-footer-col">
            <h4 className="landing-footer-heading">Workspace & Contact</h4>
            <ul className="landing-footer-links">
              <li><Link to="/login">Sign In to Workspace</Link></li>
              <li><Link to="/register">Create Employee Account</Link></li>
              <li>
                <FiMail size={13} />
                <a href="mailto:atharvgiri07@gmail.com">atharvgiri07@gmail.com</a>
              </li>
              <li>
                <FiGithub size={13} />
                <a href="https://github.com/Atharvgiri07/SupportX" target="_blank" rel="noopener noreferrer">
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="landing-footer-divider" />

        <div className="landing-footer-bottom">
          <p>© {currentYear} SupportX Inc. All rights reserved.</p>
          <p className="landing-footer-made">
            Made with <FiHeart size={12} className="landing-footer-heart" /> by Atharv Giri
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
