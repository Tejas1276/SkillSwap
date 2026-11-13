import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const AuthPage = ({ onNavigate, initialMode = 'signup' }) => {
  const { login, register, error } = useAuth();
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    setIsLogin(initialMode === 'login');
    setFormError('');
  }, [initialMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(
          formData.name,
          formData.email,
          formData.password,
          formData.college ? `Student at ${formData.college}` : ''
        );
      }
      onNavigate?.('dashboard');
    } catch (err) {
      setFormError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (email, password, name) => {
    setLoading(true);
    setFormError('');
    try {
      await login(email, password);
      onNavigate?.('dashboard');
    } catch {
      // If user not registered yet, register them
      try {
        await register(name, email, password, 'Skill Swap Member');
        onNavigate?.('dashboard');
      } catch (regErr) {
        setFormError(regErr.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 65px)',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
      backgroundColor: '#ffffff',
    }}>
      {/* Left Form Column */}
      <div style={{
        padding: '48px 60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        maxWidth: '560px',
        margin: '0 auto',
        width: '100%',
      }}>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.02em' }}>
          {isLogin ? 'Welcome back' : 'Create your account'}
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '28px' }}>
          {isLogin
            ? 'Sign in to access your dashboard and sessions.'
            : 'Join a community of learners and teachers.'}
        </p>

        {/* Quick Demo Persona Chips for instant evaluator testing */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '10px 14px',
          marginBottom: '20px',
        }}>
          <span style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
            ⚡ 1-Click Presentation Personas:
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleQuickDemo('tejas@skillswap.io', 'password123', 'Tejas Kushwaha')}
              style={{
                background: '#0d9488',
                color: '#fff',
                fontSize: '0.78rem',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '6px',
              }}
            >
              Tejas Kushwaha (Student)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('rohan@skillswap.io', 'password123', 'Rohan Sharma')}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#0f172a',
                fontSize: '0.78rem',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '6px',
              }}
            >
              Rohan Sharma (Tutor)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('priya@skillswap.io', 'password123', 'Priya Singh')}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#0f172a',
                fontSize: '0.78rem',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '6px',
              }}
            >
              Priya Singh (Designer)
            </button>
          </div>
        </div>

        {(formError || error) && (
          <div style={{
            background: '#fef2f2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '0.88rem',
          }}>
            {formError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isLogin && (
            <>
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px' }}
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="College / University (Optional)"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px' }}
                />
              </div>
            </>
          )}

          <div>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{ width: '100%', padding: '12px 14px' }}
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={{ width: '100%', padding: '12px 14px' }}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-teal"
            disabled={loading}
            style={{ width: '100%', padding: '12px', fontSize: '0.98rem', marginTop: '4px' }}
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          margin: '22px 0',
          color: '#94a3b8',
          fontSize: '0.85rem',
        }}>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          <span>or</span>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
        </div>

        {/* Social Auth Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            className="btn-outline-gray"
            style={{ justifyContent: 'flex-start', padding: '11px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}
            onClick={() => handleQuickDemo('tejas@skillswap.io', 'password123', 'Tejas Kushwaha')}
            title="Instant Demo: Continue with Google as Tejas Kushwaha (Student)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.31 7.31 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2 0 10.04 0 12s.46 3.8 1.27 5.42l4.01-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.69 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span style={{ fontWeight: 600, color: '#0f172a' }}>Continue with Google</span>
            <span style={{
              marginLeft: 'auto',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#0d9488',
              background: '#f0fdfa',
              border: '1px solid #ccfbf1',
              padding: '2px 8px',
              borderRadius: '4px',
              letterSpacing: '0.01em',
            }}>
              Tejas (Student)
            </span>
          </button>

          <button
            type="button"
            className="btn-outline-gray"
            style={{ justifyContent: 'flex-start', padding: '11px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}
            onClick={() => handleQuickDemo('rohan@skillswap.io', 'password123', 'Rohan Sharma')}
            title="Instant Demo: Continue with GitHub as Rohan Sharma (Tutor)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#0f172a" style={{ flexShrink: 0 }}>
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            <span style={{ fontWeight: 600, color: '#0f172a' }}>Continue with GitHub</span>
            <span style={{
              marginLeft: 'auto',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#0f172a',
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              padding: '2px 8px',
              borderRadius: '4px',
              letterSpacing: '0.01em',
            }}>
              Rohan (Tutor)
            </span>
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: '#64748b' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: '#0d9488', fontWeight: 700, textDecoration: 'underline' }}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </div>

      {/* Right Campus Image Column with Cursive Overlay */}
      <div style={{
        position: 'relative',
        display: 'none',
        minHeight: '100%',
        backgroundColor: '#0f172a',
      }}
      className="campus-auth-column"
      >
        <img
          src="/campus.jpg"
          alt="University Campus"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.2) 0%, rgba(15, 23, 42, 0.6) 100%)',
        }} />

        <div style={{
          position: 'absolute',
          top: '48px',
          right: '54px',
          maxWidth: '360px',
          textAlign: 'right',
        }}>
          <span style={{
            fontFamily: "'Caveat', cursive, sans-serif",
            fontSize: '3.1rem',
            color: '#ffffff',
            fontWeight: 700,
            textShadow: '0 3px 18px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.9)',
            lineHeight: 1.15,
            display: 'block',
            letterSpacing: '0.01em',
          }}>
            Skills today,<br />opportunities tomorrow
          </span>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .campus-auth-column {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};
