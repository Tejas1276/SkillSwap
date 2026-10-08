import React, { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { X, Calendar, Clock, Coins, CheckCircle, AlertCircle } from 'lucide-react';

export const ScheduleModal = ({ tutor, onClose, onSuccess }) => {
  const { user, refreshUser } = useAuth();
  const [selectedSkill, setSelectedSkill] = useState(
    tutor.skillsToTeach?.[0]?.skill || ''
  );
  const [topic, setTopic] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [learnerNotes, setLearnerNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Find rate for selected skill
  const skillObj = tutor.skillsToTeach?.find((s) => s.skill === selectedSkill);
  const hourlyRate = skillObj?.hourlyCredits || 10;
  const creditsNeeded = Math.round((hourlyRate * durationMinutes) / 60);
  const hasEnoughCredits = (user?.credits || 0) >= creditsNeeded;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!scheduledAt) {
      setError('Please select a date and time for the session');
      return;
    }

    if (new Date(scheduledAt) <= new Date()) {
      setError('Scheduled time must be in the future');
      return;
    }

    if (!hasEnoughCredits) {
      setError(`Insufficient credits. You need ${creditsNeeded} credits, but you have ${user?.credits}.`);
      return;
    }

    setSubmitting(true);
    try {
      await api.learner.requestSession({
        tutorId: tutor._id,
        skill: selectedSkill,
        topic: topic || `1-on-1 Learning: ${selectedSkill}`,
        scheduledAt: new Date(scheduledAt).toISOString(),
        durationMinutes: Number(durationMinutes),
        learnerNotes,
      });
      await refreshUser();
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to schedule session');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Request Session</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Booking with <strong style={{ color: '#fff' }}>{tutor.name}</strong>
            </p>
          </div>
          <button onClick={onClose} className="btn-outline" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{
            background: 'var(--danger-light)',
            color: '#f87171',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '16px',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
              Skill to Learn
            </label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              style={{ width: '100%' }}
              required
            >
              {tutor.skillsToTeach?.map((s) => (
                <option key={s.skill} value={s.skill}>
                  {s.skill} ({s.proficiency} - {s.hourlyCredits} credits/hr)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
              Session Topic or Focus
            </label>
            <input
              type="text"
              placeholder="e.g., Code review, State management, Intro algorithms"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                Date & Time
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                style={{ width: '100%' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                Duration
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                style={{ width: '100%' }}
              >
                <option value={30}>30 mins</option>
                <option value={45}>45 mins</option>
                <option value={60}>60 mins (1 hr)</option>
                <option value={90}>90 mins (1.5 hr)</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
              Notes for Tutor (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Share your goals or prerequisites..."
              value={learnerNotes}
              onChange={(e) => setLearnerNotes(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          {/* Pricing summary banner */}
          <div style={{
            background: hasEnoughCredits ? 'rgba(56, 189, 248, 0.1)' : 'var(--danger-light)',
            border: `1px solid ${hasEnoughCredits ? 'rgba(56, 189, 248, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.9rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Coins size={18} color={hasEnoughCredits ? '#38bdf8' : '#f87171'} />
              <span>Cost: <strong>{creditsNeeded} credits</strong></span>
            </div>
            <span style={{ color: hasEnoughCredits ? '#94a3b8' : '#f87171', fontSize: '0.82rem' }}>
              Balance: {user?.credits || 0} credits
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting || !hasEnoughCredits}
              style={{ opacity: hasEnoughCredits ? 1 : 0.6 }}
            >
              {submitting ? 'Sending Request...' : 'Confirm Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
