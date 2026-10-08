import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Repeat,
  ShieldCheck,
  Coins,
  Video,
  Code,
  Palette,
  CheckCircle,
} from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    image: '/anime_slide_1.jpg',
    tag: 'SCENE 01 • THE LEARNING GOAL',
    character: 'Akane (Frontend Developer)',
    roleIcon: <Code size={20} color="#38bdf8" />,
    badgeColor: '#38bdf8',
    headline: '“I wrote the code, but my UI looks plain. I need a real design mentor!”',
    summary:
      'Akane is building an AI dashboard in React. Instead of paying hundreds for expensive courses, she posts UI/UX Design to her Skill Swap wishlist.',
    actionPill: 'Goal: Master Figma & Design Systems',
  },
  {
    id: 2,
    image: '/anime_slide_2.jpg',
    tag: 'SCENE 02 • THE TALENT MATCH',
    character: 'Kaito (Product Designer)',
    roleIcon: <Palette size={20} color="#10b981" />,
    badgeColor: '#10b981',
    headline: '“I teach Figma design systems. In return, teach me Python scripting!”',
    summary:
      'Kaito offers UI/UX teaching at 20 credits/hr. Skill Swap’s AI engine detects the mutual synergy and connects them for a direct skill exchange.',
    actionPill: 'Offering: UI/UX • Learning: Python',
  },
  {
    id: 3,
    image: '/anime_slide_3.jpg',
    tag: 'SCENE 03 • LIVE P2P WEBRTC SESSION',
    character: 'Interactive Video Room',
    roleIcon: <Video size={20} color="#c084fc" />,
    badgeColor: '#c084fc',
    headline: '“Connecting peer-to-peer with zero lag: Screen sharing and code collaboration!”',
    summary:
      'Akane and Kaito hop directly into a browser-based WebRTC video room with real-time audio, screen sharing, and interactive whiteboard feedback.',
    actionPill: 'Live P2P Stream • 60-min Exchange',
  },
  {
    id: 4,
    image: '/anime_slide_4.jpg',
    tag: 'SCENE 04 • LEVEL UP & REPUTATION',
    character: 'Zero-Dollar Skill Swap!',
    roleIcon: <Coins size={20} color="#fbbf24" />,
    badgeColor: '#fbbf24',
    headline: '“Level Up! Credits exchanged, badges earned, and AI Credibility boosted!”',
    summary:
      'No money needed. Credits automatically transfer from learner to tutor. A 5-star peer review raises Kaito’s AI Credibility Score to 98%!',
    actionPill: '+20 Credits Earned • AI Score: 98%',
  },
];

export const HomePage = ({ onStartDashboard }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Never-ending slideshow loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const slide = SLIDES[currentSlide];

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#000000',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      {/* 1. Never-Ending Slideshow Background Layers (Visible & Cinematic) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
      }}>
        {SLIDES.map((s, index) => (
          <div
            key={s.id}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: index === currentSlide ? 0.72 : 0,
              transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: index === currentSlide ? 'scale(1.04)' : 'scale(1)',
              transitionProperty: 'opacity, transform',
              transitionDuration: '1.2s, 8s',
            }}
          >
            <img
              src={s.image}
              alt={s.character}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'contrast(1.1) brightness(0.95)',
              }}
            />
          </div>
        ))}

        {/* Cinematic Vignettes to blend cleanly into pure black */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 35%, rgba(0,0,0,0.4) 65%, #000000 100%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,0,0,0.8) 100%)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* 2. Top Header Bar */}
      <header style={{
        position: 'relative',
        zIndex: 10,
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, transparent 100%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src="/logo.png"
            alt="Skill Swap"
            style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'contain', background: '#fff', padding: '3px' }}
          />
          <div>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              Skill Swap
            </span>
            <span style={{ display: 'block', fontSize: '0.74rem', color: '#a1a1aa', fontWeight: 500 }}>
              Peer-to-Peer Learning & Skill Exchange
            </span>
          </div>
        </div>

        {/* Direct Start Animation / Dashboard Button */}
        <button
          onClick={onStartDashboard}
          className="btn-primary"
          style={{
            padding: '11px 24px',
            fontSize: '0.95rem',
            fontWeight: 700,
            borderRadius: '9999px',
            boxShadow: '0 0 24px rgba(255, 255, 255, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span>Launch Dashboard</span>
          <ArrowRight size={16} />
        </button>
      </header>

      {/* 3. Center Cinematic Stage: Active Anime Story Card */}
      <main style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1020px',
        margin: 'auto',
        padding: '20px 24px',
        width: '100%',
      }}>
        <div
          style={{
            background: 'rgba(10, 10, 14, 0.88)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${slide.badgeColor}45`,
            borderRadius: '20px',
            padding: '36px 40px',
            boxShadow: `0 24px 60px rgba(0, 0, 0, 0.95), 0 0 40px ${slide.badgeColor}25`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Neon Top Accent Line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, transparent, ${slide.badgeColor}, transparent)`,
          }} />

          {/* Top Tag & Character */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: `1px solid ${slide.badgeColor}60`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {slide.roleIcon}
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: slide.badgeColor, letterSpacing: '0.06em' }}>
                  {slide.tag}
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                  {slide.character}
                </h3>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: `1px solid ${slide.badgeColor}35`,
              color: slide.badgeColor,
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              fontWeight: 700,
            }}>
              ✓ {slide.actionPill}
            </div>
          </div>

          {/* Headline Dialogue */}
          <h2 style={{
            fontSize: '1.65rem',
            fontWeight: 800,
            color: '#f8fafc',
            lineHeight: 1.35,
            letterSpacing: '-0.02em',
            marginBottom: '14px',
          }}>
            {slide.headline}
          </h2>

          {/* Story Narrative */}
          <p style={{
            fontSize: '1.05rem',
            color: '#d4d4d8',
            lineHeight: 1.6,
            maxWidth: '820px',
            marginBottom: '28px',
          }}>
            {slide.summary}
          </p>

          {/* Bottom Controls & Main Call-to-Action */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            {/* Play/Pause & Slideshow Nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={handlePrev}
                  className="btn-outline"
                  style={{ padding: '8px', borderRadius: '50%', color: '#fff' }}
                  title="Previous slide"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNext}
                  className="btn-outline"
                  style={{ padding: '8px', borderRadius: '50%', color: '#fff' }}
                  title="Next slide"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="btn-outline"
                style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                <span>{isPlaying ? 'Auto-Playing' : 'Paused'}</span>
              </button>

              {/* Slide Progress Dots */}
              <div style={{ display: 'flex', gap: '6px', marginLeft: '6px' }}>
                {SLIDES.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSlide(idx)}
                    style={{
                      width: idx === currentSlide ? '28px' : '9px',
                      height: '7px',
                      borderRadius: '5px',
                      background: idx === currentSlide ? slide.badgeColor : 'rgba(255, 255, 255, 0.25)',
                      transition: 'all 0.3s ease',
                    }}
                    title={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Presentation Main Start Button */}
            <button
              onClick={onStartDashboard}
              style={{
                background: 'linear-gradient(135deg, #ffffff, #e2e8f0)',
                color: '#000000',
                fontWeight: 800,
                fontSize: '1rem',
                padding: '14px 28px',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 6px 25px rgba(255, 255, 255, 0.4)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 10px 35px rgba(255, 255, 255, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 6px 25px rgba(255, 255, 255, 0.4)';
              }}
            >
              <Sparkles size={18} color="#000" />
              <span>Enter Skill Swap Dashboard</span>
              <ArrowRight size={18} color="#000" />
            </button>
          </div>
        </div>
      </main>

      {/* 4. Bottom Footer Info Bar */}
      <footer style={{
        position: 'relative',
        zIndex: 10,
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        background: 'linear-gradient(0deg, rgba(0,0,0,0.95) 0%, transparent 100%)',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>⚡ Real-Time WebRTC Video</span>
          <span>🪙 Gamified Credit Exchange</span>
          <span>🛡️ AI Credibility Scoring</span>
        </div>

        <div>
          <span>Press <strong>Enter Dashboard</strong> to begin live demo</span>
        </div>
      </footer>
    </div>
  );
};
