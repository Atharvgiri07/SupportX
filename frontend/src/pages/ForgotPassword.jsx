import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { FiMail, FiArrowLeft, FiShield, FiCheckCircle, FiSun, FiMoon } from 'react-icons/fi';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [demoToken, setDemoToken] = useState('');

  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
      if (data.resetToken) {
        setDemoToken(data.resetToken);
      }
      toast.success('Password reset instructions generated');
    } catch (err) {
      toast.error('Could not process reset request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-root">
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

      <div className="auth-main-container" style={{ gridTemplateColumns: '1fr', maxWidth: '440px' }}>
        <div className="auth-right-form-wrapper">
          <div className="auth-form-card card">
            <div className="auth-card-header text-center">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                <div className="auth-logo-badge">
                  <FiShield size={22} color="#ffffff" />
                </div>
              </div>
              <h2 className="auth-card-title">Reset Your Password</h2>
              <p className="auth-card-subtitle">
                Enter your registered email address to receive password recovery instructions.
              </p>
            </div>

            {submitted ? (
              <div className="auth-form-body" style={{ textAlign: 'center' }}>
                <FiCheckCircle size={42} color="#10b981" style={{ margin: '0 auto 12px' }} />
                <h4>Check Your Recovery Token</h4>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: 16 }}>
                  If an account exists with <strong>{email}</strong>, a 15-minute reset token has been issued.
                </p>

                {demoToken && (
                  <div style={{ background: 'var(--color-bg)', padding: 14, borderRadius: 10, marginBottom: 16, border: '1px solid var(--color-border)' }}>
                    <span style={{ fontSize: 11, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>
                      Recovery Reset Token Link:
                    </span>
                    <Link
                      to={`/reset-password?token=${demoToken}`}
                      style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--color-primary)', fontWeight: 700, wordBreak: 'break-all' }}
                    >
                      Click Here to Set New Password
                    </Link>
                  </div>
                )}

                <Link to="/login" className="btn btn-secondary btn-block">
                  Back to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="auth-form-body">
                <div className="field">
                  <label htmlFor="reset-email">Email Address</label>
                  <div className="input-with-icon">
                    <FiMail size={16} className="input-field-icon" />
                    <input
                      id="reset-email"
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block auth-submit-btn" disabled={loading || !email}>
                  {loading ? 'Processing…' : 'Send Recovery Token'}
                </button>

                <div style={{ textAlign: 'center', marginTop: 12 }}>
                  <Link to="/login" style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <FiArrowLeft size={14} /> Back to Sign In
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
