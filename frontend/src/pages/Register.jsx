import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import {
  FiZap,
  FiEye,
  FiEyeOff,
  FiLock,
  FiUser,
  FiMail,
  FiCheckCircle,
  FiSun,
  FiMoon,
  FiArrowRight,
  FiAlertTriangle,
  FiArrowLeft,
} from 'react-icons/fi';
import './Auth.css';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { user, register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  if (user) return <Navigate to="/" replace />;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register({ ...form, role: 'employee' });
      toast.success('Account created successfully');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page-root">
      {/* Theme Toggle Button in Header Corner */}
      <div className="auth-top-actions">
        <button
          onClick={toggleTheme}
          className="auth-theme-toggle-btn"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <FiMoon size={16} /> : <FiSun size={16} />}
          <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
        </button>
      </div>

      <div className="auth-main-container">
        {/* LEFT COLUMN: Enterprise Value Proposition (Desktop) */}
        <div className="auth-left-hero">
          <div className="auth-hero-brand">
            <div className="auth-logo-badge">
              <FiZap size={22} color="#ffffff" />
            </div>
            <span className="auth-logo-text">
              Support<span className="auth-logo-accent">X</span>
            </span>
          </div>

          <h1 className="auth-hero-title">
            Join SupportX, <br />
            <span className="auth-gradient-text">empower your support.</span>
          </h1>

          <p className="auth-hero-sub">
            Create your account to start managing tickets, collaborating with your team, and tracking performance metrics.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-item">
              <FiCheckCircle size={18} className="auth-check-icon" />
              <span>Smart Ticket Auto-Assignment</span>
            </div>
            <div className="auth-feature-item">
              <FiCheckCircle size={18} className="auth-check-icon" />
              <span>Priority & SLA Target Tracking</span>
            </div>
            <div className="auth-feature-item">
              <FiCheckCircle size={18} className="auth-check-icon" />
              <span>Integrated AI Performance Reports</span>
            </div>
            <div className="auth-feature-item">
              <FiCheckCircle size={18} className="auth-check-icon" />
              <span>Department & Role Access Control</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Register Form Card */}
        <div className="auth-right-form-wrapper">
          <div className="auth-form-card card">
            <div className="auth-card-header">
              <div className="mobile-brand-row">
                <FiZap size={20} color="var(--color-primary)" />
                <span className="mobile-brand-title">SupportX</span>
              </div>
              <h2 className="auth-card-title">Create an account</h2>
              <p className="auth-card-subtitle">Get started with your SupportX workspace</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form-body">
              {/* Full Name Input */}
              <div className="field">
                <label htmlFor="name">Full Name</label>
                <div className="input-with-icon">
                  <FiUser size={16} className="input-field-icon" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="field">
                <label htmlFor="email">Email Address</label>
                <div className="input-with-icon">
                  <FiMail size={16} className="input-field-icon" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="field">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon">
                  <FiLock size={16} className="input-field-icon" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error Alert Box */}
              {error && (
                <div className="auth-error-alert" role="alert">
                  <FiAlertTriangle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary btn-block auth-submit-btn"
                disabled={submitting}
              >
                {submitting ? (
                  <span>Creating account…</span>
                ) : (
                  <>
                    <span>Create account</span>
                    <FiArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-card-footer">
              <p className="auth-register-note">
                Employee accounts only. Admin accounts are created by administrators.
              </p>
              <p>
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </div>
          </div>

          {/* Back to Home Link */}
          <div className="auth-back-home">
            <Link to="/" className="auth-back-home-link">
              <FiArrowLeft size={14} />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Minimal Auth Footer */}
          <footer className="auth-minimal-footer">
            <span>© 2026 SupportX Inc. Enterprise Ticket Management</span>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Register;
