import React, { useState } from 'react';
import { Search, SlidersHorizontal, Heart, Star } from 'lucide-react';

export const ExplorePage = ({ onSelectTutor, onBookTutor, onNavigate, initialSearch = '' }) => {
  const [search, setSearch] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState('All');
  const [favorites, setFavorites] = useState({});

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
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      rating: 4.8,
      reviewsCount: 25,
      tags: ['React', 'Node.js'],
      category: 'Tech',
    },
    {
      id: 'priya-singh',
      skill: 'UI/UX Design',
      name: 'Priya Singh',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      rating: 4.7,
      reviewsCount: 18,
      tags: ['Figma', 'Design'],
      category: 'Design',
    },
    {
      id: 'aman-verma',
      skill: 'Data Science',
      name: 'Aman Verma',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      rating: 4.9,
      reviewsCount: 31,
      tags: ['Python', 'ML'],
      category: 'Tech',
    },
    {
      id: 'kritika-jain',
      skill: 'Video Editing',
      name: 'Kritika Jain',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      rating: 4.9,
      reviewsCount: 15,
      tags: ['Premiere Pro', 'Editing'],
      category: 'Design',
    },
    {
      id: 'aditya-rao',
      skill: 'Guitar',
      name: 'Aditya Rao',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
      rating: 4.8,
      reviewsCount: 12,
      tags: ['Music', 'Beginner Friendly'],
      category: 'Music',
    },
    {
      id: 'arjun-mehta',
      skill: 'Public Speaking',
      name: 'Arjun Mehta',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      rating: 4.9,
      reviewsCount: 12,
      tags: ['Communication', 'Confidence'],
      category: 'Communication',
    },
    {
      id: 'nidhi-kapoor',
      skill: 'English Speaking',
      name: 'Nidhi Kapoor',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      rating: 4.7,
      reviewsCount: 19,
      tags: ['English', 'Conversation'],
      category: 'Languages',
    },
    {
      id: 'rahul-yadav',
      skill: 'DSA (C++)',
      name: 'Rahul Yadav',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
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

    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '32px 20px 80px' }}>
      {/* Search & Filter Top Bar */}
      <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '10px 16px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}>
          <Search size={18} color="#94a3b8" style={{ marginRight: '10px' }} />
          <input
            type="text"
            placeholder="Search for a skill or person..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '0.94rem',
              color: '#0f172a',
            }}
          />
        </div>

        <button
          className="btn-outline-gray"
          style={{ padding: '10px 18px', gap: '8px', fontSize: '0.9rem' }}
        >
          <SlidersHorizontal size={17} color="#475569" />
          <span>Filters</span>
        </button>
      </div>

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
        {filteredTutors.map((tutor) => (
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
              {/* Header: Avatar & Bookmark */}
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
                <button
                  onClick={() => toggleFavorite(tutor.id)}
                  style={{ color: favorites[tutor.id] ? '#ef4444' : '#cbd5e1' }}
                  title="Bookmark"
                >
                  <Heart size={20} fill={favorites[tutor.id] ? '#ef4444' : 'transparent'} />
                </button>
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
                style={{ fontSize: '0.88rem', color: '#64748b', cursor: 'pointer', marginBottom: '10px' }}
              >
                {tutor.name}
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
