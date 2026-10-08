import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Code,
  Palette,
  Video,
  Coins,
  ShieldCheck,
  Play,
  Pause,
  Repeat,
} from 'lucide-react';

const EXPLAINER_STEPS = [
  {
    id: 1,
    tag: 'Step 1: The Request',
    character: 'Aoi (Frontend Dev)',
    avatarBg: '#38bdf8',
    icon: <Code size={20} color="#38bdf8" />,
    dialogue: '“I built a React app, but my design looks plain. I need 1-on-1 mentorship in Figma & UI/UX!”',
    action: 'Selects "UI/UX Design" on Learner Wishlist',
    highlight: '#38bdf8',
  },
  {
    id: 2,
    tag: 'Step 2: Peer Discovery',
    character: 'Ren (UI/UX Designer)',
    avatarBg: '#10b981',
    icon: <Palette size={20} color="#10b981" />,
    dialogue: '“I teach Figma design systems! In exchange, I want to learn Python scripting for automation.”',
    action: 'Matched via AI Skill Engine • 20 credits/hr',
    highlight: '#10b981',
  },
  {
    id: 3,
    tag: 'Step 3: Live Video Swap',
    character: 'Interactive WebRTC Session',
    avatarBg: '#a855f7',
    icon: <Video size={20} color="#c084fc" />,
    dialogue: '“Connecting in low-latency P2P video room: Screen sharing design tokens and review in real time!”',
    action: '60-min interactive session completed',
    highlight: '#c084fc',
  },
  {
    id: 4,
    tag: 'Step 4: Fair Value & Credibility',
    character: 'Skill Swapped!',
    avatarBg: '#fbbf24',
    icon: <Coins size={20} color="#fbbf24" />,
    dialogue: '“Credits transferred! 5★ Peer Review submitted: Ren’s AI Credibility Score increased to 92.5!”',
    action: '+20 credits earned • Badge unlocked',
    highlight: '#fbbf24',
  },
];

export const AnimeAmbientBackdrop = () => (
  <div className="anime-background-container" aria-hidden="true">
    <img
      src="/anime_bg.jpg"
      alt="Skill Swap Anime Scene"
      className="anime-background-image"
    />
    <div className="anime-grid-lines" />
    <div className="anime-vignette" />
  </div>
);

export const AnimeHeroBackground = ({ onExploreClick }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % EXPLAINER_STEPS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const step = EXPLAINER_STEPS[currentStepIndex];

  return (
    <div className="anime-explainer-banner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.76rem',
                fontWeight: 700,
                color: '#e4e4e7',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              <Repeat size={12} color="#38bdf8" /> How Skill Swap Works
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
              Continuous Peer-to-Peer Story
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Step Indicators */}
            <div style={{ display: 'flex', gap: '5px' }}>
              {EXPLAINER_STEPS.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentStepIndex(idx)}
                  style={{
                    width: idx === currentStepIndex ? '24px' : '8px',
                    height: '6px',
                    borderRadius: '4px',
                    background: idx === currentStepIndex ? s.highlight : 'rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.25s ease',
                  }}
                  title={`Jump to step ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="btn-outline"
              style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              title={isPlaying ? 'Pause animation' : 'Play animation'}
            >
              {isPlaying ? <Pause size={12} /> : <Play size={12} />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
          </div>
        </div>

        {/* Story Card Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 1fr) auto',
          gap: '20px',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: `1px solid ${step.highlight}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {step.icon}
              </div>
              <div>
                <strong style={{ fontSize: '0.95rem', color: '#ffffff' }}>{step.character}</strong>
                <div style={{ fontSize: '0.75rem', color: step.highlight, fontWeight: 600 }}>
                  {step.tag}
                </div>
              </div>
            </div>

            <p style={{
              fontSize: '0.94rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              fontStyle: 'italic',
              marginTop: '4px',
            }}>
              {step.dialogue}
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: step.highlight,
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '3px 10px',
              borderRadius: 'var(--radius-pill)',
              marginTop: '10px',
              border: `1px solid ${step.highlight}30`,
            }}>
              ✓ {step.action}
            </div>
          </div>

          {/* Quick Action Button */}
          {onExploreClick && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
              <button
                onClick={onExploreClick}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
              >
                <span>Find Your Match</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
  );
};
