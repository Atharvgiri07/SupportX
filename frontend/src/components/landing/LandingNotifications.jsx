import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBell,
  FiUserCheck,
  FiCheckCircle,
  FiMessageSquare,
  FiActivity,
  FiAward,
} from 'react-icons/fi';

const INITIAL_NOTIFS = [
  {
    id: 1,
    icon: FiUserCheck,
    color: '#3b82f6',
    title: 'Ticket Assigned to You',
    msg: 'Ticket #SX-892 "VPN Connection Drop" was assigned to Alex Rivera.',
    time: 'Just now',
    unread: true,
  },
  {
    id: 2,
    icon: FiCheckCircle,
    color: '#10b981',
    title: 'Ticket Marked Resolved',
    msg: 'Sarah Chen resolved "SSO OAuth Token Refresh Failure" (+200 pts).',
    time: '12m ago',
    unread: true,
  },
  {
    id: 3,
    icon: FiMessageSquare,
    color: '#8b5cf6',
    title: 'New Internal Comment',
    msg: 'Marcus Vance replied on #SX-890: "Index patch deployed to staging."',
    time: '28m ago',
    unread: false,
  },
  {
    id: 4,
    icon: FiAward,
    color: '#eab308',
    title: 'Badge Unlocked!',
    msg: 'Alex Rivera unlocked "Speed Demon" badge for resolving 5 High tickets under 2h.',
    time: '1h ago',
    unread: false,
  },
];

const LandingNotifications = () => {
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);

  const markAllRead = () => {
    setNotifs(notifs.map((n) => ({ ...n, unread: false })));
  };

  return (
    <section className="landing-section" id="notifications">
      <div className="landing-container">
        {/* Header */}
        <div className="landing-section-header text-center">
          <span className="section-eyebrow">REAL-TIME TEAM ALERT SYSTEM</span>
          <h2 className="section-title">Never miss a critical ticket update.</h2>
          <p className="section-subtitle">
            SupportX keeps admins and employees aligned with instant notifications for assignments, status changes, new comments, and badge achievements.
          </p>
        </div>

        {/* Notification Mockup UI */}
        <div className="notif-demo-wrapper">
          <div className="notif-card card">
            {/* Header */}
            <div className="notif-header">
              <div className="notif-title-group">
                <div className="bell-badge-container">
                  <FiBell size={20} className="bell-icon" />
                  {notifs.filter((n) => n.unread).length > 0 && (
                    <span className="unread-dot-badge">
                      {notifs.filter((n) => n.unread).length}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="notif-panel-title">Notifications Center</h4>
                  <span className="notif-panel-sub">Real-time socket event stream</span>
                </div>
              </div>
              <button onClick={markAllRead} className="mark-read-btn">
                Mark all as read
              </button>
            </div>

            {/* Notification Stream */}
            <div className="notif-stream">
              <AnimatePresence>
                {notifs.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.id}
                      className={`notif-item ${item.unread ? 'unread-item' : ''}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="notif-icon-box" style={{ background: `${item.color}15`, color: item.color }}>
                        <Icon size={16} />
                      </div>
                      <div className="notif-content-box">
                        <div className="notif-top">
                          <span className="notif-item-title">{item.title}</span>
                          <span className="notif-item-time">{item.time}</span>
                        </div>
                        <p className="notif-item-msg">{item.msg}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingNotifications;
