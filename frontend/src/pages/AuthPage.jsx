import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, UserCheck, ShieldCheck, Coins } from 'lucide-react';

export const AuthPage = () => {
  const { login, register, error } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password, formData.bio);
      }
    } catch (err) {
      setFormError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (email, password) => {
    setLoading(true);
    setFormError('');
    try {
      await login(email, password);
    } catch (err) {
      setFormError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <img
              src="/logo.png"
              alt="Skill Swap"
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.25)',
                objectFit: 'contain',
                background: '#ffffff',
                padding: '6px'
              }}
            />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#f8fafc' }}>
            {isLogin ? 'Welcome Back to Skill Swap' : 'Join Skill Swap'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
            {isLogin
              ? 'Sign in to schedule sessions and exchange skills'
              : 'Join the community and receive 100 free learning credits'}
          </p>
        </div>

        {/* Quick Demo Persona Switcher */}
        <div className="glass-card" style={{ marginBottom: '20px', padding: '16px' }}>
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, marginBottom: '10px' }}>
            ⚡ Instant Demo Login
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <button
              onClick={() => quickLogin('sarah@skillswap.io', 'password123')}
              className="btn-outline"
              style={{ fontSize: '0.8rem', padding: '8px 4px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
            >
              <strong>Sarah C.</strong>
              <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>React Tutor</span>
            </button>
            <button
              onClick={() => quickLogin('marcus@skillswap.io', 'password123')}
              className="btn-outline"
              style={{ fontSize: '0.8rem', padding: '8px 4px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
            >
              <strong>Marcus B.</strong>
              <span style={{ fontSize: '0.7rem', color: '#a855f7' }}>Python Tutor</span>
            </button>
            <button
              onClick={() => quickLogin('elena@skillswap.io', 'password123')}
              className="btn-outline"
              style={{ fontSize: '0.8rem', padding: '8px 4px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
            >
              <strong>Elena G.</strong>
              <span style={{ fontSize: '0.7rem', color: '#34d399' }}>UI/UX Tutor</span>
            </button>
          </div>
        </div>

        {/* Main Form */}
        <div className="glass-card">
          {(formError || error) && (
            <div style={{
              background: 'var(--danger-light)',
              color: '#f87171',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '16px',
              fontSize: '0.88rem'
            }}>
              {formError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {!isLogin && (
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%' }}
                  required
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ width: '100%' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                Password
              </label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{ width: '100%' }}
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                  Bio (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe what you learn and teach..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '6px' }}
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setFormError('');
              }}
              style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'underline' }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
