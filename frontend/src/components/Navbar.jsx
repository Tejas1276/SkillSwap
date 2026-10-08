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

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="navbar">
      <div className="nav-brand">
        <Sparkles size={24} color="#818cf8" />
        <span>SkillSwap</span>
      </div>

      <nav className="nav-tabs">
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
