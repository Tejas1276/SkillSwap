import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Coins,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Bell,
  Star,
} from 'lucide-react';

export const TutorDashboard = () => {
  const { user, refreshUser } = useAuth();
  const [skillsToTeach, setSkillsToTeach] = useState([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newSkill, setNewSkill] = useState({
    skill: '',
    proficiency: 'advanced',
    hourlyCredits: 15,
    description: '',
  });
  const [toastMessage, setToastMessage] = useState('');

  const fetchTutorData = async () => {
    try {
      const skillsData = await api.tutor.getSkillsToTeach();
      setSkillsToTeach(skillsData.skills || []);
      setIsAvailable(skillsData.isAvailable ?? true);

      setLoadingRequests(true);
      const requestsData = await api.tutor.getSessionRequests();
      setRequests(requestsData.requests || []);
    } catch (err) {
      console.error('Error fetching tutor data:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchTutorData();
  }, []);

  const handleToggleAvailability = async () => {
    try {
      const nextState = !isAvailable;
      await api.tutor.updateAvailability(nextState);
      setIsAvailable(nextState);
      showToast(`Status updated: ${nextState ? 'Available for Sessions' : 'Paused / Unavailable'}`);
      await refreshUser();
    } catch (err) {
      alert(err.message || 'Failed to update availability');
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.skill.trim()) return;

    try {
      const data = await api.tutor.addSkillToTeach(newSkill);
      setSkillsToTeach(data.skills || []);
      setNewSkill({ skill: '', proficiency: 'advanced', hourlyCredits: 15, description: '' });
      setShowAddSkill(false);
      showToast(`Offered to teach '${newSkill.skill}' successfully!`);
      await refreshUser();
    } catch (err) {
      alert(err.message || 'Failed to add skill');
    }
  };

  const handleRemoveSkill = async (skillName) => {
    try {
      const data = await api.tutor.removeSkillToTeach(skillName);
      setSkillsToTeach(data.skills || []);
      showToast(`Removed '${skillName}' from teaching list`);
      await refreshUser();
    } catch (err) {
      alert(err.message || 'Failed to remove skill');
    }
  };

  const handleRespondToRequest = async (sessionId, action) => {
    try {
      await api.tutor.respondToSessionRequest(sessionId, action);
      showToast(`Session request ${action === 'accept' ? 'accepted' : 'declined'}`);
      await fetchTutorData();
      await refreshUser();
    } catch (err) {
      alert(err.message || `Failed to ${action} request`);
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

      {/* Tutor Hub Header */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Tutor Hub</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
            Offer skills, earn credits, respond to learner booking requests, and grow your AI Credibility Score.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Availability Switch */}
          <button
            onClick={handleToggleAvailability}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              background: isAvailable ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${isAvailable ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              color: isAvailable ? '#34d399' : '#f87171',
              fontWeight: 600,
              fontSize: '0.88rem',
            }}
          >
            {isAvailable ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
            <span>{isAvailable ? 'Available for Sessions' : 'Unavailable / Busy'}</span>
          </button>

          <button onClick={() => setShowAddSkill(true)} className="btn-primary">
            <Plus size={18} />
            <span>Offer a Skill</span>
          </button>
        </div>
      </div>

      {/* Add Teaching Skill Modal */}
      {showAddSkill && (
        <div className="modal-overlay" onClick={() => setShowAddSkill(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
              Offer a New Skill to Teach
            </h3>
            <form onSubmit={handleAddSkill} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Skill Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. JavaScript, Docker, Graphic Design"
                  value={newSkill.skill}
                  onChange={(e) => setNewSkill({ ...newSkill, skill: e.target.value })}
                  style={{ width: '100%' }}
                  required
                  autoFocus
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Proficiency
                  </label>
                  <select
                    value={newSkill.proficiency}
                    onChange={(e) => setNewSkill({ ...newSkill, proficiency: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Credits / Hour
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newSkill.hourlyCredits}
                    onChange={(e) => setNewSkill({ ...newSkill, hourlyCredits: Number(e.target.value) })}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Description & Teaching Focus
                </label>
                <textarea
                  rows={2}
                  placeholder="What can you teach? e.g. From basics to production apps..."
                  value={newSkill.description}
                  onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowAddSkill(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Publish Offering
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Incoming Requests Section */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Bell size={20} color="#fbbf24" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            Incoming Session Requests ({requests.length})
          </h2>
        </div>

        {loadingRequests ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
            Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="glass-card" style={{ padding: '28px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)' }}>
              No pending session requests at the moment. When learners book sessions with you, they will appear here.
            </p>
          </div>
        ) : (
          <div className="grid-2">
            {requests.map((req) => (
              <div key={req._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="badge-tag requested" style={{ marginBottom: '6px' }}>Requested</span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, textTransform: 'capitalize' }}>
                      {req.skill}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {req.topic || 'General 1-on-1 Session'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#38bdf8', fontWeight: 700 }}>
                    <Coins size={16} />
                    <span>+{req.creditsExchanged} credits</span>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.86rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Learner</div>
                    <strong style={{ color: '#fff' }}>{req.learner?.name}</strong>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={13} />
                      <span>{new Date(req.scheduledAt).toLocaleDateString()}</span>
                    </div>
                    <div style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}>
                      <Clock size={13} />
                      <span>{req.durationMinutes} mins</span>
                    </div>
                  </div>
                </div>

                {req.learnerNotes && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    Notes: "{req.learnerNotes}"
                  </p>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                  <button
                    onClick={() => handleRespondToRequest(req._id, 'reject')}
                    className="btn-danger"
                    style={{ fontSize: '0.85rem' }}
                  >
                    <XCircle size={15} style={{ marginRight: '4px' }} />
                    Decline
                  </button>
                  <button
                    onClick={() => handleRespondToRequest(req._id, 'accept')}
                    className="btn-success"
                    style={{ fontSize: '0.85rem' }}
                  >
                    <CheckCircle size={15} style={{ marginRight: '4px' }} />
                    Accept Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Offered Skills Section */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <GraduationCap size={20} color="#34d399" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            Skills I Teach ({skillsToTeach.length})
          </h2>
        </div>

        {skillsToTeach.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '36px' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '14px' }}>
              You haven't offered any skills to teach yet. Share your knowledge with the community to earn credits!
            </p>
            <button onClick={() => setShowAddSkill(true)} className="btn-secondary">
              <Plus size={16} /> Offer Your First Skill
            </button>
          </div>
        ) : (
          <div className="grid-3">
            {skillsToTeach.map((item) => (
              <div key={item._id || item.skill} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, textTransform: 'capitalize' }}>
                      {item.skill}
                    </h3>
                    <button
                      onClick={() => handleRemoveSkill(item.skill)}
                      title="Remove offered skill"
                      className="btn-outline"
                      style={{ padding: '4px 8px', color: '#f87171' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <span className={`badge-tag ${item.proficiency}`}>
                      {item.proficiency}
                    </span>
                    <span style={{ color: '#38bdf8', fontWeight: 600, fontSize: '0.85rem' }}>
                      {item.hourlyCredits} credits / hr
                    </span>
                  </div>

                  {item.description && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: 1.4 }}>
                      {item.description}
                    </p>
                  )}
                </div>

                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  Active & visible to peer learners
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
