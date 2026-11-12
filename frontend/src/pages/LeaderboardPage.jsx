import React, { useState, useEffect, useCallback } from 'react';
import {
  Award,
  BookOpen,
  Zap,
  Shield,
  Flame,
  Lock,
  ShieldCheck,
  Gift,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { getAvatarSrc } from '../utils/avatars';

const FALLBACK_LEADERBOARD = [
  { _id: 'demo-1', name: 'Aman Verma', avatar: '/avatars/aman.svg', credits: 420, credibilityScore: 94.5, rating: { average: 4.9, count: 31 } },
  { _id: 'demo-2', name: 'Rohan Sharma', avatar: '/avatars/rohan.svg', credits: 380, credibilityScore: 92.0, rating: { average: 4.8, count: 25 } },
  { _id: 'demo-3', name: 'Priya Singh', avatar: '/avatars/priya.svg', credits: 240, credibilityScore: 89.5, rating: { average: 4.7, count: 18 } },
  { _id: 'demo-4', name: 'Kritika Jain', avatar: '/avatars/kritika.svg', credits: 210, credibilityScore: 88.0, rating: { average: 4.9, count: 15 } },
];

export const LeaderboardPage = () => {
  const { user, refreshUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [history, setHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [claimingBonus, setClaimingBonus] = useState(false);
  const [bonusToast, setBonusToast] = useState('');

  const fetchGamificationData = useCallback(async () => {
    try {
      const lbRes = await api.gamification.getLeaderboard().catch(() => null);
      if (lbRes?.leaderboard?.length > 0) {
        setLeaderboard(lbRes.leaderboard);
      } else {
        setLeaderboard(FALLBACK_LEADERBOARD);
      }

      if (user) {
        const histRes = await api.gamification.getHistory().catch(() => null);
        if (histRes?.success) {
          setStats(histRes.stats);
          setEarnedBadges(histRes.badges || []);
          setHistory(histRes.history || []);
        }
      }
    } catch (err) {
      console.warn('Gamification fetch error:', err.message);
    }
  }, [user]);

  useEffect(() => {
    fetchGamificationData();
  }, [fetchGamificationData]);

  const handleClaimDailyBonus = async () => {
    if (!user) return;
    setClaimingBonus(true);
    try {
      const res = await api.gamification.claimDailyBonus();
      await refreshUser();
      await fetchGamificationData();
      setBonusToast(res.message || '+10 daily credits claimed!');
      setTimeout(() => setBonusToast(''), 4000);
    } catch (err) {
      setBonusToast(err.message || 'Already claimed today');
      setTimeout(() => setBonusToast(''), 3500);
    } finally {
      setClaimingBonus(false);
    }
  };

  const earnedNames = new Set((earnedBadges.length ? earnedBadges : user?.badges || []).map((b) => b.name.toLowerCase()));

  const badgeCatalog = [
    {
      id: 'pioneer',
      name: 'Pioneer',
      desc: 'Joined Skill Swap peer network',
      icon: <Award size={28} color="#0d9488" />,
      bg: '#f0fdfa',
      unlocked: earnedNames.has('pioneer') || Boolean(user),
    },
    {
      id: 'first-step',
      name: 'First Step',
      desc: 'Complete your first session',
      icon: <CheckCircle2 size={28} color="#cd7f32" />,
      bg: '#fef3c7',
      unlocked: earnedNames.has('first step'),
    },
    {
      id: 'helper',
      name: 'Helper',
      desc: 'Mentor peers in live sessions',
      icon: <Shield size={28} color="#0284c7" />,
      bg: '#f0f9ff',
      unlocked: earnedNames.has('helper'),
    },
    {
      id: 'consistent',
      name: 'Consistent',
      desc: 'Daily active check-in streak',
      icon: <Flame size={28} color="#f59e0b" />,
      bg: '#fffbeb',
      unlocked: earnedNames.has('consistent') || earnedNames.has('consistent scholar'),
    },
    {
      id: 'active-reviewer',
      name: 'Active Reviewer',
      desc: 'Submit verified peer feedback',
      icon: <ShieldCheck size={28} color="#8b5cf6" />,
      bg: '#f5f3ff',
      unlocked: earnedNames.has('active reviewer') || earnedNames.has('top rated peer') || earnedNames.has('5-star mentor'),
    },
  ];

  const displayCredits = stats?.credits ?? user?.credits ?? 250;
  const displayCredibility = stats?.credibilityScore ?? user?.credibilityScore ?? 70.0;
  const displayBadgesCount = earnedBadges.length || user?.badges?.length || badgeCatalog.filter((b) => b.unlocked).length;
  const displaySessions = stats?.completedSessions ?? 0;

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '32px 20px 80px' }}>
      {/* Header + Daily Participation Bonus */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 900, color: '#0f172a' }}>
            Gamification, Badges & Leaderboard
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '4px' }}>
            Earn credits, unlock badges, and build your AI Credibility Score through active peer sessions and feedback.
          </p>
        </div>

        {user && (
          <button
            onClick={handleClaimDailyBonus}
            disabled={claimingBonus || stats?.dailyClaimedToday}
            className={stats?.dailyClaimedToday ? 'btn-outline-gray' : 'btn-teal'}
            style={{ padding: '10px 18px', gap: '8px', fontSize: '0.88rem' }}
          >
            <Gift size={17} />
            <span>
              {stats?.dailyClaimedToday
                ? '✓ Daily Bonus Claimed'
                : claimingBonus
                ? 'Claiming...'
                : 'Claim Daily Check-in (+10 Credits)'}
            </span>
          </button>
        )}
      </div>

      {bonusToast && (
        <div
          style={{
            background: '#f0fdfa',
            border: '1px solid #0d9488',
            color: '#0f766e',
            padding: '10px 16px',
            marginBottom: '20px',
            fontWeight: 700,
            fontSize: '0.9rem',
          }}
        >
          🎉 {bonusToast}
        </div>
      )}

      {/* 4 Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px',
          marginBottom: '36px',
        }}
      >
        <div className="clean-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ background: '#fef3c7', padding: '12px', color: '#f59e0b' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a' }}>{displayBadgesCount}</div>
            <div style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600 }}>Badges Earned</div>
          </div>
        </div>

        <div className="clean-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid #06b6d4' }}>
          <div style={{ background: '#ecfeff', padding: '12px', color: '#06b6d4' }}>
            <span style={{ fontSize: '1.4rem' }}>🪙</span>
          </div>
          <div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a' }}>{displayCredits}</div>
            <div style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600 }}>Credit Balance</div>
          </div>
        </div>

        <div className="clean-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ background: '#f5f3ff', padding: '12px', color: '#8b5cf6' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a' }}>{displayCredibility} / 100</div>
            <div style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600 }}>AI Credibility Score</div>
          </div>
        </div>

        <div className="clean-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid #0d9488' }}>
          <div style={{ background: '#f0fdfa', padding: '12px', color: '#0d9488' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a' }}>{displaySessions}</div>
            <div style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600 }}>Sessions Completed</div>
          </div>
        </div>
      </div>

      {/* 2. Badges Section */}
      <div style={{ marginBottom: '44px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '18px' }}>
          Achievement Badges
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          {badgeCatalog.map((b) => (
            <div
              key={b.id}
              className="clean-card"
              style={{
                textAlign: 'center',
                padding: '24px 16px',
                opacity: b.unlocked ? 1 : 0.65,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                borderTop: b.unlocked ? '3px solid #0d9488' : '3px solid #cbd5e1',
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  background: b.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '6px',
                }}
              >
                {b.unlocked ? b.icon : <Lock size={28} color="#94a3b8" />}
              </div>
              <strong style={{ fontSize: '0.98rem', color: '#0f172a' }}>{b.name}</strong>
              <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.3 }}>{b.desc}</p>
              <span
                style={{
                  marginTop: '6px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: b.unlocked ? '#0d9488' : '#94a3b8',
                }}
              >
                {b.unlocked ? '✓ Unlocked' : '🔒 Locked'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Community Leaderboard & Recent Rewards Ledger */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '18px' }}>
            Top Community Learners & Tutors
          </h2>

          <div className="clean-card" style={{ padding: '8px 16px' }}>
            {leaderboard.map((s, index) => {
              const rank = index + 1;
              const isSelf = user && String(s._id) === String(user._id);
              const avgRating = s.rating?.average ?? 0;

              return (
                <div
                  key={s._id || s.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 12px',
                    background: isSelf ? '#f0fdfa' : 'transparent',
                    borderBottom: rank === leaderboard.length ? 'none' : '1px solid #f1f5f9',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 900,
                        width: '28px',
                        color: rank === 1 ? '#f59e0b' : rank === 2 ? '#64748b' : rank === 3 ? '#b45309' : '#94a3b8',
                      }}
                    >
                      #{rank}
                    </span>

                    <img
                      src={getAvatarSrc(s.avatar, s.name)}
                      alt={s.name}
                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    />

                    <div>
                      <strong style={{ fontSize: '0.94rem', color: '#0f172a' }}>
                        {s.name} {isSelf && '(You)'}
                      </strong>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        🛡️ AI Score: <strong style={{ color: '#0f766e' }}>{s.credibilityScore ?? 70}</strong> • ⭐ {avgRating > 0 ? avgRating.toFixed(1) : 'New'}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0d9488' }}>
                    🪙 {s.credits ?? 100}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gamification & Feedback Activity Ledger */}
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '18px' }}>
            Rewards & Credibility Ledger
          </h2>

          <div className="clean-card" style={{ padding: '16px' }}>
            {!user ? (
              <div style={{ color: '#64748b', fontSize: '0.9rem', padding: '20px 8px', textAlign: 'center' }}>
                Sign in to view your personal credit transactions, badge unlocks, and live AI Credibility history.
              </div>
            ) : history.length === 0 ? (
              <div style={{ color: '#64748b', fontSize: '0.9rem', padding: '20px 8px', textAlign: 'center' }}>
                No activity recorded yet. Claim your daily check-in above or complete a session!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '360px', overflowY: 'auto' }}>
                {history.slice(0, 12).map((item) => (
                  <div
                    key={item._id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 12px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      gap: '10px',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                        {item.description}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Clock size={12} />
                        <span>{new Date(item.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        whiteSpace: 'nowrap',
                        color:
                          item.type === 'credit_spent'
                            ? '#dc2626'
                            : item.type === 'credibility_updated'
                            ? '#7c3aed'
                            : '#0d9488',
                      }}
                    >
                      {item.amount > 0
                        ? `+${item.amount} Credits`
                        : item.amount < 0
                        ? `${item.amount} Credits`
                        : item.credibilityDelta
                        ? `${item.credibilityDelta > 0 ? '+' : ''}${item.credibilityDelta} AI`
                        : item.badgeName
                        ? `🏆 ${item.badgeName}`
                        : 'Updated'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
