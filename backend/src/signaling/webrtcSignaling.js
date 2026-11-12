const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

/**
 * Initializes Socket.IO signaling server for WebRTC peer-to-peer video sessions.
 * Handles room discovery, SDP offer/answer exchange, ICE candidate forwarding,
 * media toggle sync, in-session chat, and collaborative notes.
 */
const initWebRTCSignaling = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Track participants per room: Map<roomId, Map<socketId, participantInfo>>
  const rooms = new Map();

  // Optional JWT handshake verification for authenticated context
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
      } catch {
        // Allow connection even if demo session uses fallback identity
      }
    }
    next();
  });

  const removeParticipantFromAllRooms = (socket) => {
    for (const [roomId, participants] of rooms.entries()) {
      if (participants.has(socket.id)) {
        const departed = participants.get(socket.id);
        participants.delete(socket.id);
        socket.leave(roomId);

        socket.to(roomId).emit('peer-left', {
          socketId: socket.id,
          userName: departed.userName,
        });

        if (participants.size === 0) {
          rooms.delete(roomId);
        }
      }
    }
  };

  io.on('connection', (socket) => {
    console.log(`[Signaling] Peer connected: ${socket.id}`);

    // 1. Join a WebRTC session room
    socket.on('join-room', ({ roomId, userId, userName, micOn = true, cameraOn = true }) => {
      if (!roomId) return;

      // Leave any stale rooms first
      removeParticipantFromAllRooms(socket);

      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Map());
      }

      const roomParticipants = rooms.get(roomId);
      const existingPeers = Array.from(roomParticipants.values());

      const participant = {
        socketId: socket.id,
        userId: userId || socket.userId || socket.id,
        userName: userName || 'Peer Student',
        micOn,
        cameraOn,
        screenSharing: false,
      };

      roomParticipants.set(socket.id, participant);
      socket.join(roomId);

      // Send existing peers to the newcomer so it can initiate WebRTC offers
      socket.emit('room-users', {
        roomId,
        selfSocketId: socket.id,
        peers: existingPeers,
      });

      // Notify existing peers about the newcomer
      socket.to(roomId).emit('peer-joined', participant);

      console.log(
        `[Signaling] ${participant.userName} (${socket.id}) joined room "${roomId}". Total peers: ${roomParticipants.size}`
      );
    });

    // 2. Relay WebRTC SDP Offer
    socket.on('webrtc-offer', ({ targetSocketId, sdp, callerName }) => {
      if (!targetSocketId || !sdp) return;
      io.to(targetSocketId).emit('webrtc-offer', {
        fromSocketId: socket.id,
        sdp,
        callerName,
      });
    });

    // 3. Relay WebRTC SDP Answer
    socket.on('webrtc-answer', ({ targetSocketId, sdp }) => {
      if (!targetSocketId || !sdp) return;
      io.to(targetSocketId).emit('webrtc-answer', {
        fromSocketId: socket.id,
        sdp,
      });
    });

    // 4. Relay ICE Candidates
    socket.on('webrtc-ice-candidate', ({ targetSocketId, candidate }) => {
      if (!targetSocketId || !candidate) return;
      io.to(targetSocketId).emit('webrtc-ice-candidate', {
        fromSocketId: socket.id,
        candidate,
      });
    });

    // 5. Relay Mic/Camera/ScreenShare State Changes
    socket.on('media-state-change', ({ roomId, micOn, cameraOn, screenSharing }) => {
      const roomParticipants = rooms.get(roomId);
      if (roomParticipants && roomParticipants.has(socket.id)) {
        const peer = roomParticipants.get(socket.id);
        peer.micOn = micOn;
        peer.cameraOn = cameraOn;
        peer.screenSharing = screenSharing;
      }

      socket.to(roomId).emit('peer-media-state', {
        socketId: socket.id,
        micOn,
        cameraOn,
        screenSharing,
      });
    });

    // 6. Real-Time In-Session Chat Message
    socket.on('room-chat-message', ({ roomId, sender, text, time }) => {
      if (!roomId || !text) return;
      socket.to(roomId).emit('room-chat-message', {
        id: `${Date.now()}-${socket.id}`,
        senderSocketId: socket.id,
        sender: sender || 'Peer',
        text,
        time: time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    });

    // 7. Real-Time Collaborative Session Notes Sync
    socket.on('room-notes-update', ({ roomId, notes, updatedBy }) => {
      if (!roomId) return;
      socket.to(roomId).emit('room-notes-update', {
        notes,
        updatedBy,
      });
    });

    // 8. Leave / Disconnect cleanup
    socket.on('leave-room', () => {
      removeParticipantFromAllRooms(socket);
    });

    socket.on('disconnect', () => {
      console.log(`[Signaling] Peer disconnected: ${socket.id}`);
      removeParticipantFromAllRooms(socket);
    });
  });

  return io;
};

module.exports = { initWebRTCSignaling };
