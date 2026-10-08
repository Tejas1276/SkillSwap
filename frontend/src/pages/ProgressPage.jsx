import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  Award,
  Coins,
  ShieldCheck,
  Star,
  TrendingUp,
  History,
  Compass,
  BookOpen,
  CheckCircle,
  Crown,
} from 'lucide-react';

export const ProgressPage = () => {
  const { user, refreshUser } = useAuth();
  const [history, setHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [gamificationData, leaderboardData] = await Promise.all([
          api.gamification.getHistory(),
          api.gamification.getLeaderboard(),
        ]);
        setHistory(gamificationData.history || []);
        setLeaderboard(leaderboardData.leaderboard || []);
      } catch (err) {
        console.error('Error fetching progress data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    refreshUser();
  }, []);

  const badgeIcons = {
    compass: <Compass size={22} color="#38bdf8" />,
    'book-open': <BookOpen size={22} color="#34d399" />,
    star: <Star size={22} color="#fbbf24" fill="#fbbf24" />,
    award: <Award size={22} color="#a855f7" />,
  };

  const credibility = user?.credibilityScore || 70.0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div className="glass-card">
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Progress & Gamification Hub</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
          Track your skill growth, peer ratings, AI Credibility Score, and unlocked achievement badges.
        </p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid-3">
        {/* Credits Balance */}
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
            <Coins size={28} />
          </div>
          <div>
            <div className="stat-value">{user?.credits ?? 0}</div>
            <div className="stat-label">Credit Balance</div>
          </div>
        </div>

        {/* AI Credibility Score */}
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
            <ShieldCheck size={28} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="stat-value">{credibility.toFixed(1)} <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>/ 100</span></div>
            <div className="stat-label">AI Credibility Score</div>
            {/* Score progress bar */}
            <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '99px', marginTop: '8px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.min(100, Math.max(0, credibility))}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                  borderRadius: '99px',
                }}
              />
            </div>
          </div>
        </div>

        {/* Peer Rating */}
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24' }}>
            <Star size={28} fill="#fbbf24" />
          </div>
          <div>
            <div className="stat-value">
              {user?.rating?.count > 0 ? user.rating.average.toFixed(1) : '5.0'}
              <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 500, marginLeft: '6px' }}>
                ({user?.rating?.count || 0} reviews)
              </span>
            </div>
            <div className="stat-label">Average Peer Rating</div>
          </div>
        </div>
      </div>

      {/* Badges & Achievements Section */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Award size={20} color="#a855f7" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            Unlocked Badges & Achievements ({user?.badges?.length || 0})
          </h2>
        </div>

        <div className="grid-3">
          {/* Always display standard badges with earned status */}
          {[
            {
              name: 'Pioneer',
              description: 'Joined the Skill Swap community and received welcome bonus',
              icon: 'compass',
              defaultUnlocked: true,
            },
            {
              name: 'Knowledge Sharer',
              description: 'Offered your first skill to teach the community',
              icon: 'book-open',
              defaultUnlocked: (user?.skillsToTeach?.length || 0) > 0,
            },
            {
              name: 'Top Rated Peer',
              description: 'Maintained 4.5+ star rating across 5 or more peer sessions',
              icon: 'star',
              defaultUnlocked: (user?.rating?.count || 0) >= 5 && (user?.rating?.average || 0) >= 4.5,
            },
          ].map((badge) => {
            const userHasBadge = user?.badges?.some((b) => b.name === badge.name) || badge.defaultUnlocked;

            return (
              <div
                key={badge.name}
                className="glass-card"
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                  opacity: userHasBadge ? 1 : 0.45,
                  borderColor: userHasBadge ? 'rgba(99, 102, 241, 0.4)' : 'var(--border-color)',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: 'var(--radius-sm)',
                    background: userHasBadge ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {badgeIcons[badge.icon] || <Award size={22} />}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{badge.name}</h3>
                    {userHasBadge && <CheckCircle size={15} color="#10b981" />}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', marginTop: '4px', lineHeight: 1.4 }}>
                    {badge.description}
                  </p>
                  <div style={{ marginTop: '8px', fontSize: '0.78rem', color: userHasBadge ? '#10b981' : 'var(--text-dim)', fontWeight: 600 }}>
                    {userHasBadge ? '✓ Earned' : '🔒 Locked'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Grid: Activity Ledger & Community Leaderboard */}
      <div className="grid-2">
        {/* Activity & Credit History */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <History size={18} color="#38bdf8" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Activity & Credit Ledger</h2>
          </div>

          <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
            {history.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
                No recorded transactions yet.
              </p>
            ) : (
              history.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    fontSize: '0.88rem',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: '#f8fafc' }}>{item.description}</div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {item.amount !== 0 && (
                    <div
                      style={{
                        fontWeight: 700,
                        color: item.amount > 0 ? '#34d399' : '#f87171',
                        fontSize: '0.95rem',
                        flexShrink: 0,
                        marginLeft: '12px',
                      }}
                    >
                      {item.amount > 0 ? `+${item.amount}` : item.amount} cr
                    </div>
                  )}

                  {item.credibilityDelta !== 0 && (
                    <div
                      style={{
                        fontWeight: 700,
                        color: item.credibilityDelta > 0 ? '#a855f7' : '#f87171',
                        fontSize: '0.9rem',
                        flexShrink: 0,
                        marginLeft: '12px',
                      }}
                    >
                      {item.credibilityDelta > 0 ? `+${item.credibilityDelta}` : item.credibilityDelta} AI pts
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Community Leaderboard */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Crown size={18} color="#fbbf24" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Peer Credibility Leaderboard</h2>
          </div>

          <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {leaderboard.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
                Complete sessions to populate the leaderboard.
              </p>
            ) : (
              leaderboard.map((peer, idx) => (
                <div
                  key={peer._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: idx === 0 ? 'rgba(251, 191, 36, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                    border: idx === 0 ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid transparent',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      fontWeight: 800,
                      width: '24px',
                      color: idx === 0 ? '#fbbf24' : idx === 1 ? '#94a3b8' : idx === 2 ? '#b45309' : 'var(--text-dim)',
                    }}>
                      #{idx + 1}
                    </span>
                    <div>
                      <strong style={{ color: '#fff' }}>{peer.name}</strong>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#fbbf24' }}>
                        <span>⭐ {peer.rating?.average ? peer.rating.average.toFixed(1) : '5.0'}</span>
                        <span style={{ color: 'var(--text-dim)' }}>•</span>
                        <span style={{ color: 'var(--text-muted)' }}>{peer.rating?.count || 0} reviews</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a855f7', fontWeight: 700, fontSize: '0.9rem' }}>
                    <ShieldCheck size={16} />
                    <span>{peer.credibilityScore ? peer.credibilityScore.toFixed(1) : 70.0}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
