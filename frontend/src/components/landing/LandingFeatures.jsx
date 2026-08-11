import { motion } from 'framer-motion';
import {
  FiInbox,
  FiZap,
  FiClock,
  FiFolder,
  FiAward,
  FiTrendingUp,
  FiPieChart,
  FiBell,
  FiShield,
  FiCpu,
  FiSearch,
  FiSun,
} from 'react-icons/fi';

const FEATURES = [
  {
    icon: FiInbox,
    title: 'Ticket Management',
    desc: 'Create, update, comment, and resolve support requests with complete lifecycle tracking and history.',
    badge: 'Core',
  },
  {
    icon: FiZap,
    title: 'Smart Ticket Assignment',
    desc: 'Automatically routes incoming tickets to the employee with the lightest workload and highest rating.',
    badge: 'Automated',
  },
  {
    icon: FiClock,
    title: 'SLA & Overdue Tracking',
    desc: 'Automatic SLA timers calculated by priority (Critical 4h, High 24h, Medium 48h) prevent resolution breaches.',
    badge: 'Real-time',
  },
  {
    icon: FiFolder,
    title: 'Department Management',
    desc: 'Group employees into specialized departments and categorize tickets for focused resolution workflows.',
    badge: 'Structure',
  },
  {
    icon: FiAward,
    title: 'Employee Performance',
    desc: 'Gamified scoring system awards points for every resolution, tracking speed and customer satisfaction.',
    badge: 'Gamified',
  },
  {
    icon: FiTrendingUp,
    title: 'Leaderboard & Badges',
    desc: 'Live employee rankings, monthly resolution trends, and achievement badges keep support agents motivated.',
    badge: 'Live',
  },
  {
    icon: FiPieChart,
    title: 'Admin Analytics',
    desc: 'Comprehensive visual graphs displaying ticket status, priority breakdown, and department workloads.',
    badge: 'Visual',
  },
  {
    icon: FiBell,
    title: 'Instant Notifications',
    desc: 'Stay informed with unread counter badges and real-time alerts when tickets are assigned or updated.',
    badge: 'Alerts',
  },
  {
    icon: FiShield,
    title: 'Role-Based Access Control',
    desc: 'Strict separation between Admin administrative controls and Employee resolution workspace.',
    badge: 'Security',
  },
  {
    icon: FiCpu,
    title: 'AI Performance Reports',
    desc: 'Gemini AI evaluates employee ticket metrics to generate actionable performance summaries and ratings.',
    badge: 'Gemini AI',
  },
  {
    icon: FiSearch,
    title: 'Search & Filtering',
    desc: 'Filter tickets by priority, status, department, category, or search instantly by title and keywords.',
    badge: 'Fast',
  },
  {
    icon: FiSun,
    title: 'Dark / Light Mode',
    desc: 'Seamless theme switcher built with CSS design tokens that remembers your viewing preference.',
    badge: 'Adaptive',
  },
];

const LandingFeatures = () => {
  return (
    <section className="landing-section" id="features">
      <div className="landing-container">
        {/* Section Header */}
        <div className="landing-section-header text-center">
          <span className="section-eyebrow">ENTERPRISE CAPABILITIES</span>
          <h2 className="section-title">Everything You Need to Run a Modern Help Desk</h2>
          <p className="section-subtitle">
            Engineered with deep features that empower admins, accelerate employee workflows,
            and keep resolution quality high.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="features-grid">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                className="feature-card card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <div className="feature-card-header">
                  <div className="feature-icon-box">
                    <Icon size={20} />
                  </div>
                  <span className="feature-tag">{feat.badge}</span>
                </div>
                <h3 className="feature-title">{feat.title}</h3>
                <p className="feature-desc">{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;
