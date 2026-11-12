import React, { useEffect, useRef } from 'react';
import { MicOff, Monitor, VideoOff } from 'lucide-react';

/**
 * Renders a peer or local WebRTC video stream tile with status badges
 * and clean fallback UI when camera is turned off or unavailable.
 */
export const VideoTile = ({
  stream,
  label,
  isLocal = false,
  cameraOn = true,
  micOn = true,
  screenSharing = false,
  statusText = '',
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (stream) {
      videoEl.srcObject = stream;
    } else {
      videoEl.srcObject = null;
    }
  }, [stream]);

  const showVideo = Boolean(stream) && (cameraOn || screenSharing);

  return (
    <div
      style={{
        height: '100%',
        minHeight: '360px',
        background: '#151c2e',
        border: screenSharing ? '2px solid #0d9488' : '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Active HTML5 Video Stream */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        style={{
          width: '100%',
          height: '100%',
          objectFit: screenSharing ? 'contain' : 'cover',
          display: showVideo ? 'block' : 'none',
          transform: isLocal && !screenSharing ? 'scaleX(-1)' : 'none',
        }}
      />

      {/* Fallback Avatar / Waiting State */}
      {!showVideo && (
        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>
          <div
            style={{
              width: '84px',
              height: '84px',
              background: '#1e293b',
              border: '2px solid #0d9488',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              fontSize: '2rem',
              fontWeight: 800,
              color: '#ffffff',
            }}
          >
            {(label || 'P').charAt(0).toUpperCase()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 600 }}>
            <VideoOff size={16} color="#64748b" />
            <span>{statusText || (stream ? 'Camera Off' : 'Waiting for Peer Video...')}</span>
          </div>
        </div>
      )}

      {/* Top Left Screen Share Badge */}
      {screenSharing && (
        <div
          style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            background: '#0d9488',
            color: '#ffffff',
            padding: '4px 10px',
            fontSize: '0.76rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Monitor size={14} />
          <span>Screen Sharing</span>
        </div>
      )}

      {/* Top Right Mic Muted Badge */}
      {!micOn && (
        <div
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            background: '#ef4444',
            color: '#ffffff',
            padding: '5px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.75rem',
            fontWeight: 700,
          }}
          title="Microphone Muted"
        >
          <MicOff size={14} />
          <span>Muted</span>
        </div>
      )}

      {/* Bottom Label Tag */}
      <div
        style={{
          position: 'absolute',
          bottom: '14px',
          left: '14px',
          background: 'rgba(0, 0, 0, 0.72)',
          backdropFilter: 'blur(6px)',
          padding: '6px 12px',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            background: stream ? '#10b981' : '#f59e0b',
          }}
        />
        <span>{label}</span>
      </div>
    </div>
  );
};
