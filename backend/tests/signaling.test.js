const http = require('http');
const { io: Client } = require('socket.io-client');
const app = require('../src/app');
const { initWebRTCSignaling } = require('../src/signaling/webrtcSignaling');

describe('WebRTC Socket.IO Signaling Server (Phase 3)', () => {
  let httpServer;
  let ioServer;
  let baseUrl;
  let clientA;
  let clientB;

  beforeAll((done) => {
    httpServer = http.createServer(app);
    ioServer = initWebRTCSignaling(httpServer);
    httpServer.listen(0, '127.0.0.1', () => {
      const { port } = httpServer.address();
      baseUrl = `http://127.0.0.1:${port}`;
      done();
    });
  });

  afterEach(() => {
    if (clientA?.connected) clientA.disconnect();
    if (clientB?.connected) clientB.disconnect();
  });

  afterAll((done) => {
    ioServer.close(() => {
      if (httpServer.listening) {
        httpServer.close(done);
      } else {
        done();
      }
    });
  });

  const connectClient = () =>
    new Promise((resolve) => {
      const client = Client(baseUrl, { transports: ['websocket'] });
      client.on('connect', () => resolve(client));
    });

  test('should allow two peers to join a room and discover each other', async () => {
    clientA = await connectClient();
    clientB = await connectClient();

    const roomId = 'room-test-discovery';

    // 1. Peer A joins first
    const peerAUsers = await new Promise((resolve) => {
      clientA.once('room-users', resolve);
      clientA.emit('join-room', {
        roomId,
        userId: 'user-tejas',
        userName: 'Tejas Kushwaha',
      });
    });

    expect(peerAUsers.roomId).toBe(roomId);
    expect(peerAUsers.peers).toHaveLength(0);

    // 2. Peer B joins; Peer A receives peer-joined and Peer B receives Peer A in room-users
    const [peerJoinedOnA, peerBUsers] = await Promise.all([
      new Promise((resolve) => clientA.once('peer-joined', resolve)),
      new Promise((resolve) => {
        clientB.once('room-users', resolve);
        clientB.emit('join-room', {
          roomId,
          userId: 'user-rohan',
          userName: 'Rohan Sharma',
        });
      }),
    ]);

    expect(peerJoinedOnA.userName).toBe('Rohan Sharma');
    expect(peerBUsers.peers).toHaveLength(1);
    expect(peerBUsers.peers[0].userName).toBe('Tejas Kushwaha');
  });

  test('should relay SDP offers, answers, ICE candidates, media states, chat, and notes', async () => {
    clientA = await connectClient();
    clientB = await connectClient();

    const roomId = 'room-test-negotiation';

    await new Promise((resolve) => {
      clientA.once('room-users', resolve);
      clientA.emit('join-room', { roomId, userId: 'u1', userName: 'Learner' });
    });

    const roomBInfo = await new Promise((resolve) => {
      clientB.once('room-users', resolve);
      clientB.emit('join-room', { roomId, userId: 'u2', userName: 'Tutor' });
    });

    const tutorSocketId = clientB.id;
    const learnerSocketId = roomBInfo.peers[0].socketId;

    // 1. Offer relay B -> A
    const receivedOffer = await new Promise((resolve) => {
      clientA.once('webrtc-offer', resolve);
      clientB.emit('webrtc-offer', {
        targetSocketId: learnerSocketId,
        sdp: { type: 'offer', sdp: 'v=0 mock-offer-sdp' },
        callerName: 'Tutor',
      });
    });
    expect(receivedOffer.fromSocketId).toBe(tutorSocketId);
    expect(receivedOffer.sdp.type).toBe('offer');

    // 2. Answer relay A -> B
    const receivedAnswer = await new Promise((resolve) => {
      clientB.once('webrtc-answer', resolve);
      clientA.emit('webrtc-answer', {
        targetSocketId: tutorSocketId,
        sdp: { type: 'answer', sdp: 'v=0 mock-answer-sdp' },
      });
    });
    expect(receivedAnswer.fromSocketId).toBe(learnerSocketId);
    expect(receivedAnswer.sdp.type).toBe('answer');

    // 3. ICE Candidate relay B -> A
    const receivedIce = await new Promise((resolve) => {
      clientA.once('webrtc-ice-candidate', resolve);
      clientB.emit('webrtc-ice-candidate', {
        targetSocketId: learnerSocketId,
        candidate: { candidate: 'candidate:123', sdpMid: '0', sdpMLineIndex: 0 },
      });
    });
    expect(receivedIce.candidate.candidate).toBe('candidate:123');

    // 4. Media state toggle broadcast
    const receivedMediaState = await new Promise((resolve) => {
      clientA.once('peer-media-state', resolve);
      clientB.emit('media-state-change', {
        roomId,
        micOn: false,
        cameraOn: true,
        screenSharing: true,
      });
    });
    expect(receivedMediaState.micOn).toBe(false);
    expect(receivedMediaState.screenSharing).toBe(true);

    // 5. Real-time chat message broadcast
    const receivedChat = await new Promise((resolve) => {
      clientA.once('room-chat-message', resolve);
      clientB.emit('room-chat-message', {
        roomId,
        sender: 'Tutor',
        text: 'Let us review React hooks!',
      });
    });
    expect(receivedChat.text).toBe('Let us review React hooks!');

    // 6. Collaborative notes sync
    const receivedNotes = await new Promise((resolve) => {
      clientA.once('room-notes-update', resolve);
      clientB.emit('room-notes-update', {
        roomId,
        notes: '# Updated Session Notes',
        updatedBy: 'Tutor',
      });
    });
    expect(receivedNotes.notes).toBe('# Updated Session Notes');
  });

  test('should notify remaining peer when participant leaves or disconnects', async () => {
    clientA = await connectClient();
    clientB = await connectClient();

    const roomId = 'room-test-leave';

    await new Promise((resolve) => {
      clientA.once('room-users', resolve);
      clientA.emit('join-room', { roomId, userId: 'u1', userName: 'Learner' });
    });

    await new Promise((resolve) => {
      clientB.once('room-users', resolve);
      clientB.emit('join-room', { roomId, userId: 'u2', userName: 'Tutor' });
    });

    const departed = await new Promise((resolve) => {
      clientA.once('peer-left', resolve);
      clientB.emit('leave-room');
    });

    expect(departed.userName).toBe('Tutor');
  });
});
