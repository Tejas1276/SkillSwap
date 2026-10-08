import React from 'react';
import {
  Award,
  Coins,
  BookOpen,
  Zap,
  Shield,
  Flame,
  Compass,
  Lock,
  CheckCircle2,
  Trophy,
} from 'lucide-react';

export const LeaderboardPage = () => {
  const badges = [
    {
      id: 'first-step',
      name: 'First Step',
      desc: 'Completed your first session',
      icon: <Award size={28} color="#cd7f32" />,
      bg: '#fef3c7',
      unlocked: true,
    },
    {
      id: 'helper',
      name: 'Helper',
      desc: 'Helped 5 students',
      icon: <Shield size={28} color="#0d9488" />,
      bg: '#f0fdfa',
      unlocked: true,
    },
    {
      id: 'consistent',
      name: 'Consistent',
      desc: '7 day streak',
      icon: <Flame size={28} color="#f59e0b" />,
      bg: '#fffbeb',
      unlocked: true,
    },
    {
      id: 'explorer',
      name: 'Explorer',
      desc: 'Tried 5 different skills',
      icon: <Compass size={28} color="#0284c7" />,
      bg: '#f0f9ff',
      unlocked: true,
    },
    {
      id: 'top-contributor',
      name: 'Top Contributor',
      desc: 'Help 50 students',
      icon: <Lock size={28} color="#94a3b8" />,
      bg: '#f1f5f9',
      unlocked: false,
    },
  ];

  const topStudents = [
    { rank: 1, name: 'Aman Verma', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', credits: 420, sessions: 31, rating: 4.9 },
    { rank: 2, name: 'Rohan Sharma', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100', credits: 380, sessions: 25, rating: 4.8 },
    { rank: 3, name: 'Tejas Kushwaha (You)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', credits: 250, sessions: 12, rating: 4.9 },
    { rank: 4, name: 'Priya Singh', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', credits: 240, sessions: 18, rating: 4.7 },
    { rank: 5, name: 'Kritika Jain', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', credits: 210, sessions: 15, rating: 4.9 },
  ];

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '32px 20px 80px' }}>
      {/* 1. Your Progress Header */}
      <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', marginBottom: '20px' }}>
        Your Progress
      </h1>

      {/* 4 Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '18px',
        marginBottom: '36px',
      }}>
        {/* Stat 1 */}
        <div className="clean-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '12px', color: '#f59e0b' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a' }}>5</div>
            <div style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600 }}>Badges</div>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="clean-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#ecfeff', padding: '12px', borderRadius: '12px', color: '#06b6d4' }}>
            <span style={{ fontSize: '1.4rem' }}>🪙</span>
          </div>
          <div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a' }}>250</div>
            <div style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600 }}>Credits</div>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="clean-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#f0fdfa', padding: '12px', borderRadius: '12px', color: '#0d9488' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a' }}>12</div>
            <div style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600 }}>Sessions Completed</div>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="clean-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#f5f3ff', padding: '12px', borderRadius: '12px', color: '#8b5cf6' }}>
            <Zap size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a' }}>3</div>
            <div style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600 }}>Current Streak</div>
          </div>
        </div>
      </div>

      {/* 2. Badges Section */}
      <div style={{ marginBottom: '44px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '18px' }}>
          Badges
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}>
          {badges.map((b) => (
            <div
              key={b.id}
              className="clean-card"
              style={{
                textAlign: 'center',
                padding: '24px 16px',
                opacity: b.unlocked ? 1 : 0.6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: b.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '6px',
              }}>
                {b.icon}
              </div>
              <strong style={{ fontSize: '0.98rem', color: '#0f172a' }}>{b.name}</strong>
              <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.3 }}>
                {b.desc}
              </p>
              <span style={{
                marginTop: '6px',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: b.unlocked ? '#0d9488' : '#94a3b8',
              }}>
                {b.unlocked ? '✓ Unlocked' : '🔒 Locked'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Community Leaderboard */}
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '18px' }}>
          Top Community Learners & Tutors
        </h2>

        <div className="clean-card" style={{ padding: '8px 16px' }}>
          {topStudents.map((s) => (
            <div
              key={s.rank}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 12px',
                borderBottom: s.rank === 5 ? 'none' : '1px solid #f1f5f9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{
                  fontSize: '1.1rem',
                  fontWeight: 900,
                  width: '28px',
                  color: s.rank === 1 ? '#f59e0b' : s.rank === 2 ? '#94a3b8' : s.rank === 3 ? '#b45309' : '#64748b',
                }}>
                  #{s.rank}
                </span>

                <img
                  src={s.avatar}
                  alt={s.name}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                />

                <div>
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{s.name}</strong>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    ⭐ {s.rating} • {s.sessions} sessions completed
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.95rem', color: '#0d9488' }}>
                <span>🪙 {s.credits} Credits</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
