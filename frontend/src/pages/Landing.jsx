import { Link } from 'react-router-dom';
import { FiZap, FiUsers, FiCpu, FiAward, FiMail, FiGithub, FiHeart, FiShield, FiBarChart2 } from 'react-icons/fi';
import './Landing.css';

const FEATURES = [
  {
    icon: FiZap,
    title: 'Smart Auto-Assign',
    desc: 'Every ticket routes automatically to whoever on the team has the lightest workload.',
  },
  {
    icon: FiCpu,
    title: 'AI Performance Reports',
    desc: 'Gemini-powered summaries turn raw ticket data into real feedback for every employee.',
  },
  {
    icon: FiUsers,
    title: 'Department Management',
    desc: 'Organize your team by department and track workload at a glance.',
  },
  {
    icon: FiAward,
    title: 'Performance Leaderboard',
    desc: 'Points for every resolution, ranked live, so good work never goes unnoticed.',
  },
];

const Landing = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="landing">
      <section className="landing-hero">
        <div className="landing-hero-inner">
          <div className="landing-brand">
            <FiZap size={22} />
            SupportX
          </div>
          <h1 className="landing-headline">Manage Smarter. Resolve Faster.</h1>
          <p className="landing-subhead">
            SupportX is a smart ticket management system that auto-assigns work, tracks
            performance, and generates AI-powered reports — so your team always knows what
            matters most.
          </p>
          <div className="landing-cta">
            <Link to="/login" className="btn btn-primary">
              Log In
            </Link>
            <Link to="/register" className="btn landing-btn-secondary">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      <section className="landing-features">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card landing-feature-card">
            <div className="landing-feature-icon">
              <Icon size={20} />
            </div>
            <h3 style={{ fontSize: 16, marginBottom: 6 }}>{title}</h3>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-grid">
            {/* Brand Column */}
            <div className="landing-footer-brand-col">
              <div className="landing-footer-logo">
                <FiZap size={18} />
                <span>SupportX</span>
              </div>
              <p className="landing-footer-desc">
                AI-powered smart ticket management system built with the MERN stack.
                Streamline support, track performance, and empower your team.
              </p>
            </div>

            {/* Features Column */}
            <div className="landing-footer-col">
              <h4 className="landing-footer-heading">Features</h4>
              <ul className="landing-footer-links">
                <li><FiZap size={13} /> Smart Auto-Assign</li>
                <li><FiCpu size={13} /> AI Reports (Gemini)</li>
                <li><FiBarChart2 size={13} /> Performance Tracking</li>
                <li><FiAward size={13} /> Gamification & Badges</li>
                <li><FiShield size={13} /> Role-Based Access</li>
              </ul>
            </div>

            {/* Quick Links Column */}
            <div className="landing-footer-col">
              <h4 className="landing-footer-heading">Quick Links</h4>
              <ul className="landing-footer-links">
                <li><Link to="/login">Sign In</Link></li>
                <li><Link to="/register">Create Account</Link></li>
              </ul>
            </div>

            {/* Contact Column */}
            <div className="landing-footer-col">
              <h4 className="landing-footer-heading">Contact</h4>
              <ul className="landing-footer-links">
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
            <p>© {currentYear} SupportX. All rights reserved.</p>
            <p className="landing-footer-made">
              Made with <FiHeart size={12} className="landing-footer-heart" /> by Atharv Giri
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

