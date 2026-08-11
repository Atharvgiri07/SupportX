import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiCpu,
  FiUser,
  FiArrowRight,
  FiCheckCircle,
  FiTrendingUp,
  FiStar,
  FiZap,
} from 'react-icons/fi';

const SAMPLE_AI_REPORT = {
  employee: 'Sarah Chen',
  dept: 'DevOps & Systems',
  ticketsResolved: 142,
  avgTime: '1.4 hours',
  score: 982,
  summary:
    'Sarah Chen demonstrates exceptional performance in DevOps ticket resolution, maintaining an average resolution time of 1.4 hours, well within the 4-hour SLA target. Her ticket throughput is in the top 5% across the organization.',
  strengths: [
    'Consistently resolves Critical infrastructure tickets ahead of SLA window',
    'Provides exceptionally clear technical comment documentation for team reference',
    'Maintains high customer resolution rating (4.9 / 5.0 stars)',
  ],
  improvements: [
    'Can assist junior team members through peer review on non-urgent tickets',
    'Explore automating repetitive SSL cert updates',
  ],
  rating: 'EXCELLENT (98 / 100)',
};

const LandingAIReport = () => {
  const [activeTab, setActiveTab] = useState('summary');

  return (
    <section className="landing-section bg-alt" id="ai-performance">
      <div className="landing-container">
        {/* Header */}
        <div className="landing-section-header text-center">
          <span className="section-eyebrow">GEMINI AI INTEGRATION</span>
          <h2 className="section-title">Turn employee activity into actionable performance insights.</h2>
          <p className="section-subtitle">
            SupportX leverages Google Gemini AI to analyze raw resolution data, calculating objective performance ratings, strengths, and targeted growth areas for every agent.
          </p>
        </div>

        {/* AI Pipeline Flow Diagram */}
        <div className="ai-pipeline-flow">
          <div className="pipeline-step">
            <div className="pipeline-icon-box">
              <FiUser size={20} />
            </div>
            <div className="pipeline-text">
              <strong>Employee Data</strong>
              <span>Ticket history & SLA speed</span>
            </div>
          </div>

          <FiArrowRight className="pipeline-arrow" size={20} />

          <div className="pipeline-step active-gemini-step">
            <div className="pipeline-icon-box gemini-box">
              <FiCpu size={22} className="gemini-spin" />
            </div>
            <div className="pipeline-text">
              <strong>SupportX AI Engine</strong>
              <span>Powered by Gemini API</span>
            </div>
          </div>

          <FiArrowRight className="pipeline-arrow" size={20} />

          <div className="pipeline-step">
            <div className="pipeline-icon-box success-box">
              <FiCheckCircle size={20} />
            </div>
            <div className="pipeline-text">
              <strong>Performance Report</strong>
              <span>Summary, strengths & rating</span>
            </div>
          </div>
        </div>

        {/* AI Report Card Sample */}
        <div className="ai-report-preview-container card">
          <div className="report-header">
            <div className="report-emp-info">
              <div className="emp-avatar-lg">SC</div>
              <div>
                <h4 className="report-emp-name">AI Performance Analysis: {SAMPLE_AI_REPORT.employee}</h4>
                <span className="report-emp-sub">{SAMPLE_AI_REPORT.dept} • {SAMPLE_AI_REPORT.ticketsResolved} Resolved • {SAMPLE_AI_REPORT.score} Points</span>
              </div>
            </div>
            <div className="report-rating-tag">
              <FiStar color="#eab308" size={16} />
              <span>{SAMPLE_AI_REPORT.rating}</span>
            </div>
          </div>

          <div className="report-body">
            {/* Summary Section */}
            <div className="report-section-block">
              <h5 className="block-title">
                <FiZap color="var(--color-primary)" size={15} /> Performance Summary
              </h5>
              <p className="block-text">{SAMPLE_AI_REPORT.summary}</p>
            </div>

            {/* Grid for Strengths and Growth Areas */}
            <div className="report-points-grid">
              <div className="points-column strengths-col">
                <h5 className="block-title text-success">
                  <FiCheckCircle size={15} /> Key Strengths
                </h5>
                <ul>
                  {SAMPLE_AI_REPORT.strengths.map((str, i) => (
                    <li key={i}>{str}</li>
                  ))}
                </ul>
              </div>

              <div className="points-column improvements-col">
                <h5 className="block-title text-warning">
                  <FiTrendingUp size={15} /> Growth Recommendations
                </h5>
                <ul>
                  {SAMPLE_AI_REPORT.improvements.map((imp, i) => (
                    <li key={i}>{imp}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingAIReport;
