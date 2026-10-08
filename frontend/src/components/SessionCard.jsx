import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import {
  Calendar,
  Clock,
  Coins,
  Video,
  CheckCircle,
  XCircle,
  Star,
  UserCheck,
} from 'lucide-react';

export const SessionCard = ({ session, onRefresh, onOpenFeedback }) => {
  const { user, refreshUser } = useAuth();
  const [loadingAction, setLoadingAction] = useState(false);

  const isTutor = (session.tutor?._id || session.tutor) === user?._id;
  const isLearner = (session.learner?._id || session.learner) === user?._id;
  const otherParty = isTutor ? session.learner : session.tutor;
  const otherRole = isTutor ? 'Learner' : 'Tutor';

  const scheduledDate = new Date(session.scheduledAt);
  const formattedDate = scheduledDate.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = scheduledDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleRespond = async (action) => {
    setLoadingAction(true);
    try {
      await api.tutor.respondToSessionRequest(session._id, action);
      await onRefresh?.();
    } catch (err) {
      alert(err.message || `Failed to ${action} session`);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleComplete = async () => {
    if (!window.confirm('Mark this session as complete and transfer credits?')) return;
    setLoadingAction(true);
    try {
      await api.sessions.complete(session._id);
      await refreshUser();
      await onRefresh?.();
    } catch (err) {
      alert(err.message || 'Failed to complete session');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this session?')) return;
    setLoadingAction(true);
    try {
      await api.sessions.cancel(session._id);
      await onRefresh?.();
    } catch (err) {
      alert(err.message || 'Failed to cancel session');
    } finally {
      setLoadingAction(false);
    }
  };

  const hasGivenFeedback = isLearner
    ? session.learnerFeedbackCompleted
    : session.tutorFeedbackCompleted;

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '1.15rem', fontWeight: 700, textTransform: 'capitalize' }}>
              {session.skill}
            </span>
            <span className={`badge-tag ${session.status}`}>{session.status}</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            {session.topic || `Peer Learning Session`}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontWeight: 700 }}>
          <Coins size={16} />
          <span>{session.creditsExchanged} credits</span>
        </div>
      </div>

      {/* Counterparty & Schedule Details */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        background: 'rgba(255, 255, 255, 0.03)',
        padding: '12px 14px',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.86rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.85rem'
          }}>
            {otherParty?.name ? otherParty.name.charAt(0).toUpperCase() : otherRole.charAt(0)}
          </div>
          <div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              {otherRole}
            </div>
            <strong style={{ color: '#fff' }}>{otherParty?.name || 'Peer'}</strong>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
            <Calendar size={14} />
            <span>{formattedDate} at {formattedTime}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dim)', marginTop: '2px' }}>
            <Clock size={14} />
            <span>{session.durationMinutes} Minutes</span>
          </div>
        </div>
      </div>

      {/* Meeting Room ID (Ready for Phase 3 WebRTC) */}
      {session.status === 'accepted' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a5b4fc' }}>
            <Video size={16} />
            <span>Room ID: <code>{session.meetingRoomId}</code></span>
          </div>
          <button
            onClick={() => alert(`Connecting to WebRTC Room: ${session.meetingRoomId}\n(Video Room integration is featured in Phase 3!)`)}
            className="btn-primary"
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          >
            Join Call
          </button>
        </div>
      )}

      {/* Actions Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px', flexWrap: 'wrap' }}>
        {/* Tutor responding to incoming request */}
        {isTutor && session.status === 'requested' && (
          <>
            <button
              onClick={() => handleRespond('reject')}
              disabled={loadingAction}
              className="btn-danger"
              style={{ fontSize: '0.85rem' }}
            >
              <XCircle size={15} style={{ marginRight: '4px' }} />
              Decline
            </button>
            <button
              onClick={() => handleRespond('accept')}
              disabled={loadingAction}
              className="btn-success"
              style={{ fontSize: '0.85rem' }}
            >
              <CheckCircle size={15} style={{ marginRight: '4px' }} />
              Accept
            </button>
          </>
        )}

        {/* Completing accepted session */}
        {session.status === 'accepted' && (
          <button
            onClick={handleComplete}
            disabled={loadingAction}
            className="btn-primary"
            style={{ fontSize: '0.85rem' }}
          >
            <UserCheck size={15} />
            Complete & Exchange Credits
          </button>
        )}

        {/* Rating completed session */}
        {session.status === 'completed' && !hasGivenFeedback && (
          <button
            onClick={() => onOpenFeedback(session)}
            className="btn-secondary"
            style={{ color: '#fbbf24', borderColor: 'rgba(251, 191, 36, 0.4)', fontSize: '0.85rem' }}
          >
            <Star size={15} />
            Leave Review
          </button>
        )}

        {/* Already rated label */}
        {session.status === 'completed' && hasGivenFeedback && (
          <span style={{ fontSize: '0.82rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle size={14} /> Review Submitted
          </span>
        )}

        {/* Can cancel if requested or accepted */}
        {['requested', 'accepted'].includes(session.status) && (
          <button
            onClick={handleCancel}
            disabled={loadingAction}
            className="btn-outline"
            style={{ fontSize: '0.82rem', padding: '6px 10px' }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};
