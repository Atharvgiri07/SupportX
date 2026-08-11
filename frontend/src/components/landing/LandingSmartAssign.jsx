import { motion } from 'framer-motion';
import {
  FiZap,
  FiUserCheck,
  FiLayers,
  FiArrowRight,
  FiAward,
  FiCheckCircle,
} from 'react-icons/fi';

const EMPLOYEES = [
  {
    name: 'Employee A',
    role: 'IT Specialist',
    openTickets: 2,
    score: 840,
    isWinner: true,
    avatar: 'EA',
  },
  {
    name: 'Employee B',
    role: 'System Administrator',
    openTickets: 5,
    score: 720,
    isWinner: false,
    avatar: 'EB',
  },
  {
    name: 'Employee C',
    role: 'Help Desk Lead',
    openTickets: 3,
    score: 910,
    isWinner: false,
    avatar: 'EC',
  },
];

const LandingSmartAssign = () => {
  return (
    <section className="landing-section" id="smart-assignment">
      <div className="landing-container">
        {/* Header */}
        <div className="landing-section-header text-center">
          <span className="section-eyebrow">AUTOMATED WORKLOAD BALANCING</span>
          <h2 className="section-title">Put every ticket in the right hands.</h2>
          <p className="section-subtitle">
            SupportX automatically routes new tickets to the available employee with the lightest current workload.
            If ticket counts tie, the agent with the higher performance score receives priority.
          </p>
        </div>

        {/* Visual Workload Routing Demo */}
        <div className="smart-assign-demo card">
          <div className="assign-flow-grid">
            {/* Step 1: Incoming Ticket */}
            <motion.div
              className="flow-box new-ticket-box"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="box-badge">NEW TICKET</div>
              <h4 className="ticket-title-preview">"Exchange Server SSL Certificate Renewal"</h4>
              <div className="ticket-meta-pills">
                <span className="meta-pill priority-high">High Priority</span>
                <span className="meta-pill dept-it">IT Ops</span>
              </div>
            </motion.div>

            {/* Step 2: Smart Algorithm Engine */}
            <motion.div
              className="flow-arrow-box"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="algo-node">
                <FiZap size={22} className="zap-anim" />
                <span>Smart Auto-Assign</span>
                <small>Least Workload Rule</small>
              </div>
              <FiArrowRight size={24} className="arrow-pulse" />
            </motion.div>

            {/* Step 3: Candidate Employees Comparison */}
            <div className="flow-box employees-list-box">
              <h4 className="box-section-title">Department Workload Comparison</h4>
              <div className="candidate-cards">
                {EMPLOYEES.map((emp) => (
                  <motion.div
                    key={emp.name}
                    className={`candidate-card ${emp.isWinner ? 'winner-card' : ''}`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="candidate-left">
                      <div className="candidate-avatar">{emp.avatar}</div>
                      <div>
                        <div className="candidate-name">{emp.name}</div>
                        <div className="candidate-role">{emp.role}</div>
                      </div>
                    </div>

                    <div className="candidate-right">
                      <div className="candidate-workload">
                        <span className="workload-count">{emp.openTickets}</span>
                        <span className="workload-lbl">Open Tickets</span>
                      </div>
                      <div className="candidate-score">
                        <span className="score-val">{emp.score} pts</span>
                      </div>
                      {emp.isWinner ? (
                        <div className="winner-badge">
                          <FiCheckCircle size={14} />
                          <span>AUTO-ASSIGNED</span>
                        </div>
                      ) : (
                        <div className="busy-badge">Busy</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="assign-note-banner">
            <FiLayers size={18} color="var(--color-primary)" />
            <span>
              <strong>Zero manual dispatch needed:</strong> As soon as Employee A resolves a ticket, their workload decreases,
              keeping team capacity perfectly balanced without manager intervention.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingSmartAssign;
