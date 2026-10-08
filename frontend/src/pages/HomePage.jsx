import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Code,
  Palette,
  Video,
  Coins,
} from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    image: '/anime_slide_1.jpg',
    tag: 'SCENE 01 • THE LEARNING GOAL',
    character: 'Akane (Frontend Dev)',
    roleIcon: <Code size={16} color="#38bdf8" />,
    badgeColor: '#38bdf8',
    headline: '“I wrote the code, but my UI looks plain. I need 1-on-1 design mentorship!”',
    summary: 'Posts "UI/UX Design" to her Skill Swap learning wishlist.',
  },
  {
    id: 2,
    image: '/anime_slide_2.jpg',
    tag: 'SCENE 02 • THE TALENT MATCH',
    character: 'Kaito (Product Designer)',
    roleIcon: <Palette size={16} color="#10b981" />,
    badgeColor: '#10b981',
    headline: '“I teach Figma design systems. In exchange, teach me Python scripting!”',
    summary: 'AI Engine detects mutual synergy and connects them for direct skill swap.',
  },
  {
    id: 3,
    image: '/anime_slide_3.jpg',
    tag: 'SCENE 03 • LIVE P2P WEBRTC SESSION',
    character: 'Interactive Video Room',
    roleIcon: <Video size={16} color="#c084fc" />,
    badgeColor: '#c084fc',
    headline: '“Connecting peer-to-peer with zero lag: Screen sharing and code review!”',
    summary: 'Live browser WebRTC video room with real-time audio and whiteboard.',
  },
  {
    id: 4,
    image: '/anime_slide_4.jpg',
    tag: 'SCENE 04 • LEVEL UP & REPUTATION',
    character: 'Zero-Dollar Skill Swap!',
    roleIcon: <Coins size={16} color="#fbbf24" />,
    badgeColor: '#fbbf24',
    headline: '“Level Up! Credits exchanged, badges earned, and AI Credibility boosted!”',
    summary: 'No money needed. Credits transfer automatically and AI Score hits 98%!',
  },
];

export const HomePage = ({ onStartDashboard }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showCaptions, setShowCaptions] = useState(true);

  // Never-ending slideshow loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
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
      height: '100vh',
      width: '100vw',
      backgroundColor: '#000000',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      {/* 1. Fully Visible, Never-Ending Anime Slideshow Background */}
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
              opacity: index === currentSlide ? 0.90 : 0,
              transition: 'opacity 1.0s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: index === currentSlide ? 'scale(1.03)' : 'scale(1)',
              transitionProperty: 'opacity, transform',
              transitionDuration: '1.0s, 7s',
            }}
          >
            <img
              src={s.image}
              alt={s.character}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'contrast(1.08) brightness(0.96)',
              }}
            />
          </div>
        ))}

        {/* Soft edge gradients so controls remain readable while center artwork stays 100% visible */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '180px',
          background: 'linear-gradient(0deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* 2. Sleek Top Bar (Minimalist) */}
      <header style={{
        position: 'relative',
        zIndex: 20,
        padding: '18px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src="/logo.png"
            alt="Skill Swap Logo"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              objectFit: 'contain',
              background: '#ffffff',
              padding: '3px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
            }}
          />
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
              Skill Swap
            </div>
            <div style={{ fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 500, textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>
              Peer-to-Peer Learning Platform
            </div>
          </div>
        </div>

        {/* Quick Slide Navigation Dots in Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(10px)',
          padding: '6px 14px',
          borderRadius: '9999px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              style={{
                width: idx === currentSlide ? '22px' : '7px',
                height: '6px',
                borderRadius: '4px',
                background: idx === currentSlide ? s.badgeColor : 'rgba(255, 255, 255, 0.35)',
                transition: 'all 0.25s ease',
              }}
              title={`Jump to Scene ${idx + 1}`}
            />
          ))}

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              background: 'none',
              color: '#cbd5e1',
              display: 'flex',
              alignItems: 'center',
              padding: '2px 4px',
              marginLeft: '4px',
            }}
            title={isPlaying ? 'Pause slideshow' : 'Auto-play slideshow'}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
          </button>
        </div>
      </header>

      {/* 3. Center Screen is Completely Clear for Unobstructed Anime Visuals */}
      <div style={{ flex: 1, pointerEvents: 'none' }} />

      {/* 4. Bottom Presentation Deck: Compact Subtitle HUD on Left, Glowing Button in Center/Right */}
      <footer style={{
        position: 'relative',
        zIndex: 20,
        padding: '20px 36px 28px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
      }}>
        {/* Left: Compact, Highly Transparent Anime Subtitle HUD */}
        {showCaptions ? (
          <div className="anime-subtitle-hud">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: slide.badgeColor,
                  letterSpacing: '0.04em',
                }}>
                  {slide.roleIcon}
                  <span>{slide.tag}</span>
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>• {slide.character}</span>
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={handlePrev}
                  className="btn-outline"
                  style={{ padding: '4px 6px', borderRadius: '50%', color: '#fff' }}
                  title="Previous"
                >
                  <ChevronLeft size={12} />
                </button>
                <button
                  onClick={handleNext}
                  className="btn-outline"
                  style={{ padding: '4px 6px', borderRadius: '50%', color: '#fff' }}
                  title="Next"
                >
                  <ChevronRight size={12} />
                </button>
                <button
                  onClick={() => setShowCaptions(false)}
                  className="btn-outline"
                  style={{ padding: '4px 6px', borderRadius: '50%', color: '#94a3b8' }}
                  title="Hide subtitles"
                >
                  <EyeOff size={12} />
                </button>
              </div>
            </div>

            {/* Compact Headline */}
            <p style={{
              fontSize: '0.88rem',
              fontWeight: 600,
              color: '#ffffff',
              lineHeight: 1.35,
              textShadow: '0 1px 4px rgba(0,0,0,0.8)',
            }}>
              {slide.headline}
            </p>
          </div>
        ) : (
          <button
            onClick={() => setShowCaptions(true)}
            className="btn-outline"
            style={{
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              color: '#fff',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Eye size={13} />
            <span>Show Story Subtitles</span>
          </button>
        )}

        {/* Right: The High-Focus Glowing Presentation Button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <div style={{
            fontSize: '0.74rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            color: '#38bdf8',
            textTransform: 'uppercase',
            textShadow: '0 0 12px rgba(56, 189, 248, 0.8)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} />
            <span>Click to Launch Presentation</span>
          </div>

          <button
            onClick={onStartDashboard}
            className="glowing-start-btn"
            title="Enter Skill Swap Dashboard"
          >
            <Sparkles size={20} color="#000000" />
            <span>Enter Skill Swap Dashboard</span>
            <ArrowRight size={20} color="#000000" />
          </button>
        </div>
      </footer>
    </div>
  );
};
