import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Heart, Star, Sparkles } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { SkillSearchAutocomplete } from '../components/SkillSearchAutocomplete';

export const ExplorePage = ({ onSelectTutor, onBookTutor, onNavigate, initialSearch = '' }) => {
  const { user } = useAuth();
  const [search, setSearch] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState('All');
  const [favorites, setFavorites] = useState({});
  const [aiMatchedScores, setAiMatchedScores] = useState({});
  const [aiSortActive, setAiSortActive] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiEngineLabel, setAiEngineLabel] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  const categories = [
    'All',
    'Tech',
    'Design',
    'Languages',
    'Music',
    'Communication',
    'Academics',
    'Others',
  ];

  const allTutors = [
    {
      id: 'rohan-sharma',
      skill: 'Web Development',
      name: 'Rohan Sharma',
      college: 'Delhi Tech',
      avatar: '/avatars/rohan.svg',
      rating: 4.8,
      reviewsCount: 25,
      tags: ['React', 'Node.js'],
      category: 'Tech',
    },
    {
      id: 'priya-singh',
      skill: 'UI/UX Design',
      name: 'Priya Singh',
      college: 'NID / IIT',
      avatar: '/avatars/priya.svg',
      rating: 4.7,
      reviewsCount: 18,
      tags: ['Figma', 'Design'],
      category: 'Design',
    },
    {
      id: 'aman-verma',
      skill: 'Data Science',
      name: 'Aman Verma',
      college: 'BITS Pilani',
      avatar: '/avatars/aman.svg',
      rating: 4.9,
      reviewsCount: 31,
      tags: ['Python', 'ML'],
      category: 'Tech',
    },
    {
      id: 'kritika-jain',
      skill: 'Video Editing',
      name: 'Kritika Jain',
      college: 'Delhi Univ',
      avatar: '/avatars/kritika.svg',
      rating: 4.9,
      reviewsCount: 15,
      tags: ['Premiere Pro', 'Editing'],
      category: 'Design',
    },
    {
      id: 'aditya-rao',
      skill: 'Guitar',
      name: 'Aditya Rao',
      college: 'IIT Bombay',
      avatar: '/avatars/aditya.svg',
      rating: 4.8,
      reviewsCount: 12,
      tags: ['Music', 'Beginner Friendly'],
      category: 'Music',
    },
    {
      id: 'arjun-mehta',
      skill: 'Public Speaking',
      name: 'Arjun Mehta',
      college: 'SRCC',
      avatar: '/avatars/arjun.svg',
      rating: 4.9,
      reviewsCount: 12,
      tags: ['Communication', 'Confidence'],
      category: 'Communication',
    },
    {
      id: 'nidhi-kapoor',
      skill: 'English Speaking',
      name: 'Nidhi Kapoor',
      college: 'Ashoka Univ',
      avatar: '/avatars/nidhi.svg',
      rating: 4.7,
      reviewsCount: 19,
      tags: ['English', 'Conversation'],
      category: 'Languages',
    },
    {
      id: 'rahul-yadav',
      skill: 'DSA (C++)',
      name: 'Rahul Yadav',
      college: 'DTU CSE',
      avatar: '/avatars/rahul.svg',
      rating: 4.8,
      reviewsCount: 26,
      tags: ['C++', 'Problem Solving'],
      category: 'Academics',
    },
  ];

  const filteredTutors = allTutors.filter((t) => {
    const matchesSearch =
      t.skill.toLowerCase().includes(search.toLowerCase()) ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      activeCategory === 'All' || t.category === activeCategory;

    const matchesRating = t.rating >= minRating;

    return matchesSearch && matchesCategory && matchesRating;
  });

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRunAIMatch = async () => {
    const nextState = !aiSortActive;
    setAiSortActive(nextState);
    if (!nextState) {
      setAiMatchedScores({});
      setAiEngineLabel('');
      return;
    }

    setAiLoading(true);
    try {
      if (user) {
        const res = await api.ai.getRecommendations({ skill: search || 'Web Development' });
        const scoreMap = {};
        for (const rec of res.recommendations || []) {
          const tutorName = (rec.tutor?.name || rec.name || '').toLowerCase();
          if (tutorName) scoreMap[tutorName] = rec.matchScore;
        }
        // Apply API scores when tutor exists in showcase, or compute deterministic score preview
        allTutors.forEach((t) => {
          const key = t.name.toLowerCase();
          if (!scoreMap[key]) {
            const matchesQuery =
              !search ||
              t.skill.toLowerCase().includes(search.toLowerCase()) ||
              t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
            scoreMap[key] = matchesQuery
              ? Math.min(99, Math.round(t.rating * 15 + 22))
              : Math.round(t.rating * 12);
          }
        });
        setAiMatchedScores(scoreMap);
        setAiEngineLabel(res.source === 'python-ml-microservice' ? 'TensorFlow + Scikit-learn' : 'AI Engine');
      } else {
        const scoreMap = {};
        allTutors.forEach((t) => {
          const matchesQuery =
            !search ||
            t.skill.toLowerCase().includes(search.toLowerCase()) ||
            t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
          scoreMap[t.name.toLowerCase()] = matchesQuery
            ? Math.min(99, Math.round(t.rating * 15 + 22))
            : Math.round(t.rating * 12);
        });
        setAiMatchedScores(scoreMap);
        setAiEngineLabel('AI Compatibility Preview');
      }
    } finally {
      setAiLoading(false);
    }
  };

  const displayedTutors = aiSortActive
    ? [...filteredTutors].sort(
        (a, b) => (aiMatchedScores[b.name.toLowerCase()] || 0) - (aiMatchedScores[a.name.toLowerCase()] || 0)
      )
    : filteredTutors;

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '32px 20px 80px' }}>
      {/* Search & Filter Top Bar */}
      <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: showFilters ? '12px' : '20px', flexWrap: 'wrap' }}>
        <SkillSearchAutocomplete
          variant="explore"
          value={search}
          onChange={setSearch}
          placeholder="Search for a skill, tag, or tutor name..."
          onSelectSuggestion={(item) => {
            if (item.category && item.category !== activeCategory) {
              setActiveCategory('All');
            }
            if (item.type === 'tutor') {
              const found = allTutors.find((t) => t.name === item.label);
              if (found) {
                setSearch(found.name);
              }
            }
          }}
        />

        <button
          onClick={handleRunAIMatch}
          className={aiSortActive ? 'btn-teal' : 'btn-teal-outline'}
          style={{ padding: '10px 18px', gap: '8px', fontSize: '0.9rem' }}
          disabled={aiLoading}
        >
          <Sparkles size={17} />
          <span>{aiLoading ? 'Matching...' : aiSortActive ? `AI Ranked (${aiEngineLabel})` : 'AI Smart Match'}</span>
        </button>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? 'btn-teal' : 'btn-outline-gray'}
          style={{ padding: '10px 18px', gap: '8px', fontSize: '0.9rem' }}
        >
          <SlidersHorizontal size={17} />
          <span>Filters {minRating > 0 ? `(★ ${minRating}+)` : ''}</span>
        </button>
      </div>

      {/* Expandable Rating Filter Bar */}
      {showFilters && (
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#475569' }}>
            Minimum Rating:
          </span>
          {[0, 4.7, 4.8, 4.9].map((val) => (
            <button
              key={val}
              onClick={() => setMinRating(val)}
              className={`filter-chip ${minRating === val ? 'active' : ''}`}
            >
              {val === 0 ? 'Any Rating' : `⭐ ${val}+`}
            </button>
          ))}
        </div>
      )}

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 8-Card Grid (4 columns × 2 rows) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '22px',
      }}>
        {displayedTutors.map((tutor) => (
          <div
            key={tutor.id}
            className="clean-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '20px',
              borderRadius: '14px',
            }}
          >
            <div>
              {/* Header: Avatar, AI Score Badge & Bookmark */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <img
                  src={tutor.avatar}
                  alt={tutor.name}
                  onClick={() => {
                    onSelectTutor?.(tutor);
                    onNavigate?.('profile');
                  }}
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {aiSortActive && aiMatchedScores[tutor.name.toLowerCase()] && (
                    <span
                      style={{
                        background: '#f0fdfa',
                        border: '1px solid #0d9488',
                        color: '#0f766e',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '3px 7px',
                      }}
                    >
                      {aiMatchedScores[tutor.name.toLowerCase()]}% Match
                    </span>
                  )}
                  <button
                    onClick={() => toggleFavorite(tutor.id)}
                    style={{ color: favorites[tutor.id] ? '#ef4444' : '#cbd5e1' }}
                    title="Bookmark"
                  >
                    <Heart size={20} fill={favorites[tutor.id] ? '#ef4444' : 'transparent'} />
                  </button>
                </div>
              </div>

              {/* Skill & Tutor Name */}
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '3px' }}>
                {tutor.skill}
              </h3>
              <div
                onClick={() => {
                  onSelectTutor?.(tutor);
                  onNavigate?.('profile');
                }}
                style={{ fontSize: '0.88rem', color: '#64748b', cursor: 'pointer', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span style={{ textDecoration: 'underline' }}>{tutor.name}</span>
                <span style={{ fontSize: '0.74rem', background: '#f1f5f9', color: '#475569', padding: '1px 7px', borderRadius: '4px', fontWeight: 600 }}>
                  {tutor.college || 'Verified'}
                </span>
              </div>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.86rem', color: '#64748b', marginBottom: '14px' }}>
                <Star size={15} color="#f59e0b" fill="#f59e0b" />
                <strong style={{ color: '#0f172a' }}>{tutor.rating}</strong>
                <span>({tutor.reviewsCount})</span>
              </div>

              {/* Skill Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                {tutor.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: '#f1f5f9',
                      color: '#475569',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Book Session Button */}
            <button
              onClick={() => {
                onBookTutor?.(tutor);
                onNavigate?.('book');
              }}
              className="btn-teal"
              style={{ width: '100%', padding: '10px' }}
            >
              Book Session
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
