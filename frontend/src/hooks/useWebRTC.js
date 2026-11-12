import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

/**
 * Custom React hook encapsulating WebRTC peer-to-peer audio/video streaming,
 * Socket.IO signaling, screen sharing, in-call chat, and collaborative notes.
 */
export const useWebRTC = ({ roomId, user }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remotePeers, setRemotePeers] = useState([]); // [{ socketId, userName, stream, micOn, cameraOn, screenSharing }]
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('initializing'); // initializing | waiting | connected | error
  const [mediaError, setMediaError] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'sys-welcome',
      sender: 'System',
      text: 'WebRTC encrypted P2P room ready. Invite or wait for your peer to join this Room ID.',
      time: 'Now',
      isSystem: true,
    },
  ]);
  const [sharedNotes, setSharedNotes] = useState(
    '# Session Notes\n- Share key concepts and code snippets here in real time.\n'
  );

  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const peerConnectionsRef = useRef(new Map()); // Map<socketId, RTCPeerConnection>
  const pendingIceRef = useRef(new Map()); // Map<socketId, RTCIceCandidateInit[]>
  const peerMetaRef = useRef(new Map()); // Map<socketId, { userName, micOn, cameraOn, screenSharing }>

  const userName = user?.name || 'You';
  const userId = user?._id || `guest-${Math.random().toString(36).slice(2, 8)}`;

  const syncRemotePeersState = useCallback(() => {
    const list = [];
    for (const [socketId, meta] of peerMetaRef.current.entries()) {
      list.push({
        socketId,
        userName: meta.userName || 'Peer Student',
        stream: meta.stream || null,
        micOn: meta.micOn ?? true,
        cameraOn: meta.cameraOn ?? true,
        screenSharing: meta.screenSharing ?? false,
      });
    }
    setRemotePeers(list);
    setConnectionStatus(list.length > 0 ? 'connected' : 'waiting');
  }, []);

  const flushPendingIce = useCallback(async (socketId, pc) => {
    const queued = pendingIceRef.current.get(socketId) || [];
    for (const candidate of queued) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.warn('[WebRTC] Failed adding buffered ICE candidate:', err);
      }
    }
    pendingIceRef.current.delete(socketId);
  }, []);

  const createPeerConnection = useCallback(
    (targetSocketId) => {
      // Reuse if existing
      if (peerConnectionsRef.current.has(targetSocketId)) {
        return peerConnectionsRef.current.get(targetSocketId);
      }

      const pc = new RTCPeerConnection(ICE_SERVERS);

      // Attach local camera/mic tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current);
        });
      }

      // If screen sharing is active, ensure video sender carries screen track
      if (screenStreamRef.current) {
        const screenTrack = screenStreamRef.current.getVideoTracks()[0];
        const videoSender = pc.getSenders().find((s) => s.track?.kind === 'video');
        if (videoSender && screenTrack) {
          videoSender.replaceTrack(screenTrack).catch(() => {});
        }
      }

      // Send ICE candidates via signaling server
      pc.onicecandidate = (event) => {
        if (event.candidate && socketRef.current) {
          socketRef.current.emit('webrtc-ice-candidate', {
            targetSocketId,
            candidate: event.candidate,
          });
        }
      };

      // Receive remote peer stream
      pc.ontrack = (event) => {
        const [remoteStream] = event.streams;
        const prevMeta = peerMetaRef.current.get(targetSocketId) || {};
        peerMetaRef.current.set(targetSocketId, {
          ...prevMeta,
          stream: remoteStream,
        });
        syncRemotePeersState();
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
          peerConnectionsRef.current.delete(targetSocketId);
        }
      };

      peerConnectionsRef.current.set(targetSocketId, pc);
      return pc;
    },
    [syncRemotePeersState]
  );

  // Main WebRTC & Signaling Lifecycle
  useEffect(() => {
    if (!roomId) return;
    let isMounted = true;

    const initMediaAndSocket = async () => {
      // 1. Capture Local Audio/Video (gracefully handle missing hardware/permissions)
      try {
        if (navigator.mediaDevices?.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          if (!isMounted) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          localStreamRef.current = stream;
          setLocalStream(stream);
        } else {
          setMediaError('Browser mediaDevices API unavailable — Receive-Only mode');
        }
      } catch (err) {
        // Fallback to audio-only if camera fails
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
          if (!isMounted) {
            audioStream.getTracks().forEach((t) => t.stop());
            return;
          }
          localStreamRef.current = audioStream;
          setLocalStream(audioStream);
          setCameraOn(false);
          setMediaError('Camera unavailable — joined with Audio Only');
        } catch {
          setCameraOn(false);
          setMicOn(false);
          setMediaError(
            err?.name === 'NotAllowedError'
              ? 'Camera/Mic permission denied — Receive-Only mode'
              : 'No Camera/Mic detected — Receive-Only mode'
          );
        }
      }

      if (!isMounted) return;

      // 2. Connect to Socket.IO Signaling Server
      const token = localStorage.getItem('skillswap_token');
      const socket = io('/', {
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        auth: { token },
      });
      socketRef.current = socket;

      socket.on('connect', () => {
        setConnectionStatus('waiting');
        socket.emit('join-room', {
          roomId,
          userId,
          userName,
          micOn: Boolean(localStreamRef.current?.getAudioTracks()[0]?.enabled),
          cameraOn: Boolean(localStreamRef.current?.getVideoTracks()[0]?.enabled),
        });
      });

      // Handle initial room peers -> initiate WebRTC Offers to existing peers
      socket.on('room-users', async ({ peers }) => {
        for (const peer of peers) {
          peerMetaRef.current.set(peer.socketId, {
            userName: peer.userName,
            micOn: peer.micOn,
            cameraOn: peer.cameraOn,
            screenSharing: peer.screenSharing,
            stream: null,
          });

          const pc = createPeerConnection(peer.socketId);
          try {
            const offer = await pc.createOffer({
              offerToReceiveAudio: true,
              offerToReceiveVideo: true,
            });
            await pc.setLocalDescription(offer);
            socket.emit('webrtc-offer', {
              targetSocketId: peer.socketId,
              sdp: pc.localDescription,
              callerName: userName,
            });
          } catch (err) {
            console.error('[WebRTC] Failed creating offer:', err);
          }
        }
        syncRemotePeersState();
      });

      // Handle a newly joined peer -> store metadata & wait for their offer
      socket.on('peer-joined', (peer) => {
        peerMetaRef.current.set(peer.socketId, {
          userName: peer.userName,
          micOn: peer.micOn,
          cameraOn: peer.cameraOn,
          screenSharing: peer.screenSharing,
          stream: null,
        });
        syncRemotePeersState();
        setMessages((prev) => [
          ...prev,
          {
            id: `sys-join-${Date.now()}`,
            sender: 'System',
            text: `${peer.userName} joined the session.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSystem: true,
          },
        ]);
      });

      // Handle incoming WebRTC SDP Offer -> reply with Answer
      socket.on('webrtc-offer', async ({ fromSocketId, sdp, callerName }) => {
        const existingMeta = peerMetaRef.current.get(fromSocketId) || {};
        peerMetaRef.current.set(fromSocketId, {
          ...existingMeta,
          userName: existingMeta.userName || callerName || 'Peer Student',
        });

        const pc = createPeerConnection(fromSocketId);
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(sdp));
          await flushPendingIce(fromSocketId, pc);

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('webrtc-answer', {
            targetSocketId: fromSocketId,
            sdp: pc.localDescription,
          });
        } catch (err) {
          console.error('[WebRTC] Error handling SDP offer:', err);
        }
      });

      // Handle incoming WebRTC SDP Answer
      socket.on('webrtc-answer', async ({ fromSocketId, sdp }) => {
        const pc = peerConnectionsRef.current.get(fromSocketId);
        if (!pc) return;
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(sdp));
          await flushPendingIce(fromSocketId, pc);
        } catch (err) {
          console.error('[WebRTC] Error setting remote SDP answer:', err);
        }
      });

      // Handle incoming ICE candidate
      socket.on('webrtc-ice-candidate', async ({ fromSocketId, candidate }) => {
        const pc = peerConnectionsRef.current.get(fromSocketId);
        if (pc && pc.remoteDescription) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
            console.warn('[WebRTC] Failed adding ICE candidate:', err);
          }
        } else {
          // Buffer until remoteDescription is set
          const queue = pendingIceRef.current.get(fromSocketId) || [];
          queue.push(candidate);
          pendingIceRef.current.set(fromSocketId, queue);
        }
      });

      // Peer media toggles
      socket.on('peer-media-state', ({ socketId, micOn: pMic, cameraOn: pCam, screenSharing: pScreen }) => {
        const meta = peerMetaRef.current.get(socketId);
        if (meta) {
          peerMetaRef.current.set(socketId, {
            ...meta,
            micOn: pMic,
            cameraOn: pCam,
            screenSharing: pScreen,
          });
          syncRemotePeersState();
        }
      });

      // Real-time chat receive
      socket.on('room-chat-message', (msg) => {
        setMessages((prev) => [...prev, msg]);
      });

      // Real-time collaborative notes sync
      socket.on('room-notes-update', ({ notes }) => {
        setSharedNotes(notes);
      });

      // Peer departed
      socket.on('peer-left', ({ socketId, userName: leftName }) => {
        const pc = peerConnectionsRef.current.get(socketId);
        if (pc) {
          pc.close();
          peerConnectionsRef.current.delete(socketId);
        }
        peerMetaRef.current.delete(socketId);
        pendingIceRef.current.delete(socketId);
        syncRemotePeersState();

        setMessages((prev) => [
          ...prev,
          {
            id: `sys-left-${Date.now()}`,
            sender: 'System',
            text: `${leftName || 'Peer'} left the session.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSystem: true,
          },
        ]);
      });
    };

    initMediaAndSocket();

    // Full cleanup on unmount
    return () => {
      isMounted = false;
      if (socketRef.current) {
        socketRef.current.emit('leave-room');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      for (const pc of peerConnectionsRef.current.values()) {
        pc.close();
      }
      peerConnectionsRef.current.clear();
      peerMetaRef.current.clear();
      pendingIceRef.current.clear();

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
        screenStreamRef.current = null;
      }
    };
  }, [roomId, userId, userName, createPeerConnection, flushPendingIce, syncRemotePeersState]);

  const emitMediaState = useCallback(
    (nextMic, nextCam, nextScreen) => {
      socketRef.current?.emit('media-state-change', {
        roomId,
        micOn: nextMic,
        cameraOn: nextCam,
        screenSharing: nextScreen,
      });
    },
    [roomId]
  );

  const toggleMic = useCallback(() => {
    const nextMic = !micOn;
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((t) => {
        t.enabled = nextMic;
      });
    }
    setMicOn(nextMic);
    emitMediaState(nextMic, cameraOn, screenSharing);
  }, [micOn, cameraOn, screenSharing, emitMediaState]);

  const toggleCamera = useCallback(() => {
    const nextCam = !cameraOn;
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((t) => {
        t.enabled = nextCam;
      });
    }
    setCameraOn(nextCam);
    emitMediaState(micOn, nextCam, screenSharing);
  }, [micOn, cameraOn, screenSharing, emitMediaState]);

  const stopScreenShare = useCallback(() => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
    }
    const camTrack = localStreamRef.current?.getVideoTracks()[0] || null;
    for (const pc of peerConnectionsRef.current.values()) {
      const videoSender = pc.getSenders().find((s) => s.track?.kind === 'video');
      if (videoSender && camTrack) {
        videoSender.replaceTrack(camTrack).catch(() => {});
      }
    }
    setScreenSharing(false);
    emitMediaState(micOn, cameraOn, false);
  }, [micOn, cameraOn, emitMediaState]);

  const toggleScreenShare = useCallback(async () => {
    if (screenSharing) {
      stopScreenShare();
      return;
    }

    if (!navigator.mediaDevices?.getDisplayMedia) {
      alert('Screen sharing is not supported in this browser.');
      return;
    }

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = screenStream.getVideoTracks()[0];
      screenStreamRef.current = screenStream;

      for (const pc of peerConnectionsRef.current.values()) {
        const videoSender = pc.getSenders().find((s) => s.track?.kind === 'video');
        if (videoSender) {
          await videoSender.replaceTrack(screenTrack);
        }
      }

      screenTrack.onended = () => {
        stopScreenShare();
      };

      setScreenSharing(true);
      emitMediaState(micOn, cameraOn, true);
    } catch (err) {
      console.warn('[WebRTC] Screen share cancelled or denied:', err.message);
    }
  }, [screenSharing, stopScreenShare, micOn, cameraOn, emitMediaState]);

  const sendChatMessage = useCallback(
    (text) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const msgObj = {
        id: `${Date.now()}-self`,
        sender: 'You',
        text: trimmed,
        time,
      };
      setMessages((prev) => [...prev, msgObj]);
      socketRef.current?.emit('room-chat-message', {
        roomId,
        sender: userName,
        text: trimmed,
        time,
      });
    },
    [roomId, userName]
  );

  const updateSharedNotes = useCallback(
    (nextNotes) => {
      setSharedNotes(nextNotes);
      socketRef.current?.emit('room-notes-update', {
        roomId,
        notes: nextNotes,
        updatedBy: userName,
      });
    },
    [roomId, userName]
  );

  return {
    localStream,
    screenStream: screenStreamRef.current,
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
  };
};
