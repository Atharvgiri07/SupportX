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
  FiAlertTriangle,
  FiShield,
  FiCheckCircle,
  FiSun,
  FiMoon,
  FiMail,
  FiArrowRight,
} from 'react-icons/fi';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [require2FA, setRequire2FA] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { user, login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  if (user) return <Navigate to="/" replace />;

  const handleKeyDown = (e) => {
    if (e.getModifierState && e.getModifierState('CapsLock')) {
      setCapsLockActive(true);
    } else {
      setCapsLockActive(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await login(email.trim().toLowerCase(), password, totpCode);
      if (res && res.require2FA) {
        setRequire2FA(true);
        toast.info('Two-Factor Authentication code required');
        return;
      }
      toast.success('Welcome back to SupportX');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
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
            Enterprise support, <br />
            <span className="auth-gradient-text">simplified.</span>
          </h1>

          <p className="auth-hero-sub">
            Manage tickets, team workflows, SLA compliance, and employee performance from one unified, high-performance workspace.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-item">
              <FiCheckCircle size={18} className="auth-check-icon" />
              <span>Smart Workload Ticket Assignment</span>
            </div>
            <div className="auth-feature-item">
              <FiCheckCircle size={18} className="auth-check-icon" />
              <span>Real-Time SLA & Priority Tracking</span>
            </div>
            <div className="auth-feature-item">
              <FiCheckCircle size={18} className="auth-check-icon" />
              <span>Gemini AI Performance Reports</span>
            </div>
            <div className="auth-feature-item">
              <FiCheckCircle size={18} className="auth-check-icon" />
              <span>Secure Role-Based Access Control</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Login Form Card */}
        <div className="auth-right-form-wrapper">
          <div className="auth-form-card card">
            <div className="auth-card-header">
              <div className="mobile-brand-row">
                <FiZap size={20} color="var(--color-primary)" />
                <span className="mobile-brand-title">SupportX</span>
              </div>
              <h2 className="auth-card-title">Welcome back</h2>
              <p className="auth-card-subtitle">Sign in to your SupportX workspace</p>
            </div>

            <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="auth-form-body">
              {!require2FA ? (
                <>
                  {/* Email Input */}
                  <div className="field">
                    <label htmlFor="email">Email Address</label>
                    <div className="input-with-icon">
                      <FiMail size={16} className="input-field-icon" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="field">
                    <div className="label-with-link">
                      <label htmlFor="password">Password</label>
                      <Link to="/forgot-password" className="auth-forgot-link">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="input-with-icon">
                      <FiLock size={16} className="input-field-icon" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
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

                    {capsLockActive && (
                      <span className="caps-lock-warning">
                        <FiAlertTriangle size={12} /> Caps Lock is ON
                      </span>
                    )}
                  </div>
                </>
              ) : (
                /* 2FA Challenge Step */
                <div className="field">
                  <label htmlFor="totpCode">
                    <FiShield size={14} color="var(--color-primary)" /> Enter 6-Digit 2FA Code
                  </label>
                  <input
                    id="totpCode"
                    type="text"
                    maxLength="6"
                    placeholder="123456"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value)}
                    autoFocus
                    required
                    className="totp-input"
                  />
                  <span className="totp-sub-text">
                    Open your Google Authenticator app or enter a backup code
                  </span>
                </div>
              )}

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
                  <span>Signing in…</span>
                ) : require2FA ? (
                  <>
                    <span>Verify 2FA Code</span>
                    <FiArrowRight size={16} />
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <FiArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-card-footer">
              <p>
                Don't have an account? <Link to="/register">Create one</Link>
              </p>
            </div>
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

export default Login;
