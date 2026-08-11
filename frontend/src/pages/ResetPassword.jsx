import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { FiLock, FiShield, FiCheckCircle, FiSun, FiMoon, FiKey } from 'react-icons/fi';
import './Auth.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tokenParam = searchParams.get('token') || '';

  const [token, setToken] = useState(tokenParam);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (tokenParam) setToken(tokenParam);
  }, [tokenParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !newPassword) return;

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/reset-password', { token, newPassword });
      setSuccess(true);
      toast.success('Password successfully reset!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password reset failed');
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
              <h2 className="auth-card-title">Set New Password</h2>
              <p className="auth-card-subtitle">
                Enter your recovery token and new password
              </p>
            </div>

            {success ? (
              <div className="auth-form-body" style={{ textAlign: 'center' }}>
                <FiCheckCircle size={42} color="#10b981" style={{ margin: '0 auto 12px' }} />
                <h4>Password Updated!</h4>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: '8px 0 16px' }}>
                  Your password has been changed. Redirecting to login…
                </p>
                <Link to="/login" className="btn btn-primary btn-block">
                  Sign In Now
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="auth-form-body">
                <div className="field">
                  <label htmlFor="reset-token-input">Reset Token</label>
                  <div className="input-with-icon">
                    <FiKey size={16} className="input-field-icon" />
                    <input
                      id="reset-token-input"
                      type="text"
                      placeholder="Enter 64-char reset token"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="new-pass-input">New Password (Min 8 chars)</label>
                  <div className="input-with-icon">
                    <FiLock size={16} className="input-field-icon" />
                    <input
                      id="new-pass-input"
                      type="password"
                      placeholder="Enter new strong password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="confirm-pass-input">Confirm New Password</label>
                  <div className="input-with-icon">
                    <FiLock size={16} className="input-field-icon" />
                    <input
                      id="confirm-pass-input"
                      type="password"
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block auth-submit-btn" disabled={loading || !token || !newPassword}>
                  {loading ? 'Updating Password…' : 'Reset Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
