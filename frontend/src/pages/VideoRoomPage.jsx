import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  MessageSquare,
  Users,
  PhoneOff,
  Send,
  Copy,
  Check,
  Wifi,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWebRTC } from '../hooks/useWebRTC';
import { VideoTile } from '../components/VideoTile';

export const VideoRoomPage = ({ sessionInfo, onEndSession, onNavigate }) => {
  const { user } = useAuth();
  const roomId = sessionInfo?.roomId || 'room-skillswap-demo';
  const tutorName = sessionInfo?.tutorName || 'Rohan Sharma';
  const skillName = sessionInfo?.skill || 'Web Development';

  const {
    localStream,
    screenStream,
    remotePeers,
    micOn,
    cameraOn,
    screenSharing,
    connectionStatus,
    mediaError,
    messages,
    sharedNotes,
    toggleMic,
    toggleCamera,
    toggleScreenShare,
    sendChatMessage,
    updateSharedNotes,
  } = useWebRTC({ roomId, user });

  const [activeTab, setActiveTab] = useState('Chat');
  const [inputMsg, setInputMsg] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [copiedRoom, setCopiedRoom] = useState(false);

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
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    sendChatMessage(inputMsg);
    setInputMsg('');
  };

  const handleCopyRoomId = () => {
    navigator.clipboard?.writeText(roomId);
    setCopiedRoom(true);
    setTimeout(() => setCopiedRoom(false), 2000);
  };

  const localDisplayStream = screenSharing && screenStream ? screenStream : localStream;

  return (
    <div
      style={{
        backgroundColor: '#0b0f19',
        color: '#ffffff',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* 1. Top Bar */}
      <div
        style={{
          padding: '12px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#070a12',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/logo.png" alt="Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
            <strong style={{ fontSize: '1.1rem', letterSpacing: '-0.01em' }}>Skill Swap</strong>
          </div>

          <div
            style={{
              background: 'rgba(13, 148, 136, 0.16)',
              border: '1px solid rgba(13, 148, 136, 0.45)',
              padding: '4px 12px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#5eead4',
            }}
          >
            {skillName}
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              padding: '4px 12px',
              fontSize: '0.84rem',
              fontFamily: 'monospace',
              color: '#38bdf8',
            }}
          >
            ⏱ {formatTimer(seconds)}
          </div>

          {/* Signaling / P2P Connection Status */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              color: connectionStatus === 'connected' ? '#10b981' : '#f59e0b',
              fontWeight: 600,
            }}
          >
            <Wifi size={14} />
            <span>
              {connectionStatus === 'connected'
                ? `Live P2P (${remotePeers.length + 1} in room)`
                : 'Signaling Connected — Waiting for Peer'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Room ID Copy Pill */}
          <button
            onClick={handleCopyRoomId}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#cbd5e1',
              padding: '6px 12px',
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            title="Copy Room ID to join from another tab/device"
          >
            {copiedRoom ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>Room: {roomId}</span>
          </button>

          <button
            onClick={() => (onEndSession ? onEndSession() : onNavigate?.('dashboard'))}
            style={{
              background: '#ef4444',
              color: '#ffffff',
              padding: '7px 16px',
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

      {/* Hardware / Permission Notice Banner (only if camera/mic blocked or missing) */}
      {mediaError && (
        <div
          style={{
            background: '#451a03',
            borderBottom: '1px solid #d97706',
            color: '#fde68a',
            padding: '6px 24px',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={15} />
          <span>{mediaError} (Chat, Notes & remote viewing remain active)</span>
        </div>
      )}

      {/* 2. Main Stage: Video Grid + Sidebar */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: WebRTC Video Area */}
        <div
          style={{
            flex: 1,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflowY: 'auto',
          }}
        >
          {/* Peer Video Grid */}
          <div
            style={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '16px',
              alignItems: 'stretch',
            }}
          >
            {/* Remote Peer Tile(s) */}
            {remotePeers.length > 0 ? (
              remotePeers.map((peer) => (
                <VideoTile
                  key={peer.socketId}
                  stream={peer.stream}
                  label={peer.userName}
                  isLocal={false}
                  cameraOn={peer.cameraOn}
                  micOn={peer.micOn}
                  screenSharing={peer.screenSharing}
                />
              ))
            ) : (
              <VideoTile
                stream={null}
                label={tutorName}
                isLocal={false}
                cameraOn={false}
                micOn={true}
                statusText={`Open a second tab at Room "${roomId}" to test live P2P WebRTC video`}
              />
            )}

            {/* Local Self Tile */}
            <VideoTile
              stream={localDisplayStream}
              label={`${user?.name || 'You'} (You)`}
              isLocal={true}
              cameraOn={cameraOn}
              micOn={micOn}
              screenSharing={screenSharing}
              statusText={mediaError || 'Camera Off'}
            />
          </div>

          {/* Floating Call Controls Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              marginTop: '16px',
            }}
          >
            <button
              onClick={toggleMic}
              style={{
                width: '48px',
                height: '48px',
                background: micOn ? 'rgba(255,255,255,0.1)' : '#ef4444',
                border: '1px solid rgba(255,255,255,0.12)',
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
              onClick={toggleCamera}
              style={{
                width: '48px',
                height: '48px',
                background: cameraOn ? 'rgba(255,255,255,0.1)' : '#ef4444',
                border: '1px solid rgba(255,255,255,0.12)',
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
              onClick={toggleScreenShare}
              style={{
                width: '48px',
                height: '48px',
                background: screenSharing ? '#0d9488' : 'rgba(255,255,255,0.1)',
                border: screenSharing
                  ? '1px solid #14b8a6'
                  : '1px solid rgba(255,255,255,0.12)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title={screenSharing ? 'Stop Sharing Screen' : 'Share Screen'}
            >
              <ScreenShare size={20} />
            </button>

            <button
              onClick={() => setActiveTab('Chat')}
              style={{
                width: '48px',
                height: '48px',
                background: activeTab === 'Chat' ? '#0d9488' : 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="In-Session Chat"
            >
              <MessageSquare size={20} />
            </button>

            <button
              onClick={() => setActiveTab('Notes')}
              style={{
                width: '48px',
                height: '48px',
                background: activeTab === 'Notes' ? '#0d9488' : 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Collaborative Notes"
            >
              <FileText size={20} />
            </button>

            <div
              style={{
                height: '48px',
                padding: '0 14px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.84rem',
                color: '#cbd5e1',
              }}
              title="Active Participants"
            >
              <Users size={18} />
              <span>{remotePeers.length + 1}</span>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Live Chat, Resources, Notes */}
        <div
          style={{
            width: '340px',
            background: '#0d1322',
            borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Tab Header */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              background: '#090e1a',
            }}
          >
            {['Chat', 'Notes', 'Resources'].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{
                  flex: 1,
                  padding: '12px 0',
                  fontSize: '0.85rem',
                  fontWeight: activeTab === t ? 700 : 500,
                  color: activeTab === t ? '#5eead4' : '#64748b',
                  borderBottom: activeTab === t ? '2px solid #0d9488' : 'none',
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'Chat' && (
            <>
              <div
                style={{
                  flex: 1,
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  overflowY: 'auto',
                }}
              >
                {messages.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: m.isSystem
                        ? 'center'
                        : m.sender === 'You'
                        ? 'flex-end'
                        : 'flex-start',
                    }}
                  >
                    {!m.isSystem && (
                      <span style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '2px' }}>
                        {m.sender} • {m.time}
                      </span>
                    )}
                    <div
                      style={{
                        background: m.isSystem
                          ? 'rgba(255,255,255,0.05)'
                          : m.sender === 'You'
                          ? '#0d9488'
                          : '#1e293b',
                        color: m.isSystem ? '#94a3b8' : '#ffffff',
                        padding: m.isSystem ? '6px 10px' : '8px 12px',
                        fontSize: m.isSystem ? '0.76rem' : '0.86rem',
                        maxWidth: m.isSystem ? '100%' : '85%',
                        textAlign: m.isSystem ? 'center' : 'left',
                        lineHeight: 1.4,
                        wordBreak: 'break-word',
                      }}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form
                onSubmit={handleSend}
                style={{
                  padding: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  gap: '8px',
                }}
              >
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  style={{
                    flex: 1,
                    background: '#151c2e',
                    border: '1px solid rgba(255,255,255,0.12)',
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
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Send size={16} />
                </button>
              </form>
            </>
          )}

          {activeTab === 'Notes' && (
            <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '0.78rem', color: '#5eead4', fontWeight: 700 }}>
                LIVE SHARED NOTES (Synced via Socket.IO)
              </span>
              <textarea
                value={sharedNotes}
                onChange={(e) => updateSharedNotes(e.target.value)}
                placeholder="Write session takeaways or code snippets here..."
                style={{
                  flex: 1,
                  width: '100%',
                  background: '#151c2e',
                  color: '#e2e8f0',
                  border: '1px solid rgba(255,255,255,0.12)',
                  padding: '12px',
                  fontSize: '0.86rem',
                  fontFamily: 'monospace',
                  resize: 'none',
                  lineHeight: 1.5,
                }}
              />
            </div>
          )}

          {activeTab === 'Resources' && (
            <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: '#151c2e', padding: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginBottom: '4px' }}>WEBRTC ICE TRANSPORT</div>
                <strong style={{ fontSize: '0.86rem', color: '#5eead4' }}>Google Public STUN + SRTP/DTLS</strong>
              </div>
              <div style={{ background: '#151c2e', padding: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginBottom: '4px' }}>ACTIVE ROOM ID</div>
                <code style={{ fontSize: '0.85rem', color: '#fff' }}>{roomId}</code>
              </div>
              <div style={{ background: '#151c2e', padding: '12px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                To test peer-to-peer streaming locally, open <strong>http://localhost:3000</strong> in another browser tab and enter the Video Room with matching Room ID <code>{roomId}</code>.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
