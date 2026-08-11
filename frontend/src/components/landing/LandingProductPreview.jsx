import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid,
  FiInbox,
  FiUserCheck,
  FiAward,
  FiCpu,
  FiShield,
} from 'react-icons/fi';
import StatusBadge from '../StatusBadge';
import PriorityBadge from '../PriorityBadge';

const PREVIEW_TABS = [
  { id: 'admin-dash', name: 'Admin Dashboard', icon: FiGrid },
  { id: 'ticket-desk', name: 'Ticket Management', icon: FiInbox },
  { id: 'employee-portal', name: 'Employee Workspace', icon: FiUserCheck },
  { id: 'leaderboard', name: 'Leaderboard & Badges', icon: FiAward },
  { id: 'ai-reports', name: 'AI Reports', icon: FiCpu },
];

const LandingProductPreview = () => {
  const [activeTab, setActiveTab] = useState('admin-dash');

  return (
    <section className="landing-section bg-alt" id="product-preview">
      <div className="landing-container">
        {/* Header */}
        <div className="landing-section-header text-center">
          <span className="section-eyebrow">PRODUCT PREVIEW</span>
          <h2 className="section-title">Designed for clarity, built for speed.</h2>
          <p className="section-subtitle">
            Explore the user interfaces designed for Admins and Support Employees.
          </p>
        </div>

        {/* Tab Selection Row */}
        <div className="preview-tabs-row">
          {PREVIEW_TABS.map((tb) => {
            const Icon = tb.icon;
            const isSelected = activeTab === tb.id;
            return (
              <button
                key={tb.id}
                onClick={() => setActiveTab(tb.id)}
                className={`preview-tab-btn ${isSelected ? 'active' : ''}`}
              >
                <Icon size={16} />
                <span>{tb.name}</span>
              </button>
            );
          })}
        </div>

        {/* Browser Frame Preview Window */}
        <div className="product-preview-frame card">
          <div className="frame-header">
            <div className="frame-dots">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
            <div className="frame-address">
              <FiShield size={12} className="shield-icon" />
              <span>supportx.app/preview/{activeTab}</span>
            </div>
            <span className="frame-status-pill">STATIC PREVIEW</span>
          </div>

          <div className="frame-body">
            <AnimatePresence mode="wait">
              {activeTab === 'admin-dash' && (
                <motion.div
                  key="admin-dash"
                  className="preview-tab-content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="tab-view-header">
                    <h3>Admin Analytics Overview</h3>
                    <p>Live metrics across all departments and employee assignments</p>
                  </div>
                  <div className="mock-grid-3">
                    <div className="mock-stat-box">
                      <span>Total Tickets</span>
                      <h2>Active Queue</h2>
                      <small className="text-success">Tracked in real time</small>
                    </div>
                    <div className="mock-stat-box">
                      <span>Unassigned Queue</span>
                      <h2 className="text-warning">Auto-Routed</h2>
                      <small className="text-success">Workload balanced</small>
                    </div>
                    <div className="mock-stat-box">
                      <span>SLA Compliance</span>
                      <h2 className="text-success">Target Windows</h2>
                      <small className="text-muted">Monitored due dates</small>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'ticket-desk' && (
                <motion.div
                  key="ticket-desk"
                  className="preview-tab-content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="tab-view-header">
                    <h3>Ticket Desk — All Tickets</h3>
                    <p>Manage, filter, and track status across all active support tickets</p>
                  </div>
                  <div className="mock-table">
                    <div className="table-row row-head">
                      <span>ID</span>
                      <span>Title</span>
                      <span>Category</span>
                      <span>Priority</span>
                      <span>Status</span>
                      <span>Assignee</span>
                    </div>
                    <div className="table-row">
                      <span>#SX-104</span>
                      <span className="row-title">Exchange Server SSL Cert</span>
                      <span>DevOps</span>
                      <PriorityBadge priority="High" />
                      <StatusBadge status="In Progress" />
                      <span>David Miller</span>
                    </div>
                    <div className="table-row">
                      <span>#SX-103</span>
                      <span className="row-title">SSO Login Token Expired</span>
                      <span>Security</span>
                      <PriorityBadge priority="Critical" />
                      <StatusBadge status="Resolved" />
                      <span>Sarah Chen</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'employee-portal' && (
                <motion.div
                  key="employee-portal"
                  className="preview-tab-content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="tab-view-header">
                    <h3>Employee Workspace — My Assigned Tickets</h3>
                    <p>Focus on your active workload and track SLA countdowns</p>
                  </div>
                  <div className="mock-card-list">
                    <div className="mock-ticket-item">
                      <div className="item-header">
                        <h4>VPN Gateway Routing Dropping Packets</h4>
                        <PriorityBadge priority="Critical" />
                      </div>
                      <p className="item-desc">Users in European region experiencing intermittent timeouts.</p>
                      <div className="item-footer">
                        <span>SLA: Active Due Window</span>
                        <StatusBadge status="In Progress" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'leaderboard' && (
                <motion.div
                  key="leaderboard"
                  className="preview-tab-content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="tab-view-header">
                    <h3>Support Leaderboard & Gamification</h3>
                    <p>Top employee rankings based on resolution speed and points</p>
                  </div>
                  <div className="mock-ranks">
                    <div className="rank-row first-rank">
                      <span className="rank-num">#1</span>
                      <span className="rank-name">Sarah Chen</span>
                      <span className="rank-pts">Top Performer</span>
                    </div>
                    <div className="rank-row">
                      <span className="rank-num">#2</span>
                      <span className="rank-name">Alex Rivera</span>
                      <span className="rank-pts">High Resolution</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'ai-reports' && (
                <motion.div
                  key="ai-reports"
                  className="preview-tab-content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="tab-view-header">
                    <h3>Gemini AI Performance Generator</h3>
                    <p>AI-synthesized evaluations for employee performance reviews</p>
                  </div>
                  <div className="mock-ai-box">
                    <strong>Sample Performance Evaluation:</strong>
                    <p>"Employee maintains high SLA resolution efficiency across assigned tickets, demonstrating strong technical execution in IT Infrastructure."</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingProductPreview;
