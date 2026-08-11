import { motion } from 'framer-motion';
import {
  FiInbox,
  FiBarChart2,
  FiClock,
  FiShield,
  FiLock,
  FiCpu,
} from 'react-icons/fi';

const CAPABILITIES = [
  { icon: FiInbox, label: 'Ticket Management' },
  { icon: FiBarChart2, label: 'Performance Analytics' },
  { icon: FiClock, label: 'SLA Tracking' },
  { icon: FiShield, label: 'Role-Based Access' },
  { icon: FiLock, label: 'Secure Authentication' },
  { icon: FiCpu, label: 'AI Insights' },
];

const LandingTrust = () => {
  return (
    <section className="landing-trust-section">
      <div className="landing-container">
        <p className="landing-trust-title">Built for modern support teams</p>
        <div className="landing-trust-grid">
          {CAPABILITIES.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={cap.label}
                className="trust-badge-card"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Icon size={18} className="trust-icon" />
                <span className="trust-label">{cap.label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LandingTrust;
