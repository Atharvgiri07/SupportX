import { motion } from 'framer-motion';
import {
  FiPlusCircle,
  FiZap,
  FiCheckCircle,
  FiCpu,
} from 'react-icons/fi';

const STEPS = [
  {
    num: '01',
    title: 'Create Ticket',
    desc: 'Submit a support request with department, category, and priority. SLA deadlines are calculated automatically.',
    icon: FiPlusCircle,
    color: '#3b82f6',
  },
  {
    num: '02',
    title: 'Smart Auto-Assign',
    desc: 'SupportX routes the ticket to the employee with the lightest workload and best performance score.',
    icon: FiZap,
    color: '#8b5cf6',
  },
  {
    num: '03',
    title: 'Resolve & Collaborate',
    desc: 'Agents update status, post comments, and resolve tickets before SLA timers expire to earn points.',
    icon: FiCheckCircle,
    color: '#10b981',
  },
  {
    num: '04',
    title: 'Analyze & Generate AI Reports',
    desc: 'Track metrics on Admin Dashboards and run Gemini AI performance reports for continuous improvement.',
    icon: FiCpu,
    color: '#f59e0b',
  },
];

const LandingWorkflow = () => {
  return (
    <section className="landing-section" id="how-it-works">
      <div className="landing-container">
        {/* Header */}
        <div className="landing-section-header text-center">
          <span className="section-eyebrow">SIMPLE 4-STEP WORKFLOW</span>
          <h2 className="section-title">How SupportX Works</h2>
          <p className="section-subtitle">
            Engineered to streamline enterprise ticket operations from initial submission to final performance evaluation.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="workflow-grid">
          {STEPS.map((st, i) => {
            const Icon = st.icon;
            return (
              <motion.div
                key={st.num}
                className="workflow-card card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <div className="workflow-top">
                  <span className="workflow-number" style={{ color: st.color }}>{st.num}</span>
                  <div className="workflow-icon" style={{ background: `${st.color}15`, color: st.color }}>
                    <Icon size={20} />
                  </div>
                </div>
                <h3 className="workflow-title">{st.title}</h3>
                <p className="workflow-desc">{st.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LandingWorkflow;
