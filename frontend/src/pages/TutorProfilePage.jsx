import React, { useState } from 'react';
import { getAvatarSrc } from '../utils/avatars';
import {
  CheckCircle2,
  MessageSquare,
  UserPlus,
  MoreHorizontal,
  Star,
  Award,
  Users,
  Calendar,
  ArrowLeft,
} from 'lucide-react';

export const TutorProfilePage = ({ tutor, onBookTutor, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('About');
  const [following, setFollowing] = useState(false);

  const profile = tutor || {
    id: 'rohan-sharma',
    name: 'Rohan Sharma',
    handle: '@rohansharma',
    avatar: '/avatars/rohan.svg',
    headline: 'B.Tech CSE | Web Developer | Love building products',
    rating: 4.8,
    sessionsCount: 23,
    studentsCount: '120+',
    badgesCount: 3,
    about:
      "Hey! I'm Rohan, a 3rd year CSE student. I love web development and have built multiple projects using React and Node.js. I'm here to help you learn and build your own projects! Let's grow together.",
    skillsToTeach: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Git & GitHub'],
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
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.4) 100%)',
          }} />
        </div>

        {/* 2. Profile Details & Header */}
        <div style={{ padding: '0 32px 32px', position: 'relative' }}>
          {/* Avatar & Action Buttons Row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: '-54px',
            marginBottom: '18px',
            flexWrap: 'wrap',
            gap: '16px',
          }}>
            <div style={{ position: 'relative' }}>
              <img
                src={getAvatarSrc(profile.avatar, profile.name)}
                alt={profile.name}
                style={{
                  width: '110px',
                  height: '110px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid #ffffff',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                background: '#ffffff',
                borderRadius: '50%',
                display: 'flex',
              }}>
                <CheckCircle2 size={24} color="#0d9488" fill="#ffffff" />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setFollowing(!following)}
                className={following ? 'btn-outline-gray' : 'btn-teal'}
                style={{ padding: '8px 22px' }}
              >
                {following ? 'Following' : 'Follow'}
              </button>

              <button
                onClick={() => onNavigate?.('messages')}
                className="btn-outline-gray"
                style={{ padding: '8px 18px', gap: '6px' }}
              >
                <MessageSquare size={16} />
                <span>Message</span>
              </button>

              <button
                className="btn-outline-gray"
                style={{ padding: '8px 10px' }}
              >
                <MoreHorizontal size={18} />
              </button>

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a' }}>
                {profile.name}
              </h1>
              <CheckCircle2 size={20} color="#0284c7" />
            </div>
            <div style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 500, marginBottom: '6px' }}>
              {profile.handle || '@rohansharma'}
            </div>
            <p style={{ fontSize: '0.96rem', color: '#334155', fontWeight: 500 }}>
              {profile.headline}
            </p>
          </div>

          {/* Stats Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '36px',
            padding: '16px 20px',
            background: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            marginBottom: '28px',
            flexWrap: 'wrap',
          }}>
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
          <div style={{
            display: 'flex',
            gap: '28px',
            borderBottom: '2px solid #e2e8f0',
            marginBottom: '24px',
          }}>
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
                {profile.skillsToTeach?.map((s) => (
                  <span
                    key={s}
                    style={{
                      background: '#f1f5f9',
                      border: '1px solid #e2e8f0',
                      padding: '8px 16px',
                      borderRadius: '8px',
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
              {profile.skillsToTeach?.map((s) => (
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
                  "Rohan is an incredible tutor! He debugged my React state and explained Node.js middleware super clearly."
                </p>
              </div>
            </div>
          )}

          {activeTab === 'Availability' && (
            <div className="clean-card" style={{ padding: '20px' }}>
              <h4 style={{ marginBottom: '8px' }}>Weekly Schedule</h4>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Available Monday to Friday from 10:00 AM to 7:00 PM for 1-on-1 sessions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
