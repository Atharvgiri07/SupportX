import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiHelpCircle } from 'react-icons/fi';

const FAQS = [
  {
    q: 'What is SupportX?',
    a: 'SupportX is an Enterprise Help Desk and Ticket Management System built on the MERN stack. It automates ticket assignment, enforces SLA deadlines, tracks employee performance with points and leaderboards, and generates AI performance reports powered by Google Gemini.',
  },
  {
    q: 'How does automatic ticket assignment work?',
    a: 'SupportX automatically routes incoming tickets to the active employee in the designated department who currently has the lightest open ticket workload. If multiple employees have equal workloads, the system selects the agent with the highest performance score.',
  },
  {
    q: 'What is SLA tracking?',
    a: 'Every ticket created in SupportX is assigned a SLA resolution countdown window based on its priority (Critical: 4 hours, High: 24 hours, Medium: 48 hours, Low: 72 hours). If a ticket approaches or breaches its SLA window, red alert badges highlight it on the Admin Dashboard.',
  },
  {
    q: 'Can administrators monitor employee performance?',
    a: 'Yes. Admins have access to real-time analytics, monthly resolution velocity charts, department workload breakdowns, live employee leaderboards, and one-click Gemini AI performance report generation.',
  },
  {
    q: 'Can employees track their tickets?',
    a: 'Yes. Support employees have a dedicated workspace showing tickets assigned specifically to them, priority badges, SLA countdowns, threaded comment sections, earned performance points, and achievement badges.',
  },
  {
    q: 'Does SupportX support role-based access?',
    a: 'Yes. SupportX enforces strict Role-Based Access Control (RBAC). Admin users have complete administrative rights (creating departments, managing categories, viewing all tickets, running AI reports), while Employee users are focused on resolving their assigned tickets.',
  },
  {
    q: 'Does SupportX provide AI performance reports?',
    a: 'Yes. SupportX integrates directly with the Google Gemini API to analyze raw ticket completion history, average resolution times, and customer ratings to produce structured performance summaries, key strengths, growth areas, and rating scorecards.',
  },
  {
    q: 'How does authentication work?',
    a: 'SupportX uses secure JWT (JSON Web Token) authentication with password hashing using bcrypt. Sessions persist securely and route users directly to their appropriate dashboard upon login.',
  },
];

const LandingFAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="landing-section" id="faq">
      <div className="landing-container">
        {/* Header */}
        <div className="landing-section-header text-center">
          <span className="section-eyebrow">FREQUENTLY ASKED QUESTIONS</span>
          <h2 className="section-title">Everything You Need to Know About SupportX</h2>
          <p className="section-subtitle">
            Find answers to common questions about architecture, automatic ticket routing, SLA tracking, and Gemini AI reports.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="faq-accordion-container">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.q} className={`faq-item card ${isOpen ? 'open' : ''}`}>
                <button
                  onClick={() => toggleFAQ(index)}
                  className="faq-question-btn"
                  aria-expanded={isOpen}
                >
                  <span className="faq-q-text">
                    <FiHelpCircle className="q-icon" size={16} />
                    {faq.q}
                  </span>
                  <FiChevronDown
                    className={`faq-chevron ${isOpen ? 'rotate' : ''}`}
                    size={18}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      className="faq-answer-wrapper"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <p className="faq-answer-text">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LandingFAQ;
