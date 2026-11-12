import React, { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { X, Star, ShieldCheck, AlertCircle, Coins } from 'lucide-react';

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

  const isLearner = session.learner?._id === user?._id || session.learner === user?._id;
  const revieweeName = isLearner
    ? session.tutor?.name || 'Tutor'
    : session.learner?.name || 'Learner';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await api.feedback.submit({
        sessionId: session._id,
        rating: Number(rating),
        comment,
        criteria,
      });

      await refreshUser();
      onSuccess?.(response);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          boxShadow: '0 24px 48px rgba(15, 23, 42, 0.25)',
          padding: '28px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a' }}>
              Rate & Review Session
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '4px' }}>
              Sharing feedback for <strong style={{ color: '#0f172a' }}>{revieweeName}</strong> ({session.skill})
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn-outline-gray"
            style={{ padding: '6px' }}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              padding: '10px 14px',
              marginBottom: '16px',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Star Rating */}
          <div style={{ textAlign: 'center', padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '10px' }}>
              Overall Session Rating
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
                    transform: (hoverRating || rating) >= star ? 'scale(1.12)' : 'scale(1)',
                  }}
                >
                  <Star
                    size={32}
                    color={(hoverRating || rating) >= star ? '#f59e0b' : '#cbd5e1'}
                    fill={(hoverRating || rating) >= star ? '#f59e0b' : 'transparent'}
                  />
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, marginTop: '6px', color: '#d97706' }}>
              {rating} of 5 Stars
            </div>
          </div>

          {/* Multidimensional Criteria */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
              Detailed Assessment (Feeds AI Credibility Engine)
            </span>
            {['clarity', 'helpfulness', 'punctuality'].map((criterion) => (
              <div key={criterion} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'capitalize', color: '#0f172a' }}>
                  {criterion}
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCriteria({ ...criteria, [criterion]: num })}
                      style={{
                        width: '30px',
                        height: '30px',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        border: criteria[criterion] === num ? '1px solid #0d9488' : '1px solid #cbd5e1',
                        background: criteria[criterion] === num ? '#0d9488' : '#ffffff',
                        color: criteria[criterion] === num ? '#ffffff' : '#475569',
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
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
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

          {/* AI Credibility & Reviewer Bonus Notice */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.82rem',
                color: '#0f766e',
                background: '#f0fdfa',
                border: '1px solid #99f6e4',
                padding: '8px 12px',
                fontWeight: 600,
              }}
            >
              <ShieldCheck size={16} />
              <span>Automatically updates {revieweeName}'s AI Credibility Score in MongoDB.</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.82rem',
                color: '#92400e',
                background: '#fffbeb',
                border: '1px solid #fde68a',
                padding: '8px 12px',
                fontWeight: 600,
              }}
            >
              <Coins size={16} color="#d97706" />
              <span>You earn +5 Bonus Credits & unlock "Active Reviewer" upon submitting!</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
            <button type="button" onClick={onClose} className="btn-outline-gray">
              Cancel
            </button>
            <button type="submit" className="btn-teal" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review (+5 Credits)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
