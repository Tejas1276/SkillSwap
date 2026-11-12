import React, { useState } from 'react';
import { ArrowLeft, Clock, Video, Coins, CheckCircle2 } from 'lucide-react';

export const BookSessionPage = ({ tutor, onNavigate, onEnterVideoRoom, onBookingCreated }) => {
  const [sessionType, setSessionType] = useState('1on1');
  const [selectedDate, setSelectedDate] = useState(14); // Nov 14
  const [selectedSlot, setSelectedSlot] = useState('3:00 PM');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const selectedTutor = tutor || {
    name: 'Rohan Sharma',
    skill: 'Web Development',
    hourlyCredits: 1,
  };

  const timeSlots = [
    '10:00 AM',
    '11:00 AM',
    '1:00 PM',
    '3:00 PM',
    '5:00 PM',
    '7:00 PM',
  ];

  const daysInNovember = Array.from({ length: 30 }, (_, i) => i + 1);
  const slugName = (selectedTutor.name || 'rohan-sharma').toLowerCase().replace(/\s+/g, '-');
  const roomId = `room-${slugName}-nov${selectedDate}`;

  const handleConfirm = () => {
    setBookingConfirmed(true);
    onBookingCreated?.({
      tutorName: selectedTutor.name,
      skill: selectedTutor.skill || 'Web Development',
      sessionType: sessionType === '1on1' ? '1-on-1' : 'Group',
      dateLabel: `Nov ${selectedDate}`,
      slot: selectedSlot,
      roomId,
    });
  };

  return (
    <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '28px 20px 80px' }}>
      {/* Back Link */}
      <button
        onClick={() => onNavigate?.('profile')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#64748b',
          fontSize: '0.88rem',
          fontWeight: 600,
          marginBottom: '20px',
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Profile</span>
      </button>

      {bookingConfirmed ? (
        <div className="clean-card" style={{ padding: '48px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', padding: '16px', background: '#f0fdfa', marginBottom: '18px' }}>
            <CheckCircle2 size={48} color="#0d9488" />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>
            Session Booked Successfully!
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.98rem', marginBottom: '24px' }}>
            Your <strong>{sessionType === '1on1' ? '1-on-1' : 'Group'}</strong> session with{' '}
            <strong>{selectedTutor.name}</strong> for <strong>{selectedTutor.skill || 'Web Development'}</strong> is
            confirmed for <strong>November {selectedDate}, 2026</strong> at <strong>{selectedSlot}</strong>.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setBookingConfirmed(false);
                onNavigate?.('dashboard');
              }}
              className="btn-outline-gray"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() =>
                onEnterVideoRoom?.({
                  tutorName: selectedTutor.name,
                  skill: selectedTutor.skill || 'Web Development',
                  roomId,
                })
              }
              className="btn-teal"
              style={{ gap: '8px' }}
            >
              <Video size={16} />
              <span>Enter Live WebRTC Room</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '32px',
            alignItems: 'flex-start',
          }}
        >
          {/* Left Column: Form Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>
                Book a Session with {selectedTutor.name}
              </h1>
              <div style={{ fontSize: '0.86rem', color: '#64748b', marginTop: '4px' }}>
                Skill: <strong style={{ color: '#0d9488' }}>{selectedTutor.skill || 'Web Development'}</strong>
              </div>
            </div>

            {/* Session Type */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>
                Session Type
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* 1 on 1 */}
                <div
                  onClick={() => setSessionType('1on1')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    border: sessionType === '1on1' ? '2px solid #0d9488' : '1px solid #e2e8f0',
                    background: sessionType === '1on1' ? '#f0fdfa' : '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        border: sessionType === '1on1' ? '5px solid #0d9488' : '2px solid #cbd5e1',
                      }}
                    />
                    <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>
                      1 on 1 Session
                    </span>
                  </div>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>(1 credit)</span>
                </div>

                {/* Group */}
                <div
                  onClick={() => setSessionType('group')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    border: sessionType === 'group' ? '2px solid #0d9488' : '1px solid #e2e8f0',
                    background: sessionType === 'group' ? '#f0fdfa' : '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        border: sessionType === 'group' ? '5px solid #0d9488' : '2px solid #cbd5e1',
                      }}
                    />
                    <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>
                      Group Session
                    </span>
                  </div>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>(0.5 credit per person)</span>
                </div>
              </div>
            </div>

            {/* Select Date Calendar (November 2026 starts on Sunday -> 0 leading blanks) */}
            <div className="clean-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                  November 2026
                </span>
                <span style={{ fontSize: '0.78rem', color: '#0d9488', fontWeight: 600 }}>
                  Today: Nov 12
                </span>
              </div>

              {/* Day Headers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '8px' }}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                  <span key={d} style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>
                    {d}
                  </span>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
                {daysInNovember.map((day) => {
                  const isSelected = selectedDate === day;
                  const isPast = day < 12;

                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={isPast}
                      onClick={() => setSelectedDate(day)}
                      style={{
                        padding: '8px 0',
                        fontSize: '0.84rem',
                        fontWeight: isSelected ? 800 : 500,
                        background: isSelected ? '#0d9488' : 'transparent',
                        color: isSelected ? '#ffffff' : isPast ? '#cbd5e1' : '#0f172a',
                        cursor: isPast ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Time Slots & Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Available Time Slots */}
            <div className="clean-card" style={{ padding: '22px' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
                Available Time Slots (Nov {selectedDate})
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {timeSlots.map((slot) => {
                  const isSlotActive = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      style={{
                        padding: '10px 4px',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        border: isSlotActive ? '2px solid #0d9488' : '1px solid #e2e8f0',
                        background: isSlotActive ? '#f0fdfa' : '#ffffff',
                        color: isSlotActive ? '#0d9488' : '#334155',
                        textAlign: 'center',
                      }}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Session Details Card */}
            <div className="clean-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                Session Details
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#475569' }}>
                <Clock size={16} color="#0d9488" />
                <span>Duration: <strong>1 hour ({sessionType === '1on1' ? '1-on-1' : 'Group'})</strong></span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#475569' }}>
                <Video size={16} color="#0d9488" />
                <span>Platform: <strong>In-app video (WebRTC)</strong></span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#475569' }}>
                <Coins size={16} color="#f59e0b" />
                <span>Credits: <strong>{sessionType === '1on1' ? '1 credit' : '0.5 credit'}</strong></span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: '#475569' }}>
                <CheckCircle2 size={16} color="#0d9488" style={{ marginTop: '2px' }} />
                <span>Room ID: <code>{roomId}</code></span>
              </div>

              <button
                type="button"
                onClick={handleConfirm}
                className="btn-teal"
                style={{ width: '100%', padding: '12px', fontSize: '0.98rem', marginTop: '10px' }}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
