import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, TrendingUp, UserCheck, X, ArrowUpRight } from 'lucide-react';
import { api } from '../api/client';

const BASE_SUGGESTION_ITEMS = [
  { type: 'skill', label: 'Web Development', category: 'Tech', subtitle: 'React, Node.js, MongoDB', trending: true },
  { type: 'skill', label: 'React', category: 'Tech', subtitle: 'Frontend UI library & Hooks', trending: true },
  { type: 'skill', label: 'Python', category: 'Tech', subtitle: 'Programming & Automation', trending: true },
  { type: 'skill', label: 'Data Science', category: 'Tech', subtitle: 'Python, ML, Pandas', trending: false },
  { type: 'skill', label: 'Machine Learning', category: 'Tech', subtitle: 'Scikit-learn, TensorFlow', trending: true },
  { type: 'skill', label: 'Node.js', category: 'Tech', subtitle: 'Express APIs & WebSockets', trending: false },
  { type: 'skill', label: 'UI/UX Design', category: 'Design', subtitle: 'Figma, Design Systems, Mobile', trending: true },
  { type: 'skill', label: 'Figma', category: 'Design', subtitle: 'Prototyping & Components', trending: false },
  { type: 'skill', label: 'Video Editing', category: 'Design', subtitle: 'Premiere Pro & Storytelling', trending: false },
  { type: 'skill', label: 'DSA (C++)', category: 'Academics', subtitle: 'C++, Algorithms & Problem Solving', trending: true },
  { type: 'skill', label: 'Public Speaking', category: 'Communication', subtitle: 'Confidence & Presentations', trending: false },
  { type: 'skill', label: 'English Speaking', category: 'Languages', subtitle: 'Fluency & Conversation', trending: false },
  { type: 'skill', label: 'Guitar', category: 'Music', subtitle: 'Acoustic & Beginner Chords', trending: false },
  { type: 'tutor', label: 'Rohan Sharma', category: 'Tech', subtitle: 'Web Development • ⭐ 4.8 • Delhi Tech', tutorId: 'rohan-sharma' },
  { type: 'tutor', label: 'Priya Singh', category: 'Design', subtitle: 'UI/UX Design • ⭐ 4.7 • NID / IIT', tutorId: 'priya-singh' },
  { type: 'tutor', label: 'Aman Verma', category: 'Tech', subtitle: 'Data Science • ⭐ 4.9 • BITS Pilani', tutorId: 'aman-verma' },
  { type: 'tutor', label: 'Kritika Jain', category: 'Design', subtitle: 'Video Editing • ⭐ 4.9 • Delhi Univ', tutorId: 'kritika-jain' },
  { type: 'tutor', label: 'Aditya Rao', category: 'Music', subtitle: 'Guitar • ⭐ 4.8 • IIT Bombay', tutorId: 'aditya-rao' },
  { type: 'tutor', label: 'Arjun Mehta', category: 'Communication', subtitle: 'Public Speaking • ⭐ 4.9 • SRCC', tutorId: 'arjun-mehta' },
  { type: 'tutor', label: 'Nidhi Kapoor', category: 'Languages', subtitle: 'English Speaking • ⭐ 4.7 • Ashoka Univ', tutorId: 'nidhi-kapoor' },
  { type: 'tutor', label: 'Rahul Yadav', category: 'Academics', subtitle: 'DSA (C++) • ⭐ 4.8 • DTU CSE', tutorId: 'rahul-yadav' },
];

/**
 * Shared rectangular search input with instant autocomplete suggestions
 * for skills, AI trending tracks, and verified tutors.
 */
export const SkillSearchAutocomplete = ({
  value,
  onChange,
  onSelectSuggestion,
  onSubmit,
  placeholder = 'Search skills (e.g. Web Development, Python, Design...)',
  variant = 'hero', // 'hero' | 'explore'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [trendingNames, setTrendingNames] = useState(new Set());
  const containerRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    api.ai
      .getTrendingSkills(6)
      .then((res) => {
        if (!mounted || !res?.trending) return;
        setTrendingNames(new Set(res.trending.map((t) => t.skill.toLowerCase())));
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const query = (value || '').trim().toLowerCase();

  const suggestions = BASE_SUGGESTION_ITEMS.filter((item) => {
    if (!query) {
      // Show top trending skills + featured tutors before user types
      return item.trending || item.label === 'Rohan Sharma' || item.label === 'Priya Singh';
    }
    return (
      item.label.toLowerCase().includes(query) ||
      item.subtitle.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  }).slice(0, 7);

  const handleChoose = (item) => {
    onChange(item.label);
    setIsOpen(false);
    setHighlightedIndex(-1);
    onSelectSuggestion?.(item);
  };

  const handleKeyDown = (e) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      if (isOpen && highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        e.preventDefault();
        handleChoose(suggestions[highlightedIndex]);
      } else {
        setIsOpen(false);
        onSubmit?.(e);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const isHero = variant === 'hero';

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        flex: isHero ? undefined : 1,
        minWidth: isHero ? undefined : '260px',
        maxWidth: isHero ? '540px' : undefined,
        marginBottom: isHero ? '24px' : 0,
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsOpen(false);
          onSubmit?.(e);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          background: '#ffffff',
          border: isHero ? '2px solid #0d9488' : '1px solid #cbd5e1',
          padding: isHero ? '6px 8px 6px 16px' : '4px 10px 4px 14px',
          boxShadow: isHero ? '0 4px 14px rgba(13, 148, 136, 0.12)' : '0 1px 2px rgba(0,0,0,0.03)',
        }}
      >
        {!isHero && <Search size={18} color="#64748b" style={{ marginRight: '10px', flexShrink: 0 }} />}

        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          aria-label="Search skills or tutors"
          aria-expanded={isOpen}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
            fontSize: isHero ? '0.98rem' : '0.94rem',
            color: '#0f172a',
            background: 'transparent',
            padding: '8px 0',
          }}
        />

        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              setIsOpen(true);
              setHighlightedIndex(-1);
            }}
            style={{
              padding: '6px',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: isHero ? '4px' : 0,
            }}
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}

        {isHero && (
          <button
            type="submit"
            style={{
              background: '#0d9488',
              color: '#ffffff',
              border: 'none',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            title="Search"
          >
            <Search size={20} />
          </button>
        )}
      </form>

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#ffffff',
            border: '1px solid #0d9488',
            borderTop: 'none',
            boxShadow: '0 16px 32px rgba(15, 23, 42, 0.14)',
            zIndex: 200,
            maxHeight: '340px',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              padding: '7px 14px',
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              fontSize: '0.73rem',
              fontWeight: 800,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>{query ? `Suggestions for "${value}"` : 'Trending & Suggested Searches'}</span>
            <span style={{ color: '#0d9488' }}>Click or Enter ↵</span>
          </div>

          {suggestions.length === 0 ? (
            <div style={{ padding: '16px 14px', fontSize: '0.88rem', color: '#64748b' }}>
              No exact suggestions match <strong>"{value}"</strong>. Press Enter to run full search or try{' '}
              <button
                type="button"
                onMouseDown={() => handleChoose(BASE_SUGGESTION_ITEMS[0])}
                style={{ color: '#0d9488', fontWeight: 700, textDecoration: 'underline' }}
              >
                Web Development
              </button>
              .
            </div>
          ) : (
            suggestions.map((item, idx) => {
              const isHighlighted = idx === highlightedIndex;
              const isLiveTrending = item.trending || trendingNames.has(item.label.toLowerCase());

              return (
                <button
                  key={`${item.type}-${item.label}`}
                  type="button"
                  role="option"
                  aria-selected={isHighlighted}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleChoose(item);
                  }}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    textAlign: 'left',
                    background: isHighlighted ? '#f0fdfa' : '#ffffff',
                    borderBottom: '1px solid #f1f5f9',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        background: item.type === 'tutor' ? '#eff6ff' : '#f0fdfa',
                        color: item.type === 'tutor' ? '#2563eb' : '#0d9488',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {item.type === 'tutor' ? (
                        <UserCheck size={15} />
                      ) : isLiveTrending ? (
                        <TrendingUp size={15} />
                      ) : (
                        <Sparkles size={15} />
                      )}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                        {item.label}
                      </div>
                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: '#64748b',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        background: item.type === 'tutor' ? '#dbeafe' : isLiveTrending ? '#fef3c7' : '#f1f5f9',
                        color: item.type === 'tutor' ? '#1d4ed8' : isLiveTrending ? '#b45309' : '#475569',
                      }}
                    >
                      {item.type === 'tutor' ? 'Tutor' : isLiveTrending ? 'Trending' : item.category}
                    </span>
                    <ArrowUpRight size={14} color="#94a3b8" />
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
