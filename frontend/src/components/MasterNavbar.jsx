import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAvatarSrc } from '../utils/avatars';
import { Bell, LogOut, Sparkles, Calendar, Gift } from 'lucide-react';

export const MasterNavbar = ({ activePage, setActivePage }) => {
  const { user, logout } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const notifications = [
    {
      id: 'n1',
      icon: <Gift size={15} color="#d97706" />,
      title: 'Claim Daily Participation Bonus (+10 Credits)',
      sub: 'Visit Leaderboard & Rewards to claim today’s check-in',
      target: 'leaderboard',
    },
    {
      id: 'n2',
      icon: <Calendar size={15} color="#0d9488" />,
      title: 'Upcoming WebRTC Session with Rohan Sharma',
      sub: 'Topic: Web Development • Open Video Room when ready',
      target: 'dashboard',
    },
    {
      id: 'n3',
      icon: <Sparkles size={15} color="#2563eb" />,
      title: 'AI Skill Matches Ready',
      sub: 'TensorFlow + Scikit-learn ranked mentors for your goals',
      target: 'explore',
    },
  ];

  return (
    <header className="main-navbar">
      <div className="brand-wrapper" onClick={() => setActivePage('home')}>
        <img
          src="/logo.png"
          alt="Skill Swap Logo"
          style={{ width: '38px', height: '38px', objectFit: 'contain' }}
        />
        <span className="brand-title">Skill Swap</span>
      </div>

      <nav className="nav-links-row">
        <span
          className={`nav-link-item ${activePage === 'home' ? 'active' : ''}`}
          onClick={() => setActivePage('home')}
        >
          Home
        </span>
        <span
          className={`nav-link-item ${activePage === 'explore' ? 'active' : ''}`}
          onClick={() => setActivePage('explore')}
        >
          Explore
        </span>
        <span
          className={`nav-link-item ${activePage === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActivePage('dashboard')}
        >
          Dashboard
        </span>
        <span
          className={`nav-link-item ${activePage === 'sessions' || activePage === 'book' || activePage === 'video' ? 'active' : ''}`}
          onClick={() => setActivePage('sessions')}
        >
          Sessions
        </span>
        <span
          className={`nav-link-item ${activePage === 'messages' ? 'active' : ''}`}
          onClick={() => setActivePage('messages')}
        >
          Messages
        </span>
        <span
          className={`nav-link-item ${activePage === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActivePage('leaderboard')}
        >
          Leaderboard
        </span>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {user ? (
          <>
            {/* Clickable Credit Pill */}
            <button
              type="button"
              onClick={() => setActivePage('leaderboard')}
              className="credits-pill"
              title="View Credit Balance, Badges & Rewards Ledger"
              style={{ cursor: 'pointer' }}
            >
              <span style={{ fontSize: '1rem' }}>🪙</span>
              <span>{user.credits ?? 250} Credits</span>
            </button>

            {/* Interactive Notification Bell + Popover */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => {
                  setShowNotifs(!showNotifs);
                  setUnreadCount(0);
                }}
                className="btn-outline-gray"
                style={{
                  padding: '8px',
                  borderRadius: '0px',
                  border: showNotifs ? '1px solid #0d9488' : '1px solid transparent',
                  background: showNotifs ? '#f0fdfa' : 'transparent',
                  position: 'relative',
                }}
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell size={19} color={showNotifs ? '#0d9488' : '#475569'} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      width: '8px',
                      height: '8px',
                      background: '#ef4444',
                    }}
                  />
                )}
              </button>

              {showNotifs && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '320px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    boxShadow: '0 16px 32px rgba(15, 23, 42, 0.16)',
                    zIndex: 300,
                  }}
                >
                  <div
                    style={{
                      padding: '10px 14px',
                      background: '#f8fafc',
                      borderBottom: '1px solid #e2e8f0',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>Notifications</span>
                    <span style={{ color: '#0d9488' }}>All caught up</span>
                  </div>
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => {
                        setShowNotifs(false);
                        setActivePage(n.target);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        textAlign: 'left',
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'flex-start',
                        borderBottom: '1px solid #f1f5f9',
                        background: '#ffffff',
                      }}
                    >
                      <div style={{ marginTop: '2px' }}>{n.icon}</div>
                      <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                          {n.title}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>
                          {n.sub}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Avatar with Profile trigger */}
            <div
              onClick={() => setActivePage('dashboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
              title="Open Dashboard"
            >
              <img
                src={getAvatarSrc(user.avatar, user.name)}
                alt={user.name || 'User'}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '0px',
                  objectFit: 'cover',
                  border: '2px solid #e2e8f0',
                }}
              />
            </div>

            <button
              onClick={() => {
                logout();
                setActivePage('home');
              }}
              className="btn-outline-gray"
              style={{ padding: '6px 10px', fontSize: '0.8rem' }}
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActivePage('login')}
              className="btn-outline-gray"
              style={{ border: 'none', fontWeight: 600 }}
            >
              Login
            </button>
            <button
              onClick={() => setActivePage('signup')}
              className="btn-teal"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
};
