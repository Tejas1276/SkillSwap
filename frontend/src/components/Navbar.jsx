import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  GraduationCap,
  Calendar,
  Award,
  Coins,
  ShieldCheck,
  LogOut,
  Sparkles,
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, onGoHome }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="navbar">
      <div className="nav-brand" style={{ cursor: 'pointer' }} onClick={onGoHome} title="View Anime Presentation Intro">
        <img
          src="/logo.png"
          alt="Skill Swap Logo"
          style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'contain' }}
        />
        <span>Skill Swap</span>
      </div>

      <nav className="nav-tabs">
        <button
          className="nav-tab-btn"
          onClick={onGoHome}
          style={{ color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)' }}
          title="Play continuous anime story slideshow"
        >
          <Sparkles size={15} color="#38bdf8" />
          <span>Anime Intro</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'learner' ? 'active' : ''}`}
          onClick={() => setActiveTab('learner')}
        >
          <BookOpen size={17} />
          <span>Learner Hub</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'tutor' ? 'active' : ''}`}
          onClick={() => setActiveTab('tutor')}
        >
          <GraduationCap size={17} />
          <span>Tutor Hub</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'sessions' ? 'active' : ''}`}
          onClick={() => setActiveTab('sessions')}
        >
          <Calendar size={17} />
          <span>Sessions</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          <Award size={17} />
          <span>Progress & AI</span>
        </button>
      </nav>

      <div className="nav-user-stats">
        <div className="stat-chip credits" title="Available Credits for Sessions">
          <Coins size={15} />
          <span>{user.credits ?? 0} Credits</span>
        </div>

        <div className="stat-chip credibility" title="AI Credibility Score">
          <ShieldCheck size={15} />
          <span>Score: {user.credibilityScore ? user.credibilityScore.toFixed(1) : '70.0'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: '#fff',
            }}
          >
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e2e8f0' }}>
            {user.name}
          </span>
          <button
            onClick={logout}
            className="btn-outline"
            style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
            title="Sign Out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </header>
  );
};
