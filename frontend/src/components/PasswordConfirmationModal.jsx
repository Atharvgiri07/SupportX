import { useState } from 'react';
import { FiLock, FiX, FiAlertTriangle } from 'react-icons/fi';
import api from '../utils/api';
import './PasswordConfirmationModal.css';

const PasswordConfirmationModal = ({ isOpen, onClose, onConfirm, title = 'Security Confirmation', description = 'Please enter your password to confirm this action.' }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Password is required');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/confirm-password', { password });
      setPassword('');
      onConfirm();
    } catch (err) {
      setError(err.response?.data?.message || 'Password confirmation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="security-modal-overlay">
      <div className="security-modal-card card">
        <div className="security-modal-header">
          <div className="security-modal-title">
            <FiLock size={18} color="var(--color-danger)" />
            <h3>{title}</h3>
          </div>
          <button className="security-modal-close" onClick={onClose}>
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="security-modal-body">
          <p className="security-modal-desc">{description}</p>

          <div className="field">
            <label htmlFor="confirm-pass-input">Admin Password</label>
            <input
              id="confirm-pass-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>

          {error && <div className="error-text">{error}</div>}

          <div className="security-modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-danger" disabled={loading || !password}>
              {loading ? 'Verifying…' : 'Confirm & Proceed'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordConfirmationModal;
