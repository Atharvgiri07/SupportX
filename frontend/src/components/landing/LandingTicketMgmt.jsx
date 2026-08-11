import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiPlusCircle,
  FiUserCheck,
  FiActivity,
  FiMessageSquare,
  FiCheckCircle,
  FiClock,
  FiArrowRight,
} from 'react-icons/fi';
import StatusBadge from '../StatusBadge';
import PriorityBadge from '../PriorityBadge';

const STAGES = [
  {
    id: 'Open',
    label: '1. OPEN',
    color: '#3b82f6',
    desc: 'Ticket submitted with priority & category. SLA countdown starts.',
  },
  {
    id: 'In Progress',
    label: '2. IN PROGRESS',
    color: '#f59e0b',
    desc: 'Assigned agent begins troubleshooting & posts update comments.',
  },
  {
    id: 'Resolved',
    label: '3. RESOLVED',
    color: '#22c55e',
    desc: 'Issue resolved! Employee earns performance points & frees workload.',
  },
  {
    id: 'Closed',
    label: '4. CLOSED',
    color: '#94a3b8',
    desc: 'Admin rates resolution quality (1-5 stars) and archives record.',
  },
];

const CAPABILITIES = [
  { icon: FiPlusCircle, title: 'Create Ticket', text: 'Admin or user specifies title, department, category, and priority level.' },
  { icon: FiUserCheck, title: 'Assign Employee', text: 'Workload-balancing algorithm auto-selects the optimal available agent.' },
  { icon: FiActivity, title: 'Track Status', text: 'Real-time state updates keep all stakeholders informed instantly.' },
  { icon: FiMessageSquare, title: 'Add Comments', text: 'Threaded conversation log for internal notes and resolution details.' },
  { icon: FiCheckCircle, title: 'Resolve Ticket', text: 'Mark as completed, log resolution timestamp, and award employee points.' },
  { icon: FiClock, title: 'Track Resolution Time', text: 'Automated calculation of exact hours spent versus target SLA window.' },
];

const LandingTicketMgmt = () => {
  const [activeStageIndex, setActiveStageIndex] = useState(1);

  return (
    <section className="landing-section bg-alt" id="ticket-management">
      <div className="landing-container">
        {/* Section Title */}
        <div className="landing-section-header text-center">
          <span className="section-eyebrow">COMPLETE TICKET LIFECYCLE</span>
          <h2 className="section-title">Every support request, under control.</h2>
          <p className="section-subtitle">
            From creation to resolution, SupportX tracks every step, conversation, and milestone with audit precision.
          </p>
        </div>

        {/* Lifecycle Stepper Bar */}
        <div className="lifecycle-container card">
          <div className="lifecycle-stepper">
            {STAGES.map((st, i) => {
              const isCurrent = i === activeStageIndex;
              const isPast = i < activeStageIndex;
              return (
                <button
                  key={st.id}
                  onClick={() => setActiveStageIndex(i)}
                  className={`lifecycle-step-btn ${isCurrent ? 'active' : ''} ${isPast ? 'past' : ''}`}
                >
                  <div
                    className="step-number-circle"
                    style={{
                      borderColor: isCurrent || isPast ? st.color : 'var(--color-border)',
                      background: isCurrent || isPast ? st.color : 'transparent',
                      color: isCurrent || isPast ? '#fff' : 'var(--color-text-muted)',
                    }}
                  >
                    {i + 1}
                  </div>
                  <div className="step-btn-info">
                    <span className="step-btn-title">{st.id}</span>
                    <span className="step-btn-sub">{st.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Ticket Demo Box */}
          <div className="lifecycle-demo-preview">
            <div className="demo-ticket-card">
              <div className="demo-ticket-header">
                <div>
                  <span className="demo-ticket-id">TICKET #SX-1049</span>
                  <h4 className="demo-ticket-title">Database Index Optimization for Billing Query</h4>
                </div>
                <div className="demo-ticket-badges">
                  <PriorityBadge priority="High" />
                  <StatusBadge status={STAGES[activeStageIndex].id} />
                </div>
              </div>

              <div className="demo-ticket-meta-grid">
                <div>
                  <span className="meta-lbl">Department</span>
                  <span className="meta-val">Database Engineering</span>
                </div>
                <div>
                  <span className="meta-lbl">Assigned Employee</span>
                  <span className="meta-val">David Miller (DevOps)</span>
                </div>
                <div>
                  <span className="meta-lbl">SLA Deadline</span>
                  <span className="meta-val text-warning">In 18 hours (High - 24h SLA)</span>
                </div>
                <div>
                  <span className="meta-lbl">Points Value</span>
                  <span className="meta-val text-success">+350 Points</span>
                </div>
              </div>

              {/* Simulated Comments Log */}
              <div className="demo-comment-box">
                <div className="comment-item">
                  <div className="comment-avatar">DM</div>
                  <div className="comment-content">
                    <div className="comment-meta">
                      <strong>David Miller</strong> • <span>10 mins ago</span>
                    </div>
                    <p className="comment-text">
                      Added composite index on `(tenant_id, created_at)`. Query duration dropped from 4.2s to 18ms.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Capabilities Grid */}
        <div className="ticket-capabilities-grid">
          {CAPABILITIES.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={cap.title}
                className="capability-item"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div className="capability-icon">
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="capability-title">{cap.title}</h4>
                  <p className="capability-text">{cap.text}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LandingTicketMgmt;
