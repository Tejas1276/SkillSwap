import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { ScheduleModal } from '../components/ScheduleModal';
import { AnimeHeroBackground } from '../components/AnimeHeroBackground';
import {
  BookOpen,
  Plus,
  Trash2,
  Search,
  Star,
  ShieldCheck,
  Coins,
  Sparkles,
  Calendar,
  CheckCircle,
} from 'lucide-react';

export const LearnerDashboard = () => {
  const { user, refreshUser } = useAuth();
  const [skillsToLearn, setSkillsToLearn] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [loadingTutors, setLoadingTutors] = useState(true);
  const [searchSkill, setSearchSkill] = useState('');
  const [minRating, setMinRating] = useState('');
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newSkill, setNewSkill] = useState({ skill: '', targetProficiency: 'intermediate', notes: '' });
  const [selectedTutorForBooking, setSelectedTutorForBooking] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const fetchWishlist = async () => {
    try {
      const data = await api.learner.getSkillsToLearn();
      setSkillsToLearn(data.skills || []);
    } catch (err) {
      console.error('Error fetching learning wishlist:', err);
    }
  };

  const fetchTutors = async () => {
    setLoadingTutors(true);
    try {
      const data = await api.learner.searchTutors({
        skill: searchSkill,
        minRating: minRating || undefined,
      });
      setTutors(data.tutors || []);
    } catch (err) {
      console.error('Error fetching tutors:', err);
    } finally {
      setLoadingTutors(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTutors();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchSkill, minRating]);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.skill.trim()) return;

    try {
      const data = await api.learner.addSkillToLearn(newSkill);
      setSkillsToLearn(data.skills || []);
      setNewSkill({ skill: '', targetProficiency: 'intermediate', notes: '' });
      setShowAddSkill(false);
      showToast(`Added ${newSkill.skill} to your learning goals`);
      await refreshUser();
    } catch (err) {
      alert(err.message || 'Failed to add skill');
    }
  };

  const handleRemoveSkill = async (skillName) => {
    try {
      const data = await api.learner.removeSkillToLearn(skillName);
      setSkillsToLearn(data.skills || []);
      showToast(`Removed ${skillName} from wishlist`);
      await refreshUser();
    } catch (err) {
      alert(err.message || 'Failed to remove skill');
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast">
          <CheckCircle size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Anime Video Background & Dynamic Story Explainer Banner */}
      <AnimeHeroBackground
        onExploreClick={() => {
          const el = document.getElementById('find-tutors-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Header Banner */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Learner Hub</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
            Set your target learning skills and book sessions with verified peer tutors.
          </p>
        </div>

        <button
          onClick={() => setShowAddSkill(true)}
          className="btn-primary"
        >
          <Plus size={18} />
          <span>Add Skill to Learn</span>
        </button>
      </div>

      {/* Add Skill Modal / Drawer */}
      {showAddSkill && (
        <div className="modal-overlay" onClick={() => setShowAddSkill(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
              Add a Skill You Want to Learn
            </h3>
            <form onSubmit={handleAddSkill} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Skill Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Python, Machine Learning, UI/UX"
                  value={newSkill.skill}
                  onChange={(e) => setNewSkill({ ...newSkill, skill: e.target.value })}
                  style={{ width: '100%' }}
                  required
                  autoFocus
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Target Proficiency
                </label>
                <select
                  value={newSkill.targetProficiency}
                  onChange={(e) => setNewSkill({ ...newSkill, targetProficiency: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Learning Goal / Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Preparing for interviews, building a portfolio project..."
                  value={newSkill.notes}
                  onChange={(e) => setNewSkill({ ...newSkill, notes: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowAddSkill(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Learning Wishlist Section */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <BookOpen size={20} color="#818cf8" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>My Learning Goals ({skillsToLearn.length})</h2>
        </div>

        {skillsToLearn.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '36px' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '14px' }}>
              You haven't added any skills to learn yet.
            </p>
            <button onClick={() => setShowAddSkill(true)} className="btn-secondary">
              <Plus size={16} /> Add Your First Learning Goal
            </button>
          </div>
        ) : (
          <div className="grid-3">
            {skillsToLearn.map((item) => (
              <div key={item._id || item.skill} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, textTransform: 'capitalize' }}>
                      {item.skill}
                    </h3>
                    <button
                      onClick={() => handleRemoveSkill(item.skill)}
                      title="Remove skill"
                      className="btn-outline"
                      style={{ padding: '4px 8px', color: '#f87171' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <span className={`badge-tag ${item.targetProficiency}`}>
                    Target: {item.targetProficiency}
                  </span>
                  {item.notes && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '10px' }}>
                      "{item.notes}"
                    </p>
                  )}
                </div>

                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                  <button
                    onClick={() => {
                      setSearchSkill(item.skill);
                    }}
                    className="btn-outline"
                    style={{ width: '100%', fontSize: '0.85rem', display: 'flex', justifyContent: 'center', gap: '6px' }}
                  >
                    <Search size={14} /> Find Tutors for {item.skill}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Tutor Discovery Section */}
      <section id="find-tutors-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Find Peer Tutors</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Connect with community peers to swap knowledge and level up.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', minWidth: '240px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search skill (e.g. react, python)..."
                value={searchSkill}
                onChange={(e) => setSearchSkill(e.target.value)}
                style={{ paddingLeft: '36px', width: '100%' }}
              />
            </div>

            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
            >
              <option value="">Any Rating</option>
              <option value="4.0">⭐ 4.0+ Stars</option>
              <option value="4.5">⭐ 4.5+ Stars</option>
            </select>
          </div>
        </div>

        {loadingTutors ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Searching available tutors...
          </div>
        ) : tutors.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-muted)' }}>
              No tutors found matching "{searchSkill}". Try clearing your search filters.
            </p>
          </div>
        ) : (
          <div className="grid-2">
            {tutors.map((tutor) => (
              <div key={tutor._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
                <div>
                  {/* Tutor Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: '#fff',
                    }}>
                      {tutor.name ? tutor.name.charAt(0).toUpperCase() : 'T'}
                    </div>

                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{tutor.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px', fontSize: '0.85rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontWeight: 600 }}>
                          <Star size={14} fill="#fbbf24" />
                          {tutor.rating?.count > 0 ? `${tutor.rating.average.toFixed(1)} (${tutor.rating.count})` : 'New Peer'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#a855f7', fontWeight: 600 }}>
                          <ShieldCheck size={14} />
                          AI Score: {tutor.credibilityScore ? tutor.credibilityScore.toFixed(1) : 70}
                        </span>
                      </div>
                    </div>
                  </div>

                  {tutor.bio && (
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.4 }}>
                      {tutor.bio}
                    </p>
                  )}

                  {/* Skills Offered List */}
                  <div>
                    <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700 }}>
                      Skills Offered:
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                      {tutor.skillsToTeach?.map((s) => (
                        <div
                          key={s.skill}
                          style={{
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '6px 10px',
                            fontSize: '0.84rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <strong style={{ textTransform: 'capitalize' }}>{s.skill}</strong>
                          <span className={`badge-tag ${s.proficiency}`} style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                            {s.proficiency}
                          </span>
                          <span style={{ color: '#38bdf8', fontWeight: 600, fontSize: '0.8rem' }}>
                            {s.hourlyCredits} cr/hr
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                  <button
                    onClick={() => setSelectedTutorForBooking(tutor)}
                    className="btn-primary"
                    style={{ width: '100%' }}
                  >
                    <Calendar size={16} />
                    <span>Schedule 1-on-1 Session</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Booking Modal */}
      {selectedTutorForBooking && (
        <ScheduleModal
          tutor={selectedTutorForBooking}
          onClose={() => setSelectedTutorForBooking(null)}
          onSuccess={() => {
            showToast('Session request submitted successfully!');
          }}
        />
      )}
    </div>
  );
};
