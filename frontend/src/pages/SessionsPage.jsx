import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { SessionCard } from '../components/SessionCard';
import { FeedbackModal } from '../components/FeedbackModal';
import { Calendar, Filter, CheckCircle } from 'lucide-react';

export const SessionsPage = ({ onEnterVideoRoom }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'learner', 'tutor'
  const [selectedSessionForFeedback, setSelectedSessionForFeedback] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const fetchSessions = async () => {
    setLoading(true);
    try {
      let results = [];
      if (roleFilter === 'learner') {
        const data = await api.learner.getLearnerSessions(statusFilter);
        results = data.sessions || [];
      } else if (roleFilter === 'tutor') {
        const data = await api.tutor.getTutorSessions(statusFilter);
        results = data.sessions || [];
      } else {
        // Fetch both and merge
        const [learnerData, tutorData] = await Promise.all([
          api.learner.getLearnerSessions(statusFilter),
          api.tutor.getTutorSessions(statusFilter),
        ]);
        const map = new Map();
        (learnerData.sessions || []).forEach((s) => map.set(s._id, s));
        (tutorData.sessions || []).forEach((s) => map.set(s._id, s));
        results = Array.from(map.values()).sort(
          (a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt)
        );
      }
      setSessions(results);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [statusFilter, roleFilter]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {toastMessage && (
        <div className="toast">
          <CheckCircle size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Controls */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Session Schedule</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
            Manage upcoming bookings, launch WebRTC video meetings, and complete credit transfers.
          </p>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="learner">As Learner</option>
            <option value="tutor">As Tutor</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="accepted">Accepted / Upcoming</option>
            <option value="requested">Pending Approval</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          Loading your sessions...
        </div>
      ) : sessions.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '48px' }}>
          <Calendar size={36} color="var(--text-dim)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
            No sessions found
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {statusFilter
              ? `There are no sessions with status '${statusFilter}'.`
              : 'You do not have any sessions scheduled yet. Head over to the Learner Hub to book a peer tutor!'}
          </p>
        </div>
      ) : (
        <div className="grid-2">
          {sessions.map((session) => (
            <SessionCard
              key={session._id}
              session={session}
              onRefresh={fetchSessions}
              onOpenFeedback={(sess) => setSelectedSessionForFeedback(sess)}
              onEnterVideoRoom={onEnterVideoRoom}
            />
          ))}
        </div>
      )}

      {/* Feedback Modal */}
      {selectedSessionForFeedback && (
        <FeedbackModal
          session={selectedSessionForFeedback}
          onClose={() => setSelectedSessionForFeedback(null)}
          onSuccess={() => {
            showToast('Feedback submitted and AI Credibility Score updated!');
            fetchSessions();
          }}
        />
      )}
    </div>
  );
};
