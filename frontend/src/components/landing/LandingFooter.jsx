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

          {/* Core Capabilities */}
          <div className="landing-footer-col">
            <h4 className="landing-footer-heading">Enterprise Capabilities</h4>
            <ul className="landing-footer-links">
              <li><span className="footer-feature-item"><FiLayers size={13} /> Complete Ticket Lifecycle</span></li>
              <li><span className="footer-feature-item"><FiCpu size={13} /> Automated Workload Balancing</span></li>
              <li><span className="footer-feature-item"><FiShield size={13} /> Response & SLA Resolution</span></li>
              <li><span className="footer-feature-item"><FiGrid size={13} /> Administrative Dashboard</span></li>
              <li><span className="footer-feature-item"><FiAward size={13} /> Gamified Workforce Motivation</span></li>
            </ul>
          </div>

          {/* System Modules & Workflow */}
          <div className="landing-footer-col">
            <h4 className="landing-footer-heading">System Modules & Workflow</h4>
            <ul className="landing-footer-links">
              <li><span className="footer-feature-item"><FiInbox size={13} /> Real-Time Team Alert System</span></li>
              <li><span className="footer-feature-item"><FiCpu size={13} /> Gemini AI Integration</span></li>
              <li><span className="footer-feature-item"><FiCheckCircle size={13} /> Simple 4-Step Support Workflow</span></li>
              <li><span className="footer-feature-item"><FiGrid size={13} /> Product Preview</span></li>
              <li><span className="footer-feature-item"><FiHelpCircle size={13} /> Frequently Asked Questions</span></li>
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
