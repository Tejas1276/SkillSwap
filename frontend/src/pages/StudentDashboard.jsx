import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { getAvatarSrc } from '../utils/avatars';
import { ALL_TUTORS } from './ExplorePage';
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
  Plus,
  Trash2,
  Save,
} from 'lucide-react';

export const StudentDashboard = ({
  onNavigate,
  onSelectTutor,
  onBookTutor,
  onEnterVideoRoom,
  latestBooking = null,
  bookmarkedTutorIds = [],
  onToggleBookmark = null,
}) => {
  const { user, refreshUser } = useAuth();
  const [sidebarTab, setSidebarTab] = useState('dashboard');
  const [goalSkill, setGoalSkill] = useState('Web Development');
  const [learningPath, setLearningPath] = useState(null);
  const [trendingSkills, setTrendingSkills] = useState([]);
  const [aiEngineSource, setAiEngineSource] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  // My Skills tab state
  const [learnSkillInput, setLearnSkillInput] = useState('');
  const [learnProficiency, setLearnProficiency] = useState('Beginner');
  const [teachSkillInput, setTeachSkillInput] = useState('');
  const [teachProficiency, setTeachProficiency] = useState('Intermediate');
  const [teachCredits, setTeachCredits] = useState(10);
  const [savingSkill, setSavingSkill] = useState(false);
  const [skillNotice, setSkillNotice] = useState('');

  // Settings tab state
  const [editName, setEditName] = useState(user?.name || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileNotice, setProfileNotice] = useState('');

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditBio(user.bio || '');
    }
  }, [user]);

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

  const handleAddLearnSkill = async (e) => {
    e.preventDefault();
    const skill = learnSkillInput.trim();
    if (!skill) return;
    setSavingSkill(true);
    setSkillNotice('');
    try {
      await api.learner.addSkillToLearn({ skill, targetProficiency: learnProficiency });
      await refreshUser?.();
      setLearnSkillInput('');
      setSkillNotice(`Added "${skill}" to your learning wishlist.`);
    } catch (err) {
      setSkillNotice(err.message || 'Sign in to sync learning skills with your profile.');
    } finally {
      setSavingSkill(false);
    }
  };

  const handleRemoveLearnSkill = async (skillName) => {
    setSavingSkill(true);
    setSkillNotice('');
    try {
      await api.learner.removeSkillToLearn(skillName);
      await refreshUser?.();
      setSkillNotice(`Removed "${skillName}" from your learning list.`);
    } catch (err) {
      setSkillNotice(err.message || 'Could not remove skill.');
    } finally {
      setSavingSkill(false);
    }
  };

  const handleAddTeachSkill = async (e) => {
    e.preventDefault();
    const skill = teachSkillInput.trim();
    if (!skill) return;
    setSavingSkill(true);
    setSkillNotice('');
    try {
      await api.tutor.addSkillToTeach({
        skill,
        proficiency: teachProficiency,
        hourlyCredits: Number(teachCredits) || 10,
      });
      await refreshUser?.();
      setTeachSkillInput('');
      setSkillNotice(`Added "${skill}" to your teaching catalog.`);
    } catch (err) {
      setSkillNotice(err.message || 'Sign in to sync teaching skills with your profile.');
    } finally {
      setSavingSkill(false);
    }
  };

  const handleRemoveTeachSkill = async (skillName) => {
    setSavingSkill(true);
    setSkillNotice('');
    try {
      await api.tutor.removeSkillToTeach(skillName);
      await refreshUser?.();
      setSkillNotice(`Removed "${skillName}" from your teaching catalog.`);
    } catch (err) {
      setSkillNotice(err.message || 'Could not remove teaching skill.');
    } finally {
      setSavingSkill(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    setSavingProfile(true);
    setProfileNotice('');
    try {
      await api.auth.updateProfile({ name: editName.trim(), bio: editBio.trim() });
      await refreshUser?.();
      setProfileNotice('Profile changes saved successfully!');
    } catch (err) {
      setProfileNotice(err.message || 'Sign in to persist profile changes.');
    } finally {
      setSavingProfile(false);
    }
  };

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
          <button
            type="button"
            onClick={() => setSidebarTab('settings')}
            style={{ fontSize: '0.8rem', color: '#0d9488', fontWeight: 600, cursor: 'pointer', marginTop: '4px' }}
          >
            Edit Profile
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <div className="clean-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
            { id: 'skills', label: 'My Skills', icon: <BookOpen size={18} /> },
            { id: 'sessions', label: 'My Sessions', icon: <Calendar size={18} /> },
            { id: 'messages', label: 'Messages', icon: <MessageSquare size={18} /> },
            { id: 'bookmarks', label: 'Bookmarks', icon: <Bookmark size={18} />, count: bookmarkedTutorIds.length },
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
                justifyContent: 'space-between',
                gap: '10px',
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
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {item.icon}
                <span>{item.label}</span>
              </span>
              {item.count > 0 && (
                <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#0d9488', color: '#fff', padding: '1px 6px' }}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* 2. Main Dashboard Content */}
      <main style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {sidebarTab === 'dashboard' && (
          <>
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

          <button
            type="button"
            onClick={() => onNavigate?.('leaderboard')}
            className="credits-pill"
            style={{ padding: '8px 18px', fontSize: '0.95rem', cursor: 'pointer' }}
            title="View Credits & Leaderboard"
          >
            <span>🪙</span>
            <span>{user?.credits ?? 250} Credits</span>
          </button>
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
                  {latestBooking
                    ? `${latestBooking.dateLabel || latestBooking.date} • ${latestBooking.slot || latestBooking.time}`
                    : 'Tomorrow • 3:00 PM'}
                </span>
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                {latestBooking
                  ? `${latestBooking.skill}: ${latestBooking.sessionType || latestBooking.type || '1-on-1'} Session with ${latestBooking.tutorName}`
                  : 'Web Development: React State & Custom Hooks with Rohan Sharma'}
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
                      tutorName: latestBooking?.tutorName || 'Rohan Sharma',
                      skill: latestBooking?.skill || 'Web Development',
                      roomId: latestBooking?.roomId || 'room-rohan-sharma-oct14',
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
          <div
            onClick={() => onNavigate?.('sessions')}
            className="clean-card"
            style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '4px solid #3b82f6', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a' }}>{latestBooking ? 4 : 3}</span>
              <div style={{ background: '#eff6ff', padding: '8px', borderRadius: '8px', color: '#3b82f6' }}>
                <Calendar size={20} />
              </div>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
              Upcoming Sessions
            </span>
          </div>

          {/* Card 2: Skills In Progress */}
          <div
            onClick={() => setSidebarTab('skills')}
            className="clean-card"
            style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '4px solid #10b981', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a' }}>
                {(user?.skillsToLearn?.length || 0) + (user?.skillsToTeach?.length || 0) || 12}
              </span>
              <div style={{ background: '#ecfdf5', padding: '8px', borderRadius: '8px', color: '#10b981' }}>
                <BookOpen size={20} />
              </div>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
              Skills In Progress
            </span>
          </div>

          {/* Card 3: Badges Earned */}
          <div
            onClick={() => onNavigate?.('leaderboard')}
            className="clean-card"
            style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '4px solid #f59e0b', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a' }}>
                {user?.badges?.length ?? 5}
              </span>
              <div style={{ background: '#fef3c7', padding: '8px', borderRadius: '8px', color: '#f59e0b' }}>
                <Award size={20} />
              </div>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
              Badges Earned
            </span>
          </div>

          {/* Card 4: People Helped */}
          <div
            onClick={() => onNavigate?.('explore')}
            className="clean-card"
            style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '4px solid #06b6d4', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a' }}>
                {user?.sessionsCompleted ?? 8}
              </span>
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
          </>
        )}

        {sidebarTab === 'skills' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>My Skills & Expertise</h1>
                <p style={{ color: '#64748b', fontSize: '0.92rem' }}>
                  Manage what you want to learn and what you teach to improve AI peer matching.
                </p>
              </div>
              <button type="button" onClick={() => onNavigate?.('explore')} className="btn-teal">
                Find Tutors for My Skills
              </button>
            </div>

            {skillNotice && (
              <div style={{ padding: '10px 14px', background: '#f0fdfa', border: '1px solid #99f6e4', color: '#0f766e', fontSize: '0.88rem', fontWeight: 600 }}>
                {skillNotice}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {/* Skills I Want to Learn */}
              <div className="clean-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  Skills I Want to Learn
                </h3>
                <form onSubmit={handleAddLearnSkill} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="e.g. React, Python, Figma"
                    value={learnSkillInput}
                    onChange={(e) => setLearnSkillInput(e.target.value)}
                    style={{ flex: 1, minWidth: '140px', padding: '8px 10px' }}
                    required
                  />
                  <select
                    value={learnProficiency}
                    onChange={(e) => setLearnProficiency(e.target.value)}
                    style={{ padding: '8px 10px' }}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <button type="submit" disabled={savingSkill} className="btn-teal" style={{ padding: '8px 14px', gap: '4px' }}>
                    <Plus size={15} />
                    <span>Add</span>
                  </button>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(user?.skillsToLearn?.length ? user.skillsToLearn : [
                    { skill: 'React', targetProficiency: 'Intermediate' },
                    { skill: 'UI/UX Design', targetProficiency: 'Beginner' },
                  ]).map((item, idx) => {
                    const label = typeof item === 'string' ? item : item.skill;
                    const level = typeof item === 'string' ? 'Active' : (item.targetProficiency || 'Beginner');
                    return (
                      <div
                        key={`${label}-${idx}`}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px 12px',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{label}</strong>
                          <span style={{ marginLeft: '8px', fontSize: '0.76rem', color: '#0d9488', fontWeight: 700 }}>
                            {level}
                          </span>
                        </div>
                        {user && (
                          <button
                            type="button"
                            onClick={() => handleRemoveLearnSkill(label)}
                            disabled={savingSkill}
                            style={{ color: '#ef4444', padding: '4px' }}
                            title="Remove skill"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Skills I Can Teach */}
              <div className="clean-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  Skills I Can Teach
                </h3>
                <form onSubmit={handleAddTeachSkill} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="e.g. DSA (C++), Node.js"
                    value={teachSkillInput}
                    onChange={(e) => setTeachSkillInput(e.target.value)}
                    style={{ flex: 1, minWidth: '140px', padding: '8px 10px' }}
                    required
                  />
                  <select
                    value={teachProficiency}
                    onChange={(e) => setTeachProficiency(e.target.value)}
                    style={{ padding: '8px 10px' }}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                  </select>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={teachCredits}
                    onChange={(e) => setTeachCredits(e.target.value)}
                    style={{ width: '70px', padding: '8px 8px' }}
                    title="Credits per hour"
                  />
                  <button type="submit" disabled={savingSkill} className="btn-teal" style={{ padding: '8px 14px', gap: '4px' }}>
                    <Plus size={15} />
                    <span>Add</span>
                  </button>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(user?.skillsToTeach?.length ? user.skillsToTeach : [
                    { skill: 'JavaScript', proficiency: 'Expert', hourlyCredits: 10 },
                  ]).map((item, idx) => {
                    const label = typeof item === 'string' ? item : item.skill;
                    const level = typeof item === 'string' ? 'Peer Tutor' : `${item.proficiency || 'Intermediate'} • ${item.hourlyCredits || 10} cr/hr`;
                    return (
                      <div
                        key={`${label}-${idx}`}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px 12px',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{label}</strong>
                          <span style={{ marginLeft: '8px', fontSize: '0.76rem', color: '#475569', fontWeight: 600 }}>
                            {level}
                          </span>
                        </div>
                        {user && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTeachSkill(label)}
                            disabled={savingSkill}
                            style={{ color: '#ef4444', padding: '4px' }}
                            title="Remove teaching skill"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {sidebarTab === 'bookmarks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>Saved Tutors & Bookmarks</h1>
                <p style={{ color: '#64748b', fontSize: '0.92rem' }}>
                  Tutors you bookmarked from Explore appear here for quick profile access and booking.
                </p>
              </div>
              <button type="button" onClick={() => onNavigate?.('explore')} className="btn-outline-gray">
                Browse Explore
              </button>
            </div>

            {bookmarkedTutorIds.length === 0 ? (
              <div className="clean-card" style={{ padding: '40px 24px', textAlign: 'center' }}>
                <Bookmark size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                  No saved tutors yet
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '18px' }}>
                  Click the heart icon on any tutor card in Explore to bookmark them here.
                </p>
                <button type="button" onClick={() => onNavigate?.('explore')} className="btn-teal">
                  Explore Campus Tutors
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
                {ALL_TUTORS.filter((t) => bookmarkedTutorIds.includes(t.id)).map((tutor) => (
                  <div key={tutor.id} className="clean-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={tutor.avatar} alt={tutor.name} style={{ width: '48px', height: '48px', objectFit: 'cover' }} />
                      <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{tutor.skill}</h4>
                        <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
                          {tutor.name} • ⭐ {tutor.rating}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
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
                        type="button"
                        onClick={() => {
                          onBookTutor?.(tutor);
                          onNavigate?.('book');
                        }}
                        className="btn-teal"
                        style={{ flex: 1, padding: '8px' }}
                      >
                        Book
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleBookmark?.(tutor.id)}
                        className="btn-outline-gray"
                        style={{ padding: '8px 10px', color: '#ef4444' }}
                        title="Remove Bookmark"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {sidebarTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>Profile & Account Settings</h1>
              <p style={{ color: '#64748b', fontSize: '0.92rem' }}>
                Update your campus display name and bio shown to peer learners and tutors.
              </p>
            </div>

            {profileNotice && (
              <div style={{ padding: '10px 14px', background: '#f0fdfa', border: '1px solid #99f6e4', color: '#0f766e', fontSize: '0.88rem', fontWeight: 600 }}>
                {profileNotice}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="clean-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '640px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your display name"
                  style={{ width: '100%', padding: '10px 12px' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || 'tejas@skillswap.io'}
                  disabled
                  style={{ width: '100%', padding: '10px 12px', background: '#f1f5f9', color: '#64748b' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Campus Bio & Learning Goals
                </label>
                <textarea
                  rows={4}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell peers what you study and what you love teaching..."
                  style={{ width: '100%', padding: '10px 12px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setSidebarTab('dashboard')}
                  className="btn-outline-gray"
                >
                  Back to Dashboard
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="btn-teal"
                  style={{ gap: '6px' }}
                >
                  <Save size={15} />
                  <span>{savingProfile ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
