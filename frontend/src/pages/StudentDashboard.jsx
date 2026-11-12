import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { getAvatarSrc } from '../utils/avatars';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  MessageSquare,
  Bookmark,
  Settings,
  Star,
  Users,
  Award,
  ArrowRight,
  Clock,
  CheckCircle2,
  Video,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export const StudentDashboard = ({ onNavigate, onSelectTutor, onBookTutor, onEnterVideoRoom }) => {
  const { user } = useAuth();
  const [sidebarTab, setSidebarTab] = useState('dashboard');
  const [goalSkill, setGoalSkill] = useState('Web Development');
  const [learningPath, setLearningPath] = useState(null);
  const [trendingSkills, setTrendingSkills] = useState([]);
  const [aiEngineSource, setAiEngineSource] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  const loadAIInsights = async (targetSkill) => {
    setLoadingAI(true);
    try {
      const [trendRes, pathRes] = await Promise.all([
        api.ai.getTrendingSkills(5).catch(() => null),
        user ? api.ai.getLearningPath(targetSkill).catch(() => null) : Promise.resolve(null),
      ]);

      if (trendRes?.trending) {
        setTrendingSkills(trendRes.trending);
        setAiEngineSource(trendRes.source || '');
      }
      if (pathRes?.learningPath) {
        setLearningPath(pathRes.learningPath);
        setAiEngineSource(pathRes.source || '');
      }
    } finally {
      setLoadingAI(false);
    }
  };

  useEffect(() => {
    loadAIInsights(goalSkill);
  }, [user]);

  const tutors = [
    {
      id: 'rohan-sharma',
      name: 'Rohan Sharma',
      avatar: '/avatars/rohan.svg',
      skill: 'Web Development',
      rating: 4.8,
      sessionsCount: 23,
      tags: ['React', 'Node.js', 'MongoDB'],
    },
    {
      id: 'priya-singh',
      name: 'Priya Singh',
      avatar: '/avatars/priya.svg',
      skill: 'UI/UX Design',
      rating: 4.7,
      sessionsCount: 18,
      tags: ['Figma', 'Design Systems', 'Mobile'],
    },
    {
      id: 'arjun-mehta',
      name: 'Arjun Mehta',
      avatar: '/avatars/arjun.svg',
      skill: 'Public Speaking',
      rating: 4.9,
      sessionsCount: 12,
      tags: ['Communication', 'Confidence', 'Presentations'],
    },
  ];

  return (
    <div style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: '28px 20px 60px',
      display: 'grid',
      gridTemplateColumns: '240px 1fr',
      gap: '28px',
    }}>
      {/* 1. Left Sidebar */}
      <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* User Mini Profile Card */}
        <div className="clean-card" style={{ padding: '18px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            <img
              src={getAvatarSrc(user?.avatar, user?.name || 'Tejas')}
              alt={user?.name || 'Tejas'}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #0d9488',
              }}
            />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
            {user?.name || 'Tejas Kushwaha'}
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#0d9488', fontWeight: 600, cursor: 'pointer' }}>
            Edit Profile
          </span>
        </div>

        {/* Sidebar Nav Items */}
        <div className="clean-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
            { id: 'skills', label: 'My Skills', icon: <BookOpen size={18} /> },
            { id: 'sessions', label: 'My Sessions', icon: <Calendar size={18} /> },
            { id: 'messages', label: 'Messages', icon: <MessageSquare size={18} /> },
            { id: 'bookmarks', label: 'Bookmarks', icon: <Bookmark size={18} /> },
            { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSidebarTab(item.id);
                if (item.id === 'sessions') onNavigate?.('sessions');
                if (item.id === 'messages') onNavigate?.('messages');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: sidebarTab === item.id ? 700 : 500,
                color: sidebarTab === item.id ? '#0d9488' : '#64748b',
                background: sidebarTab === item.id ? '#f0fdfa' : 'transparent',
                textAlign: 'left',
                width: '100%',
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* 2. Main Dashboard Content */}
      <main style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* Welcome Greeting Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Welcome back, {user?.name?.split(' ')[0] || 'Tejas'}! 👋
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '4px' }}>
              Let's learn something new today.
            </p>
          </div>

          <div className="credits-pill" style={{ padding: '8px 18px', fontSize: '0.95rem' }}>
            <span>🪙</span>
            <span>{user?.credits ?? 250} Credits</span>
          </div>
        </div>

        {/* Next Scheduled Session Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #f0fdfa 0%, #e6fffa 100%)',
          border: '1px solid #99f6e4',
          borderRadius: '14px',
          padding: '16px 22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#0d9488', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Video size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0f766e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Next Scheduled Session
                </span>
                <span style={{ background: '#ccfbf1', color: '#0d9488', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px' }}>
                  Tomorrow • 3:00 PM
                </span>
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                Web Development: React State & Custom Hooks with Rohan Sharma
              </h4>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => onNavigate?.('messages')}
              className="btn-outline-gray"
              style={{ padding: '8px 16px', fontSize: '0.86rem' }}
            >
              Chat Tutor
            </button>
            <button
              onClick={() =>
                onEnterVideoRoom
                  ? onEnterVideoRoom({
                      tutorName: 'Rohan Sharma',
                      skill: 'Web Development',
                      roomId: 'room-rohan-sharma-oct14',
                    })
                  : onNavigate?.('video')
              }
              className="btn-teal"
              style={{ padding: '8px 18px', fontSize: '0.86rem', gap: '6px' }}
            >
              <Video size={16} />
              <span>Join Video Room</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Cards Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '16px' }}>
          {/* Card 1: Upcoming Sessions */}
          <div className="clean-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '4px solid #3b82f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a' }}>3</span>
              <div style={{ background: '#eff6ff', padding: '8px', borderRadius: '8px', color: '#3b82f6' }}>
                <Calendar size={20} />
              </div>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
              Upcoming Sessions
            </span>
          </div>

          {/* Card 2: Skills In Progress */}
          <div className="clean-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '4px solid #10b981' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a' }}>12</span>
              <div style={{ background: '#ecfdf5', padding: '8px', borderRadius: '8px', color: '#10b981' }}>
                <BookOpen size={20} />
              </div>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
              Skills In Progress
            </span>
          </div>

          {/* Card 3: Badges Earned */}
          <div className="clean-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a' }}>5</span>
              <div style={{ background: '#fef3c7', padding: '8px', borderRadius: '8px', color: '#f59e0b' }}>
                <Award size={20} />
              </div>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
              Badges Earned
            </span>
          </div>

          {/* Card 4: People Helped */}
          <div className="clean-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '4px solid #06b6d4' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a' }}>8</span>
              <div style={{ background: '#ecfeff', padding: '8px', borderRadius: '8px', color: '#06b6d4' }}>
                <Users size={20} />
              </div>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
              People Helped
            </span>
          </div>
        </div>

        {/* Recommended For You Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              Recommended for you
            </h2>
            <button
              onClick={() => onNavigate?.('explore')}
              style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0d9488', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span>View All</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
            {tutors.map((tutor) => (
              <div
                key={tutor.id}
                className="clean-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '20px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <img
                      src={tutor.avatar}
                      alt={tutor.name}
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                        {tutor.skill}
                      </h4>
                      <span
                        onClick={() => {
                          onSelectTutor?.(tutor);
                          onNavigate?.('profile');
                        }}
                        style={{ fontSize: '0.85rem', color: '#64748b', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        by {tutor.name}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.86rem', color: '#64748b', marginBottom: '14px' }}>
                    <Star size={15} color="#f59e0b" fill="#f59e0b" />
                    <strong style={{ color: '#0f172a' }}>{tutor.rating}</strong>
                    <span>• {tutor.sessionsCount} sessions</span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {tutor.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          background: '#f1f5f9',
                          color: '#475569',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '18px', display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => {
                      onSelectTutor?.(tutor);
                      onNavigate?.('profile');
                    }}
                    className="btn-outline-gray"
                    style={{ flex: 1, padding: '8px' }}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      onBookTutor?.(tutor);
                      onNavigate?.('book');
                    }}
                    className="btn-teal"
                    style={{ flex: 1, padding: '8px' }}
                  >
                    Book Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phase 4: AI Personalized Learning Path & Trending Skills */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {/* Personalized Learning Path Card */}
          <div className="clean-card" style={{ padding: '22px', borderTop: '4px solid #0d9488' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#0d9488" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  AI Personalized Learning Path
                </h3>
              </div>
              {aiEngineSource && (
                <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', background: '#f0fdfa', color: '#0f766e', border: '1px solid #99f6e4' }}>
                  {aiEngineSource === 'python-ml-microservice' ? 'TensorFlow + Scikit-learn Live' : 'AI Fallback Engine'}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <select
                value={goalSkill}
                onChange={(e) => {
                  const next = e.target.value;
                  setGoalSkill(next);
                  loadAIInsights(next);
                }}
                style={{ flex: 1, padding: '8px 12px', fontSize: '0.88rem' }}
              >
                <option value="Web Development">Goal: Web Development</option>
                <option value="Data Science">Goal: Data Science</option>
                <option value="Machine Learning">Goal: Machine Learning</option>
                <option value="UI/UX Design">Goal: UI/UX Design</option>
                <option value="DSA (C++)">Goal: DSA (C++)</option>
                <option value="Public Speaking">Goal: Public Speaking</option>
              </select>
              <button
                onClick={() => loadAIInsights(goalSkill)}
                className="btn-teal"
                style={{ padding: '8px 14px', fontSize: '0.84rem' }}
                disabled={loadingAI}
              >
                {loadingAI ? 'Generating...' : 'Generate'}
              </button>
            </div>

            {learningPath?.steps ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '4px' }}>
                  Track: <strong style={{ color: '#0f172a' }}>{learningPath.matchedTrack}</strong> • Confidence: <strong style={{ color: '#0d9488' }}>{learningPath.confidence}%</strong> • ~{learningPath.totalEstimatedHours} hrs
                </div>
                {learningPath.steps.slice(0, 4).map((step) => (
                  <div
                    key={step.step}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      gap: '10px',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                        Step {step.step}: {step.skill}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                        {step.focus}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        background: step.status === 'completed' ? '#dcfce7' : '#e0f2fe',
                        color: step.status === 'completed' ? '#15803d' : '#0369a1',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {step.status === 'completed' ? 'Completed' : step.level}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.86rem', color: '#64748b', padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                Sign in via the Login screen to generate your custom Python ML learning path based on your profile skills.
              </div>
            )}
          </div>

          {/* Trending Campus Skills Card */}
          <div className="clean-card" style={{ padding: '22px', borderTop: '4px solid #f59e0b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <TrendingUp size={18} color="#f59e0b" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                Trending Skills on Campus
              </h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '14px' }}>
              Computed from learner wishlists, peer tutor supply, and session booking velocity.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(trendingSkills.length > 0
                ? trendingSkills
                : [
                    { skill: 'React', trendScore: 95, tutorsAvailable: 3, badge: '🔥 High Demand' },
                    { skill: 'Python', trendScore: 92, tutorsAvailable: 2, badge: '🔥 High Demand' },
                    { skill: 'UI/UX Design', trendScore: 87, tutorsAvailable: 2, badge: '📈 Rising' },
                    { skill: 'Machine Learning', trendScore: 84, tutorsAvailable: 1, badge: '🔥 High Demand' },
                  ]
              ).map((item) => (
                <div
                  key={item.skill}
                  onClick={() => onNavigate?.('explore')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{item.skill}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {item.tutorsAvailable} tutors active • {item.badge}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0d9488' }}>
                    {item.trendScore}% index
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
