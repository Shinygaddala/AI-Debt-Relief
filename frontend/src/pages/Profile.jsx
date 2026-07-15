import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useToast } from '../components/Toast';
import { User, Phone, Lock, Save, Briefcase, Mail } from 'lucide-react';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('USER');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState({});
  const { showToast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      const data = response.data;
      setName(data.name);
      setEmail(data.email);
      setPhone(data.phone || '');
      setRole(data.role);
    } catch (err) {
      showToast('Failed to load profile details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!name.trim()) tempErrors.name = 'Full name is required';
    
    if (password) {
      if (password.length < 6) {
        tempErrors.password = 'Password must be at least 6 characters';
      }
      if (password !== confirmPassword) {
        tempErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setUpdating(true);
    try {
      const payload = { name, phone: phone || null };
      if (password) {
        payload.password = password;
      }

      const response = await api.put('/profile', payload);
      
      // Update local storage so navbar user name reflects updates
      localStorage.setItem('user_name', response.data.name);
      
      showToast('Profile updated successfully!', 'success');
      setPassword('');
      setConfirmPassword('');
      setErrors({});
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to update profile settings.';
      showToast(errorMsg, 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '700px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Your Account Profile</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage your profile credentials and account security preferences.</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <h3 className="card-title" style={{ borderBottom: '1px solid var(--border-glow)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
            Personal Details
          </h3>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address (Read-only)</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                id="email"
                type="email" 
                className="form-input" 
                style={{ paddingLeft: '2.75rem', opacity: 0.6, cursor: 'not-allowed' }} 
                value={email}
                disabled 
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  id="name"
                  type="text" 
                  className="form-input" 
                  style={{ paddingLeft: '2.75rem' }} 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  id="phone"
                  type="tel" 
                  className="form-input" 
                  style={{ paddingLeft: '2.75rem' }} 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="role">User Role</label>
            <div style={{ position: 'relative' }}>
              <Briefcase size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                id="role"
                type="text" 
                className="form-input" 
                style={{ paddingLeft: '2.75rem', opacity: 0.6, cursor: 'not-allowed' }} 
                value={role} 
                disabled 
              />
            </div>
          </div>

          <h3 className="card-title" style={{ borderBottom: '1px solid var(--border-glow)', paddingBottom: '0.75rem', margin: '2rem 0 1.5rem' }}>
            Update Password (Optional)
          </h3>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="password">New Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  id="password"
                  type="password" 
                  className="form-input" 
                  style={{ paddingLeft: '2.75rem' }} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  id="confirmPassword"
                  type="password" 
                  className="form-input" 
                  style={{ paddingLeft: '2.75rem' }} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full mt-2"
            disabled={updating}
          >
            <Save size={18} />
            <span>{updating ? 'Saving Profile Updates...' : 'Save Profile Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
