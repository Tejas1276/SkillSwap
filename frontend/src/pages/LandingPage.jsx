import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Coins,
  Video,
  ShieldCheck,
  Star,
  Users,
  Award,
} from 'lucide-react';

export const LandingPage = ({ onNavigate, onSearchSkill, onSelectTutor, onBookTutor }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const popularSkills = [
    'Web Development',
    'UI/UX Design',
    'Data Science',
    'Video Editing',
    'Public Speaking',
    'Guitar',
    'Communication',
    'and more...',
  ];

  const featuredTutors = [
    {
      id: 'rohan-sharma',
      name: 'Rohan Sharma',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      skill: 'Web Development',
      rating: 4.8,
      sessionsCount: 23,
      tags: ['React', 'Node.js', 'MongoDB'],
      college: 'Delhi Tech',
    },
    {
      id: 'priya-singh',
      name: 'Priya Singh',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      skill: 'UI/UX Design',
      rating: 4.7,
      sessionsCount: 18,
      tags: ['Figma', 'Design Systems', 'Mobile'],
      college: 'NID / IIT',
    },
    {
      id: 'aman-verma',
      name: 'Aman Verma',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      skill: 'Data Science',
      rating: 4.9,
      sessionsCount: 31,
      tags: ['Python', 'ML', 'Pandas'],
      college: 'BITS Pilani',
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearchSkill?.(searchTerm.trim());
      onNavigate?.('explore');
    } else {
      onNavigate?.('explore');
    }
  };

  const handlePillClick = (skill) => {
    if (skill === 'and more...') {
      onNavigate?.('explore');
    } else {
      onSearchSkill?.(skill);
      onNavigate?.('explore');
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: 'calc(100vh - 65px)' }}>
      {/* 1. Hero Section */}
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '60px 24px 70px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '50px', alignItems: 'center' }}>
          {/* Left Column */}
          <div>
            {/* Main Headline */}
            <h1 style={{
              fontSize: '3.7rem',
              fontWeight: 900,
              color: '#0f172a',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: '16px',
            }}>
              Learn. Teach.<br />
              <span style={{ color: '#0d9488' }}>Grow Together.</span>
            </h1>

            {/* Handwritten Doodle Annotation */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: "'Caveat', cursive, sans-serif",
              fontSize: '1.35rem',
              color: '#0d9488',
              fontWeight: 700,
              marginBottom: '18px',
              background: '#f0fdfa',
              padding: '4px 16px',
              borderRadius: '9999px',
              border: '1px solid #ccfbf1',
            }}>
              <span>✦ Better Students • Better Skills • Brighter Futures ↗</span>
            </div>

            <p style={{
              fontSize: '1.15rem',
              color: '#475569',
              lineHeight: 1.6,
              maxWidth: '520px',
              marginBottom: '32px',
            }}>
              Skill Swap connects students across campus to exchange skills, learn from peers, and grow together through interactive in-app video sessions.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} style={{
              display: 'flex',
              alignItems: 'center',
              background: '#ffffff',
              border: '2px solid #0d9488',
              borderRadius: '12px',
              padding: '6px 8px 6px 18px',
              boxShadow: '0 4px 14px rgba(13, 148, 136, 0.12)',
              maxWidth: '540px',
              marginBottom: '24px',
            }}>
              <input
                type="text"
                placeholder="Search skills (e.g. Web Development, Design, Music...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.98rem',
                  color: '#0f172a',
                  background: 'transparent',
                  padding: '8px 0',
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#0d9488',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
              >
                <Search size={20} />
              </button>
            </form>

            {/* Popular Skill Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxWidth: '540px', marginBottom: '40px' }}>
              {popularSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => handlePillClick(skill)}
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    color: '#334155',
                    fontSize: '0.84rem',
                    fontWeight: 500,
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#e2e8f0';
                    e.currentTarget.style.color = '#0f172a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f1f5f9';
                    e.currentTarget.style.color = '#334155';
                  }}
                >
                  {skill}
                </button>
              ))}
            </div>

            {/* Stats Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '36px',
              paddingTop: '28px',
              borderTop: '1px solid #e2e8f0',
              maxWidth: '520px',
            }}>
              <div>
                <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                  10K+
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
                  Active Students
                </div>
              </div>

              <div style={{ width: '1px', height: '36px', background: '#e2e8f0' }} />

              <div>
                <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                  5K+
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
                  Skills Shared
                </div>
              </div>

              <div style={{ width: '1px', height: '36px', background: '#e2e8f0' }} />

              <div>
                <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                  95%
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
                  Positive Feedback
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Photo */}
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div style={{
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.15)',
              border: '8px solid #ffffff',
              position: 'relative',
              maxWidth: '540px',
            }}>
              <img
                src="/students_hero.jpg?v=anim"
                alt="Animated students collaborating"
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
              />

              {/* Floating Verified Badge */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                padding: '10px 16px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#0f172a',
              }}>
                <CheckCircle2 size={18} color="#0d9488" />
                <span>Verified Peer Tutoring Network</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How Skill Swap Works Section */}
      <section style={{ backgroundColor: '#f8fafc', padding: '70px 24px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0d9488', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            The Barter Economy
          </span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', margin: '8px 0 16px', letterSpacing: '-0.02em' }}>
            How Skill Swap Works
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto 48px' }}>
            No credit cards or expensive subscriptions. Knowledge is your currency on campus.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', textAlign: 'left' }}>
            {/* Step 1 */}
            <div className="clean-card" style={{ padding: '32px 28px', borderTop: '4px solid #0d9488' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f0fdfa', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <BookOpen size={24} color="#0d9488" />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0d9488', textTransform: 'uppercase' }}>Step 01</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: '6px 0 10px' }}>
                Share What You Know
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.94rem', lineHeight: 1.6 }}>
                List your skills — from Python and Web Dev to Public Speaking and Figma. Choose your schedule and mentor fellow students.
              </p>
            </div>

            {/* Step 2 */}
            <div className="clean-card" style={{ padding: '32px 28px', borderTop: '4px solid #f59e0b' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Coins size={24} color="#f59e0b" />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase' }}>Step 02</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: '6px 0 10px' }}>
                Earn Skill Credits
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.94rem', lineHeight: 1.6 }}>
                Each 1-hour teaching session earns you 1 verified credit in your vault. Collect badges and boost your AI Credibility Score.
              </p>
            </div>

            {/* Step 3 */}
            <div className="clean-card" style={{ padding: '32px 28px', borderTop: '4px solid #0284c7' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Video size={24} color="#0284c7" />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>Step 03</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: '6px 0 10px' }}>
                Learn From Top Peers
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.94rem', lineHeight: 1.6 }}>
                Spend credits to book 1-on-1 video sessions with expert students. Live interactive code sharing, notes, and direct feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Campus Tutors Section */}
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '70px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0d9488', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Verified Mentors
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', marginTop: '6px', letterSpacing: '-0.02em' }}>
              Top Campus Tutors
            </h2>
          </div>
          <button
            onClick={() => onNavigate?.('explore')}
            className="btn-teal-outline"
            style={{ padding: '10px 20px', fontSize: '0.92rem' }}
          >
            <span>Explore All Tutors</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {featuredTutors.map((tutor) => (
            <div
              key={tutor.id}
              className="clean-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '24px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  <img
                    src={tutor.avatar}
                    alt={tutor.name}
                    style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                      {tutor.skill}
                    </h4>
                    <span style={{ fontSize: '0.88rem', color: '#64748b' }}>
                      by <strong>{tutor.name}</strong> • {tutor.college}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: '#64748b', marginBottom: '16px' }}>
                  <Star size={16} color="#f59e0b" fill="#f59e0b" />
                  <strong style={{ color: '#0f172a' }}>{tutor.rating}</strong>
                  <span>• {tutor.sessionsCount} sessions completed</span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '22px' }}>
                  {tutor.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        background: '#f1f5f9',
                        color: '#475569',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: '6px',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    onSelectTutor?.(tutor);
                    onNavigate?.('profile');
                  }}
                  className="btn-outline-gray"
                  style={{ flex: 1, padding: '10px' }}
                >
                  View Profile
                </button>
                <button
                  onClick={() => {
                    onBookTutor?.(tutor);
                    onNavigate?.('book');
                  }}
                  className="btn-teal"
                  style={{ flex: 1, padding: '10px' }}
                >
                  Book Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Campus Banner Call to Action */}
      <section style={{
        position: 'relative',
        background: '#0f172a',
        color: '#ffffff',
        overflow: 'hidden',
        minHeight: '340px',
        display: 'flex',
        alignItems: 'center',
      }}>
        <img
          src="/campus.jpg"
          alt="Campus Grounds"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.28,
          }}
        />

        <div style={{
          position: 'relative',
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '60px 24px',
          width: '100%',
          textAlign: 'center',
        }}>
          <span style={{
            fontFamily: "'Caveat', cursive, sans-serif",
            fontSize: '2.2rem',
            color: '#5eead4',
            fontWeight: 700,
            display: 'block',
            marginBottom: '8px',
          }}>
            Skills today, opportunities tomorrow
          </span>
          <h2 style={{ fontSize: '2.6rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '14px' }}>
            Ready to swap skills on your campus?
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#cbd5e1', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.6 }}>
            Sign up today and get <strong>250 welcome credits</strong> in your vault. Connect with verified tutors in Web Dev, UI/UX, AI, and more!
          </p>

          <button
            onClick={() => onNavigate?.('auth')}
            className="btn-teal"
            style={{
              padding: '14px 34px',
              fontSize: '1.05rem',
              fontWeight: 800,
              borderRadius: '10px',
              boxShadow: '0 8px 24px rgba(13, 148, 136, 0.4)',
            }}
          >
            <span>Get Started with 250 Free Credits</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
};
