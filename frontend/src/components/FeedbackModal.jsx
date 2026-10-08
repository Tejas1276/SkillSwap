import React, { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { X, Star, ShieldCheck, AlertCircle } from 'lucide-react';

export const FeedbackModal = ({ session, onClose, onSuccess }) => {
  const { user, refreshUser } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [criteria, setCriteria] = useState({
    clarity: 5,
    helpfulness: 5,
    punctuality: 5,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Reviewee is the other person
  const isLearner = session.learner?._id === user?._id || session.learner === user?._id;
  const revieweeName = isLearner
    ? (session.tutor?.name || 'Tutor')
    : (session.learner?.name || 'Learner');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await api.feedback.submit({
        sessionId: session._id,
        rating: Number(rating),
        comment,
        criteria,
      });

      await refreshUser();
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Rate & Review Session</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Sharing feedback for <strong style={{ color: '#fff' }}>{revieweeName}</strong> ({session.skill})
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Star Rating */}
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Overall Experience
            </span>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  style={{
                    background: 'none',
                    padding: '4px',
                    transform: (hoverRating || rating) >= star ? 'scale(1.15)' : 'scale(1)',
                    transition: 'transform 0.15s ease',
                  }}
                >
                  <Star
                    size={32}
                    color={(hoverRating || rating) >= star ? '#fbbf24' : '#475569'}
                    fill={(hoverRating || rating) >= star ? '#fbbf24' : 'transparent'}
                  />
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '6px', color: '#fbbf24' }}>
              {rating} of 5 Stars
            </div>
          </div>

          {/* Criteria Sliders */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '16px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Detailed Assessment
            </span>
            {['clarity', 'helpfulness', 'punctuality'].map((criterion) => (
              <div key={criterion} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.88rem', textTransform: 'capitalize' }}>{criterion}</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCriteria({ ...criteria, [criterion]: num })}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '4px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        background: criteria[criterion] === num ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)',
                        color: criteria[criterion] === num ? '#fff' : 'var(--text-muted)',
                      }}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
              Written Feedback
            </label>
            <textarea
              rows={3}
              placeholder="What went well? Any tips for next time?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ width: '100%' }}
              required
            />
          </div>

          {/* Credibility impact notice */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.82rem',
            color: '#a855f7',
            background: 'rgba(168, 85, 247, 0.1)',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
          }}>
            <ShieldCheck size={16} />
            <span>This rating directly updates {revieweeName}'s AI Credibility Score in the database.</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
