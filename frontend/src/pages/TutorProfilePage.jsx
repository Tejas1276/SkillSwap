import React, { useState, useRef, useEffect } from 'react';
import { getAvatarSrc } from '../utils/avatars';
import {
  CheckCircle2,
  MessageSquare,
  MoreHorizontal,
  ArrowLeft,
  Copy,
  Check,
  ShieldCheck,
} from 'lucide-react';

export const TutorProfilePage = ({ tutor, onBookTutor, onNavigate, onMessageTutor }) => {
  const [activeTab, setActiveTab] = useState('About');
  const [following, setFollowing] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const moreRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const raw = tutor || {
    id: 'rohan-sharma',
    name: 'Rohan Sharma',
    handle: '@rohansharma',
    avatar: '/avatars/rohan.svg',
    skill: 'Web Development',
    headline: 'B.Tech CSE | Web Developer | Love building products',
    rating: 4.8,
    sessionsCount: 23,
    studentsCount: '120+',
    badgesCount: 3,
    credibilityScore: 92,
    about:
      "Hey! I'm Rohan, a 3rd year CSE student. I love web development and have built multiple projects using React and Node.js. I'm here to help you learn and build your own projects! Let's grow together.",
    skillsToTeach: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Git & GitHub'],
  };

  // Normalize optional fields for tutors selected from Explore / Dashboard / Landing
  const profile = {
    ...raw,
    handle: raw.handle || `@${(raw.name || 'mentor').toLowerCase().replace(/\s+/g, '')}`,
    headline: raw.headline || `${raw.college || 'University'} Peer Mentor • ${raw.skill || 'Core Technical Skills'}`,
    sessionsCount: raw.sessionsCount || raw.reviewsCount || 18,
    studentsCount: raw.studentsCount || '85+',
    badgesCount: raw.badgesCount || 4,
    credibilityScore: raw.credibilityScore || 91,
    about:
      raw.about ||
      `Hi! I'm ${raw.name}, passionate about ${raw.skill || 'peer learning'}. I host structured 1-on-1 WebRTC sessions covering hands-on projects, real debugging, and career guidance.`,
    skillsToTeach:
      raw.skillsToTeach && raw.skillsToTeach.length > 0
        ? raw.skillsToTeach
        : [...new Set([raw.skill, ...(raw.tags || [])].filter(Boolean))],
  };

  const handleCopyProfileLink = () => {
    navigator.clipboard?.writeText(`${window.location.origin}/?tutor=${profile.id || profile.handle}`);
    setCopiedLink(true);
    setTimeout(() => {
      setCopiedLink(false);
      setShowMoreMenu(false);
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '24px 20px 80px' }}>
      {/* Back to Explore link */}
      <button
        onClick={() => onNavigate?.('explore')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#64748b',
          fontSize: '0.88rem',
          fontWeight: 600,
          marginBottom: '16px',
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Explore</span>
      </button>

      <div className="clean-card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* 1. Campus Banner Photo */}
        <div style={{ height: '220px', width: '100%', position: 'relative' }}>
          <img
            src="/campus.jpg"
            alt="Campus Banner"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.4) 100%)',
            }}
          />
        </div>

        {/* 2. Profile Details & Header */}
        <div style={{ padding: '0 32px 32px', position: 'relative' }}>
          {/* Avatar & Action Buttons Row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginTop: '-54px',
              marginBottom: '18px',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div style={{ position: 'relative' }}>
              <img
                src={getAvatarSrc(profile.avatar, profile.name)}
                alt={profile.name}
                style={{
                  width: '110px',
                  height: '110px',
                  objectFit: 'cover',
                  border: '4px solid #ffffff',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '6px',
                  right: '6px',
                  background: '#ffffff',
                  display: 'flex',
                }}
              >
                <CheckCircle2 size={24} color="#0d9488" fill="#ffffff" />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setFollowing(!following)}
                className={following ? 'btn-outline-gray' : 'btn-teal'}
                style={{ padding: '8px 22px' }}
              >
                {following ? '✓ Following' : 'Follow'}
              </button>

              <button
                onClick={() => {
                  if (onMessageTutor) {
                    onMessageTutor(profile.name);
                  } else {
                    onNavigate?.('messages');
                  }
                }}
                className="btn-outline-gray"
                style={{ padding: '8px 18px', gap: '6px' }}
              >
                <MessageSquare size={16} />
                <span>Message</span>
              </button>

              <div ref={moreRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="btn-outline-gray"
                  style={{ padding: '8px 10px' }}
                  title="More Actions"
                >
                  <MoreHorizontal size={18} />
                </button>

                {showMoreMenu && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      right: 0,
                      width: '190px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      boxShadow: '0 10px 24px rgba(15,23,42,0.14)',
                      zIndex: 100,
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleCopyProfileLink}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.84rem',
                        color: '#0f172a',
                      }}
                    >
                      {copiedLink ? <Check size={14} color="#0d9488" /> : <Copy size={14} />}
                      <span>{copiedLink ? 'Profile Link Copied!' : 'Copy Profile Link'}</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  onBookTutor?.(profile);
                  onNavigate?.('book');
                }}
                className="btn-teal"
                style={{ padding: '8px 22px' }}
              >
                Book Session
              </button>
            </div>
          </div>

          {/* Name & Headline */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a' }}>
                {profile.name}
              </h1>
              <CheckCircle2 size={20} color="#0284c7" />
              <span
                style={{
                  background: '#f0fdfa',
                  border: '1px solid #99f6e4',
                  color: '#0f766e',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <ShieldCheck size={13} />
                AI Credibility: {profile.credibilityScore}/100
              </span>
            </div>
            <div style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 500, marginBottom: '6px' }}>
              {profile.handle}
            </div>
            <p style={{ fontSize: '0.96rem', color: '#334155', fontWeight: 500 }}>
              {profile.headline}
            </p>
          </div>

          {/* Stats Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '36px',
              padding: '16px 20px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              marginBottom: '28px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a' }}>
                ⭐ {profile.rating}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Rating</div>
            </div>

            <div style={{ width: '1px', height: '32px', background: '#cbd5e1' }} />

            <div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a' }}>
                {profile.sessionsCount}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Sessions</div>
            </div>

            <div style={{ width: '1px', height: '32px', background: '#cbd5e1' }} />

            <div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a' }}>
                {profile.studentsCount}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Students</div>
            </div>

            <div style={{ width: '1px', height: '32px', background: '#cbd5e1' }} />

            <div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a' }}>
                {profile.badgesCount}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Badges</div>
            </div>
          </div>

          {/* Tabs: About, Skills, Reviews, Availability */}
          <div
            style={{
              display: 'flex',
              gap: '28px',
              borderBottom: '2px solid #e2e8f0',
              marginBottom: '24px',
            }}
          >
            {['About', 'Skills', 'Reviews', 'Availability'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  fontSize: '0.94rem',
                  fontWeight: activeTab === tab ? 700 : 500,
                  color: activeTab === tab ? '#0d9488' : '#64748b',
                  padding: '10px 0',
                  position: 'relative',
                  borderBottom: activeTab === tab ? '2px solid #0d9488' : '2px solid transparent',
                  marginBottom: '-2px',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'About' && (
            <div>
              <p style={{ fontSize: '0.98rem', color: '#334155', lineHeight: 1.6, marginBottom: '28px' }}>
                {profile.about}
              </p>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
                Skills I Teach
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {profile.skillsToTeach.map((s) => (
                  <span
                    key={s}
                    style={{
                      background: '#f1f5f9',
                      border: '1px solid #e2e8f0',
                      padding: '8px 16px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: '#0f172a',
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Skills' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {profile.skillsToTeach.map((s) => (
                <div key={s} className="clean-card" style={{ padding: '12px 18px' }}>
                  <strong>{s}</strong>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Proficiency: Expert • 1 hr sessions</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Reviews' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="clean-card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <strong>Tejas Kushwaha</strong>
                  <span style={{ color: '#f59e0b' }}>⭐⭐⭐⭐⭐ 5.0</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#475569' }}>
                  "{profile.name} is an incredible tutor! Explained {profile.skill || 'core concepts'} clearly with live examples."
                </p>
              </div>
            </div>
          )}

          {activeTab === 'Availability' && (
            <div className="clean-card" style={{ padding: '20px' }}>
              <h4 style={{ marginBottom: '8px' }}>Weekly Schedule</h4>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Available Monday to Friday from 10:00 AM to 7:00 PM for 1-on-1 & Group WebRTC sessions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
