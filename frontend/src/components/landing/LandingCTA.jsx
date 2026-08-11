import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiZap, FiShield } from 'react-icons/fi';

const LandingCTA = () => {
  return (
    <section className="landing-cta-section">
      <div className="landing-container">
        <motion.div
          className="landing-cta-box"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="cta-bg-glow" />

          <div className="cta-content text-center">
            <div className="cta-brand-badge">
              <FiZap size={16} color="#60a5fa" />
              <span>SUPPORTX ENTERPRISE</span>
            </div>

            <h2 className="cta-headline">Build a faster, smarter support operation.</h2>
            <p className="cta-subhead">
              Bring tickets, teams, performance and support operations into one powerful workspace.
            </p>

            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary cta-btn-main">
                <span>Get Started Free</span>
                <FiArrowRight size={16} />
              </Link>
              <Link to="/login" className="btn btn-secondary cta-btn-sub">
                <span>Sign In to SupportX</span>
              </Link>
            </div>

            <div className="cta-security-note">
              <FiShield size={14} color="#10b981" />
              <span>Production-ready MERN Stack architecture with JWT authentication & Gemini AI</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingCTA;
