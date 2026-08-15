import { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import { toast } from 'react-toastify';
import {
  FiZap,
  FiEye,
  FiEyeOff,
  FiLock,
  FiUser,
  FiMail,
  FiShield,
  FiCheckCircle,
  FiSun,
  FiMoon,
  FiArrowRight,
  FiArrowLeft,
  FiAlertTriangle,
  FiInfo,
  FiLayers,
} from 'react-icons/fi';
import './AdminRegister.css';

const AdminRegister = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminSecurityKey: '',
    department: '',
  });
  const [departments, setDepartments] = useState([]);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSecurityKey, setShowSecurityKey] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { user, registerAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch active departments for optional assignment
    const fetchDepartments = async () => {
      try {
        const { data } = await api.get('/departments');
        setDepartments(Array.isArray(data) ? data : []);
      } catch (err) {
        // Non-critical, ignore if unauthenticated
      }
    };
    fetchDepartments();
  }, []);

  if (user) return <Navigate to="/" replace />;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9]/.test(pwd)) score += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 25;
    return score;
  };

  const pwdStrength = calculatePasswordStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the administrative security protocols.');
      return;
    }

    setSubmitting(true);
    try {
      await registerAdmin({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        adminSecurityKey: form.adminSecurityKey,
        department: form.department || null,
      });
      toast.success('Administrator account provisioned successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Administrator registration failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-reg-root">
      {/* Top action bar */}
      <div className="admin-reg-top-bar">
        <Link to="/" className="admin-reg-back-link">
          <FiArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
        <button
          onClick={toggleTheme}
          className="admin-reg-theme-btn"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <FiMoon size={16} /> : <FiSun size={16} />}
          <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
        </button>
      </div>

      <div className="admin-reg-container">
        {/* Left Side: Enterprise Security Callout */}
        <div className="admin-reg-hero">
          <div className="admin-reg-badge">
            <FiShield size={20} />
            <span>Administrator Portal Provisioning</span>
          </div>

          <h1 className="admin-reg-hero-title">
            Secure Governance for <br />
            <span className="admin-reg-gradient-text">SupportX Ecosystem</span>
          </h1>

          <p className="admin-reg-hero-sub">
            Administrative accounts maintain root oversight across SLA automated routing, department topologies, employee performance scoring, and Gemini AI strategic summaries.
          </p>

          <div className="admin-reg-perks">
            <div className="admin-reg-perk-item">
              <div className="admin-reg-perk-icon">
                <FiCheckCircle size={18} />
              </div>
              <div>
                <h4>System Configuration</h4>
                <p>Manage enterprise departments, category trees, and auto-dispatch rules.</p>
              </div>
            </div>

            <div className="admin-reg-perk-item">
              <div className="admin-reg-perk-icon">
                <FiCheckCircle size={18} />
              </div>
              <div>
                <h4>Gemini AI Analytics</h4>
                <p>Run executive performance assessments, burnout risk models, and SLA velocity diagnostics.</p>
              </div>
            </div>

            <div className="admin-reg-perk-item">
              <div className="admin-reg-perk-icon">
                <FiCheckCircle size={18} />
              </div>
              <div>
                <h4>Workforce Audit Trail</h4>
                <p>Inspect immutable activity logs, resolution rating indices, and leaderboards.</p>
              </div>
            </div>
          </div>

          <div className="admin-reg-security-banner">
            <FiInfo size={18} className="security-icon-gold" />
            <div>
              <strong>Security Protocol Active</strong>
              <p>Registration requires a pre-shared master Admin Security Key validated exclusively server-side.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="admin-reg-card card">
          <div className="admin-reg-card-header">
            <div className="admin-reg-logo">
              <FiZap size={22} color="var(--color-primary)" />
              <span>SupportX Admin</span>
            </div>
            <h2>Create Administrator Account</h2>
            <p>Enter your authorization credentials to provision admin access</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-reg-form">
            {/* Full Name */}
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
                  placeholder="e.g. Sarah Jenkins"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Work Email */}
            <div className="field">
              <label htmlFor="email">Administrative Email Address</label>
              <div className="input-with-icon">
                <FiMail size={16} className="input-field-icon" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@company.com"
                  required
                />
              </div>
            </div>

            {/* Department (Optional) */}
            <div className="field">
              <label htmlFor="department">Managing Department (Optional)</label>
              <div className="input-with-icon">
                <FiLayers size={16} className="input-field-icon" />
                <select
                  id="department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="select-input"
                >
                  <option value="">Executive / All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password */}
            <div className="field">
              <label htmlFor="password">Admin Password</label>
              <div className="input-with-icon">
                <FiLock size={16} className="input-field-icon" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="pwd-strength-bar-container">
                  <div
                    className="pwd-strength-bar"
                    style={{
                      width: `${pwdStrength}%`,
                      backgroundColor:
                        pwdStrength < 50 ? '#ef4444' : pwdStrength < 100 ? '#f59e0b' : '#10b981',
                    }}
                  />
                  <span className="pwd-strength-label">
                    {pwdStrength < 50 ? 'Weak' : pwdStrength < 100 ? 'Good' : 'Strong & Compliant'}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-with-icon">
                <FiLock size={16} className="input-field-icon" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {/* Admin Security Key */}
            <div className="field admin-key-field">
              <label htmlFor="adminSecurityKey">
                <FiShield size={14} color="var(--color-primary)" />
                <span>Admin Security Master Key</span>
              </label>
              <div className="input-with-icon">
                <FiShield size={16} className="input-field-icon" />
                <input
                  id="adminSecurityKey"
                  name="adminSecurityKey"
                  type={showSecurityKey ? 'text' : 'password'}
                  value={form.adminSecurityKey}
                  onChange={handleChange}
                  placeholder="Enter organization security key"
                  required
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowSecurityKey(!showSecurityKey)}
                  aria-label={showSecurityKey ? 'Hide key' : 'Show key'}
                >
                  {showSecurityKey ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              <span className="admin-key-caption">
                Master key configured on your private server environment (`ADMIN_SECURITY_KEY`).
              </span>
            </div>

            {/* Terms checkbox */}
            <div className="admin-terms-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span>I acknowledge administrative audit logging and responsibility for system-wide access.</span>
              </label>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="auth-error-alert" role="alert">
                <FiAlertTriangle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary btn-block admin-submit-btn"
              disabled={submitting}
            >
              {submitting ? (
                <span>Provisioning Administrator Access…</span>
              ) : (
                <>
                  <FiShield size={16} />
                  <span>Register as Administrator</span>
                  <FiArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="admin-reg-footer">
            <p>
              Already an administrator? <Link to="/login?role=admin">Sign in to Admin Console</Link>
            </p>
            <p style={{ marginTop: 8 }}>
              Standard employee? <Link to="/register">Create employee account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
