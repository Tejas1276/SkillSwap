import React, { useState } from 'react';
import { Search, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const LandingPage = ({ onNavigate, onSearchSkill }) => {
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
      {/* Hero Section */}
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '60px 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '50px', alignItems: 'center' }}>
          {/* Left Column */}
          <div>
            {/* Main Headline */}
            <h1 style={{
              fontSize: '3.6rem',
              fontWeight: 900,
              color: '#0f172a',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: '16px',
            }}>
              Learn. Teach.<br />
              <span style={{ color: '#0d9488' }}>Grow Together.</span>
            </h1>

            {/* Doodle Annotation */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'Caveat, cursive, Inter, sans-serif',
              fontSize: '1.05rem',
              color: '#0d9488',
              fontWeight: 600,
              marginBottom: '18px',
              background: '#f0fdfa',
              padding: '4px 14px',
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
              Skill Swap connects students to exchange skills, learn from peers, and grow together through interactive video sessions.
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
                src="/students_hero.jpg"
                alt="Students collaborating"
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
    </div>
  );
};
