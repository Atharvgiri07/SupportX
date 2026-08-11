import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowRight,
  FiCheckCircle,
  FiShield,
  FiCpu,
} from 'react-icons/fi';

const LandingHero = () => {
  return (
    <section className="landing-hero-section">
      {/* Background Subtle Gradient Blobs */}
      <div className="landing-hero-bg-glow glow-1" />
      <div className="landing-hero-bg-glow glow-2" />

      <div className="landing-container">
        <div className="landing-hero-content" style={{ marginBottom: 0 }}>
          {/* Top Badge */}
          <motion.div
            className="landing-hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="hero-badge-pill">NEW</span>
            <span className="hero-badge-text">SupportX 2.0 with Gemini AI Performance Reports</span>
            <FiArrowRight size={14} />
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="landing-hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Modern Support Management, <br />
            <span className="hero-gradient-text">Built for High-Performing Teams.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="landing-hero-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            SupportX helps organizations manage tickets, automate assignment, track SLAs,
            monitor employee performance, and deliver faster resolution with AI-driven insights.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="landing-hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link to="/register" className="btn btn-primary hero-btn-main">
              <span>Get Started Free</span>
              <FiArrowRight size={16} />
            </Link>
            <a href="#features" className="btn btn-secondary hero-btn-sub">
              <span>Explore Features</span>
            </a>
          </motion.div>

          {/* Micro trust indicators */}
          <motion.div
            className="landing-hero-microtalk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span><FiCheckCircle color="#10b981" size={14} /> Instant Workload Balancing</span>
            <span><FiShield color="#3b82f6" size={14} /> Role-Based Access Control</span>
            <span><FiCpu color="#8b5cf6" size={14} /> Gemini AI Reports</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
