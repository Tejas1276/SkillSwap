import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  MessageSquare,
  Users,
  MoreVertical,
  PhoneOff,
  Send,
  Heart,
  Paperclip,
  CheckCircle2,
} from 'lucide-react';

export const VideoRoomPage = ({ sessionInfo, onEndSession, onNavigate }) => {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [activeTab, setActiveTab] = useState('Chat');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Rohan', text: "Here's the GitHub repo: https://github.com/rohansharma/react-mastery", time: '3:05 PM' },
    { id: 2, sender: 'Rohan', text: "Let's try this example now:", time: '3:08 PM' },
    { id: 3, sender: 'You', text: "Sure! Pulling the repository now.", time: '3:09 PM' },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [seconds, setSeconds] = useState(2059); // 00:34:19

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'You', text: inputMsg.trim(), time: 'Just now' },
    ]);
    setInputMsg('');
  };

  const tutorName = sessionInfo?.tutorName || 'Rohan Sharma';

  return (
    <div style={{
      backgroundColor: '#0b0f19',
      color: '#ffffff',
      height: 'calc(100vh - 65px)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* 1. Top Bar */}
      <div style={{
        padding: '12px 24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#070a12',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/logo.png" alt="Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
            <strong style={{ fontSize: '1.1rem', letterSpacing: '-0.01em' }}>Skill Swap</strong>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.06)',
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '0.84rem',
            fontFamily: 'monospace',
            color: '#38bdf8',
          }}>
            ⏱ {formatTimer(seconds)}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setActiveTab('Chat')}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <MessageSquare size={14} />
            <span>Chat</span>
          </button>

          <button
            onClick={() => onEndSession ? onEndSession() : onNavigate?.('sessions')}
            style={{
              background: '#ef4444',
              color: '#ffffff',
              padding: '6px 16px',
              borderRadius: '6px',
              fontSize: '0.84rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <PhoneOff size={14} />
            <span>End Session</span>
          </button>
        </div>
      </div>

      {/* 2. Main Stage: Video Grid + Chat Panel */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: Video Area */}
        <div style={{
          flex: 1,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          {/* Two Peer Video Tiles */}
          <div style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '16px',
            alignItems: 'center',
          }}>
            {/* Tile 1: Rohan Sharma (Tutor) */}
            <div style={{
              height: '100%',
              minHeight: '380px',
              background: '#151c2e',
              borderRadius: '16px',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600"
                alt="Rohan Sharma"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Top bookmark icon */}
              <button
                style={{ position: 'absolute', top: '16px', right: '16px', color: '#fff', background: 'rgba(0,0,0,0.4)', borderRadius: '50%', padding: '6px' }}
              >
                <Heart size={16} />
              </button>

              {/* Bottom label */}
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                background: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(6px)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                <span>{tutorName}</span>
              </div>
            </div>

            {/* Tile 2: You (Learner) */}
            <div style={{
              height: '100%',
              minHeight: '380px',
              background: '#151c2e',
              borderRadius: '16px',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {cameraOn ? (
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600"
                  alt="You"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ textAlign: 'center', color: '#64748b' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>
                    Y
                  </div>
                  <span>Camera Off</span>
                </div>
              )}

              {/* Bottom label */}
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                background: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(6px)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                <span>You</span>
              </div>
            </div>
          </div>

          {/* Floating Call Controls Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px',
            marginTop: '16px',
          }}>
            <button
              onClick={() => setMicOn(!micOn)}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: micOn ? 'rgba(255,255,255,0.1)' : '#ef4444',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title={micOn ? 'Mute Mic' : 'Unmute Mic'}
            >
              {micOn ? <Mic size={20} /> : <MicOff size={20} />}
            </button>

            <button
              onClick={() => setCameraOn(!cameraOn)}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: cameraOn ? 'rgba(255,255,255,0.1)' : '#ef4444',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title={cameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
            >
              {cameraOn ? <Video size={20} /> : <VideoOff size={20} />}
            </button>

            <button
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Share Screen"
            >
              <ScreenShare size={20} />
            </button>

            <button
              onClick={() => setActiveTab('Chat')}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Chat"
            >
              <MessageSquare size={20} />
            </button>

            <button
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Participants"
            >
              <Users size={20} />
            </button>

            <button
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="More Options"
            >
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Right Sidebar: Chat, Resources, Notes */}
        <div style={{
          width: '320px',
          background: '#0d1322',
          borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Tab Header */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: '#090e1a',
          }}>
            {['Chat', 'Resources', 'Notes'].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{
                  flex: 1,
                  padding: '12px 0',
                  fontSize: '0.85rem',
                  fontWeight: activeTab === t ? 700 : 500,
                  color: activeTab === t ? '#38bdf8' : '#64748b',
                  borderBottom: activeTab === t ? '2px solid #38bdf8' : 'none',
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            overflowY: 'auto',
          }}>
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: m.sender === 'You' ? 'flex-end' : 'flex-start',
                }}
              >
                <span style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '2px' }}>
                  {m.sender} • {m.time}
                </span>
                <div style={{
                  background: m.sender === 'You' ? '#0d9488' : '#1e293b',
                  color: '#ffffff',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  fontSize: '0.86rem',
                  maxWidth: '85%',
                  lineHeight: 1.4,
                  wordBreak: 'break-word',
                }}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSend} style={{
            padding: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            gap: '8px',
          }}>
            <input
              type="text"
              placeholder="Type a message..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              style={{
                flex: 1,
                background: '#151c2e',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '0.86rem',
                padding: '8px 12px',
              }}
            />
            <button
              type="submit"
              style={{
                background: '#0d9488',
                color: '#fff',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
