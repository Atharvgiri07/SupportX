import { motion } from 'framer-motion';
import {
  FiClock,
  FiAlertTriangle,
  FiCheckCircle,
  FiShield,
  FiTrendingUp,
} from 'react-icons/fi';

const SLA_LEVELS = [
  { priority: 'Critical', hours: '4 Hours', bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' },
  { priority: 'High', hours: '24 Hours', bg: 'rgba(249, 115, 22, 0.15)', color: '#f97316' },
  { priority: 'Medium', hours: '48 Hours', bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' },
  { priority: 'Low', hours: '72 Hours', bg: 'rgba(148, 163, 184, 0.18)', color: '#94a3b8' },
];

const LandingSLA = () => {
  return (
    <section className="landing-section bg-alt" id="sla-tracking">
      <div className="landing-container">
        {/* Header */}
        <div className="landing-section-header text-center">
          <span className="section-eyebrow">GUARANTEED RESPONSE & RESOLUTION</span>
          <h2 className="section-title">Stay ahead of deadlines before they breach.</h2>
          <p className="section-subtitle">
            Stay ahead of deadlines and identify overdue support requests before they become operational problems.
          </p>
        </div>

        {/* SLA Interactive Timeline Showcase */}
        <div className="sla-showcase-grid">
          {/* Left Column: Timeline Graphic */}
          <div className="sla-timeline-card card">
            <div className="sla-card-header">
              <div className="sla-header-left">
                <FiClock size={20} color="var(--color-primary)" />
                <div>
                  <h4 className="sla-card-title">SLA Compliance Countdown</h4>
                  <span className="sla-card-sub">Automatic calculation based on ticket priority</span>
                </div>
              </div>
              <span className="sla-live-pill">LIVE MONITOR</span>
            </div>

            {/* Visual Timeline Bar */}
            <div className="sla-timeline-visual">
              <div className="sla-track">
                <div className="sla-progress-fill" style={{ width: '75%' }} />
                <div className="sla-node node-start">
                  <div className="node-dot" />
                  <span>Ticket Created</span>
                  <small>00:00</small>
                </div>
                <div className="sla-node node-mid">
                  <div className="node-dot" />
                  <span>In Progress</span>
                  <small>+1h 15m</small>
                </div>
                <div className="sla-node node-target">
                  <div className="node-dot target-dot" />
                  <span>Target Resolution</span>
                  <small className="text-success">Within 4h</small>
                </div>
              </div>
            </div>

            {/* SLA Status Cards */}
            <div className="sla-status-row">
              <div className="sla-status-item success-box">
                <FiCheckCircle size={20} color="#10b981" />
                <div>
                  <span className="status-label">On-Track SLA</span>
                  <p className="status-desc">98.7% tickets resolved within window</p>
                </div>
              </div>
              <div className="sla-status-item danger-box">
                <FiAlertTriangle size={20} color="#ef4444" />
                <div>
                  <span className="status-label">Overdue Alerts</span>
                  <p className="status-desc">Instant notification on breach risk</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Priority SLA Rules */}
          <div className="sla-rules-card card">
            <h4 className="rules-card-title">Priority SLA Windows</h4>
            <p className="rules-card-desc">
              SupportX assigns strict target resolution times the moment a ticket is submitted:
            </p>
            <div className="sla-levels-list">
              {SLA_LEVELS.map((lvl) => (
                <div key={lvl.priority} className="sla-level-row">
                  <div className="level-left">
                    <span
                      className="priority-tag"
                      style={{ background: lvl.bg, color: lvl.color }}
                    >
                      {lvl.priority}
                    </span>
                  </div>
                  <div className="level-right">
                    <FiClock size={14} color={lvl.color} />
                    <span className="level-hours" style={{ color: lvl.color }}>{lvl.hours} max</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="sla-guarantee-box">
              <FiShield size={18} color="#f59e0b" />
              <p>
                Overdue tickets escalate automatically on the Admin Dashboard with red indicator badges to ensure rapid resolution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingSLA;
