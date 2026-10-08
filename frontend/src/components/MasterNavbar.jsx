import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Coins, Sparkles, User, LogOut } from 'lucide-react';

export const MasterNavbar = ({ activePage, setActivePage }) => {
  const { user, logout } = useAuth();

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
            {/* Credit Pill */}
            <div className="credits-pill" title="Your Credit Balance">
              <span style={{ fontSize: '1rem' }}>🪙</span>
              <span>{user.credits ?? 250} Credits</span>
            </div>

            {/* Notification Bell */}
            <button
              className="btn-outline-gray"
              style={{ padding: '8px', borderRadius: '50%', border: 'none', background: 'transparent' }}
              title="Notifications"
            >
              <Bell size={19} color="#475569" />
            </button>

            {/* User Avatar with Profile trigger */}
            <div
              onClick={() => setActivePage('dashboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                alt={user.name || 'User'}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #e2e8f0',
                }}
              />
            </div>

            <button
              onClick={logout}
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
              onClick={() => setActivePage('auth')}
              className="btn-outline-gray"
              style={{ border: 'none', fontWeight: 600 }}
            >
              Login
            </button>
            <button
              onClick={() => setActivePage('auth')}
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
