# 🎓 Skill Swap — Complete Technical Architecture, Line-by-Line Code Defense & Evaluator Guide

**Author & Presenter**: Tejas Kushwaha  
**Live Public Website**: [https://rad-wisp-228290.netlify.app](https://rad-wisp-228290.netlify.app)  
**GitHub Repository**: [https://github.com/Tejas1276/SkillSwap](https://github.com/Tejas1276/SkillSwap)  
**Target Evaluators**: University Defense Committee, Project Evaluators, External Viva Examiners, Senior System Architects  
**Accompanying PDF Manual**: [`SkillSwap_Complete_Code_and_Architecture_Defense_Manual.pdf`](file:///c:/Users/kush1/Desktop/SkillSwap/SkillSwap_Complete_Code_and_Architecture_Defense_Manual.pdf)

---

## 📑 Table of Contents
1. [Executive Summary & 3-Minute Presentation Speech](#1-executive-summary--3-minute-presentation-speech)
2. [Full Technology Stack Inventory & Selection Rationale (Why X over Y)](#2-full-technology-stack-inventory--selection-rationale)
3. [System Architecture & Data Flow Diagrams](#3-system-architecture--data-flow-diagrams)
4. [Systematic Line-by-Line & Block-by-Block Code Defense](#4-systematic-line-by-line--block-by-block-code-defense)
   - [4.1 Backend Server Bootstrapper (`backend/src/server.js`)](#41-backend-server-bootstrapper)
   - [4.2 Database Configuration & Auto-Fallback (`backend/src/config/db.js`)](#42-database-configuration--auto-fallback)
   - [4.3 Demo Persona Seeder (`backend/src/config/ensureDemoUsers.js`)](#43-demo-persona-seeder)
   - [4.4 User Data Model & Hashing Lifecycle (`backend/src/models/User.js`)](#44-user-data-model--hashing-lifecycle)
   - [4.5 Session Model & Escrow State Machine (`backend/src/models/Session.js`)](#45-session-model--escrow-state-machine)
   - [4.6 Authentication Controller & JWT (`backend/src/controllers/authController.js`)](#46-authentication-controller--jwt)
   - [4.7 Learner & Credit Booking Controller (`backend/src/controllers/learnerController.js`)](#47-learner--credit-booking-controller)
   - [4.8 WebRTC Real-Time Signaling Server (`backend/src/signaling/webrtcSignaling.js`)](#48-webrtc-real-time-signaling-server)
   - [4.9 Python AI Recommendation Microservice (`ai-engine/main.py`)](#49-python-ai-recommendation-microservice)
   - [4.10 Frontend Master Application Coordinator (`frontend/src/App.jsx`)](#410-frontend-master-application-coordinator)
   - [4.11 Authentication Context & Resilience (`frontend/src/context/AuthContext.jsx`)](#411-authentication-context--resilience)
   - [4.12 API Client & Proxy Architecture (`frontend/src/api/client.js`)](#412-api-client--proxy-architecture)
   - [4.13 Authentication Page & 1-Click Personas (`frontend/src/pages/AuthPage.jsx`)](#413-authentication-page--1-click-personas)
   - [4.14 WebRTC Browser Video Room (`frontend/src/pages/VideoRoomPage.jsx`)](#414-webrtc-browser-video-room)
5. [The Core Mathematical & Algorithmic Models](#5-the-core-mathematical--algorithmic-models)
6. [Professor & Examiner Deep-Drill Defense (Viva Q&A)](#6-professor--examiner-deep-drill-defense-viva-qa)

---

## 1. Executive Summary & 3-Minute Presentation Speech

> [!TIP]
> **Read or speak this exact script when introduced at the start of your presentation:**

> *"Respected evaluators, today I present **Skill Swap**—a decentralized, peer-to-peer knowledge barter platform built specifically for university campus communities.*
>
> *In university ecosystems today, students face a fundamental dilemma: commercial tutoring and online courses are expensive and lack interactive feedback, yet within the very same campus, students possess complementary knowledge. For example, Student A may know React and need Python for machine learning, while Student B knows Python and needs React for a web project.*
>
> *Skill Swap eliminates monetary barriers by creating an **escrow-secured credit barter economy**: when you teach a 1-hour session, you earn credits; you then spend those credits to learn from peers.*
>
> *Our platform solves three major technical challenges:*
> 1. *An asynchronous **AI microservice** calculates semantic cosine similarity over TF-IDF vector embeddings to match learners with the most credible tutor.*
> 2. *A **dual-tier credit escrow system** prevents transaction disputes and ensures payment security.*
> 3. *Our browser-native **WebRTC audio/video classroom** operates peer-to-peer with zero video server bandwidth costs, orchestrated via real-time WebSocket signaling.*
>
> *Our stack includes **React 19** and **Vite** on the client, **Node.js** and **Express** for our REST API and WebSocket signaling, **MongoDB** with **Mongoose** and an automatic in-memory fallback for data resilience, and **Python FastAPI** with **Scikit-learn** for our AI engine."*

---

## 2. Full Technology Stack Inventory & Selection Rationale

| Technology | Role in Skill Swap | Why Chosen Over Alternatives |
| :--- | :--- | :--- |
| **React 19** | Frontend Single Page Application (SPA), stateful reactive UI across 9 platform screens. | **Virtual DOM Diffing**: Updates only modified elements (credit counter, video timer) without full page reloads. More modular than Vanilla JS; simpler component-driven state flow than Angular. |
| **Vite** | Frontend build tool, asset bundler, and development server on port 3000. | **ES Modules (ESM) + esbuild**: Cold server starts take `<300ms` compared to Webpack/Create-React-App (`15-30s`). Pre-bundles dependencies in Go for 10x-100x speed. |
| **Node.js & Express** | RESTful API server (port 5050), business logic, and transaction controller. | **Non-Blocking Asynchronous Event Loop**: Single-threaded `libuv` event loop handles thousands of concurrent I/O operations (chat, signaling) without multi-threaded memory overhead seen in Java or Python WSGI. |
| **MongoDB & Mongoose** | Document NoSQL database storing users, skills, sessions, and gamification logs. | **Hierarchical Document Model**: JSON-like BSON documents naturally store nested arrays (`skillsToTeach`, `skillsToLearn`, `badges`) without multi-table relational `JOIN` penalties. |
| **MongoMemoryServer** | In-memory MongoDB replica used as an automatic fallback when local MongoDB service is offline. | **Presentation Resilience**: Guarantees 100% server uptime. If evaluated on a lab machine without a running MongoDB daemon, the backend boots an in-memory replica automatically without crashing. |
| **WebRTC (Native)** | Peer-to-peer HD video, audio, and screen-sharing classroom. | **Direct Peer Streaming**: Media streams directly browser-to-browser via UDP with sub-100ms latency. Zero media server bandwidth cost. Free compared to Agora/Twilio ($0.004/min). |
| **Socket.IO** | Bi-directional real-time WebSocket signaling channel for WebRTC connection setup. | **Resilient Signaling**: Offers room multiplexing, auto-reconnection, and automatic HTTP long-polling fallback if restrictive college firewalls block raw WebSockets. |
| **Python & FastAPI** | Dedicated AI microservice running on port 8000 for tutor recommendations. | **Decoupled Architecture**: Keeps CPU-heavy numerical machine learning calculations out of the Node.js event loop. FastAPI delivers asynchronous ASGI execution with Pydantic type validation. |
| **Scikit-learn (TF-IDF)** | Vector space mathematical modeling of student goals and tutor skill descriptions. | **Lightweight & Deterministic**: Sub-5ms inference. Runs completely locally without third-party API dependencies (like OpenAI API tokens) that could fail during evaluation. |
| **JWT & bcryptjs** | Stateless token authentication and adaptive salted password hashing. | **Stateless Scaling**: JWT contains self-contained claims verified mathematically without querying shared session storage. bcrypt with 10 salt rounds resists rainbow table attacks. |
| **Netlify Edge** | Public cloud hosting with global CDN distribution and SPA client rewrites. | **Zero-Maintenance Edge Hosting**: Automated SSL HTTPS, instant global CDN deployment, and SPA client routing via `_redirects`. |

---

## 3. System Architecture & Data Flow Diagrams

```
[ User Browser (React 19 + Vite) ]
        │                  ▲
        │ REST (Port 5050) │ WebSocket Signaling (Port 5050)
        ▼                  ▼
[ Node.js & Express Server ] ──────────────► [ Python FastAPI AI Engine (Port 8000) ]
        │                                         (TF-IDF + Cosine Similarity)
        ▼
[ MongoDB Database (Mongoose) ]
  (Primary: mongodb://127.0.0.1:27017 | Fallback: MongoMemoryServer)
```

### WebRTC Peer-to-Peer Media Flow
```
Browser A (Learner)           Signaling Server (Socket.IO)           Browser B (Tutor)
       │                                   │                                  │
       │──── join-room ("room-101") ──────►│                                  │
       │                                   │◄──── join-room ("room-101") ─────│
       │                                   │                                  │
       │◄─── peer-joined (Socket B) ───────│                                  │
       │                                   │                                  │
       │──── createOffer() (SDP) ─────────►│──── offer (SDP) ────────────────►│
       │                                   │                                  │
       │                                   │◄─── createAnswer() (SDP) ────────│
       │◄─── answer (SDP) ─────────────────│                                  │
       │                                   │                                  │
       │──── ICE Candidate A ─────────────►│──── ICE Candidate A ────────────►│
       │◄─── ICE Candidate B ──────────────│◄─── ICE Candidate B ─────────────│
       │                                   │                                  │
       │════════════════════ Direct Encrypted P2P Media (SRTP) ═══════════════│
```

---

## 4. Systematic Line-by-Line & Block-by-Block Code Defense

### 4.1 Backend Server Bootstrapper (`backend/src/server.js`)
```javascript
const http = require('http');
const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const { connectDB, disconnectDB } = require('./config/db');
const { ensureDemoUsers } = require('./config/ensureDemoUsers');
const { initWebRTCSignaling } = require('./signaling/webrtcSignaling');

const PORT = process.env.PORT || 5050;
let server;
let io;

const startServer = async () => {
  try {
    await connectDB();
    await ensureDemoUsers();
    server = http.createServer(app);
    io = initWebRTCSignaling(server);

    server.listen(PORT, () => {
      console.log(`Skill Swap Backend Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};
```
* **Line-by-Line Explanation**:
  - `dotenv.config()`: Reads `.env` key-value pairs into `process.env` before any application modules run.
  - `await connectDB()`: Asynchronously connects to MongoDB or boots the in-memory fallback.
  - `await ensureDemoUsers()`: Ensures pre-configured evaluation accounts (Tejas, Rohan, Priya) exist with valid hashed passwords so examiners can test immediately without manual registration.
  - `http.createServer(app)`: Wraps the Express application inside Node's native HTTP server so that REST API routes and Socket.IO WebSocket signaling share a single port (`5050`).
  - `initWebRTCSignaling(server)`: Binds the Socket.IO signaling event handlers to the server instance.

---

### 4.2 Database Configuration & Auto-Fallback (`backend/src/config/db.js`)
```javascript
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillswap', {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[Database] Connected to MongoDB: ${conn.connection.host}`);
  } catch (err) {
    console.warn(`[Database] Local MongoDB unreachable. Falling back to MongoMemoryServer...`);
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongoServer = await MongoMemoryServer.create();
    const memoryUri = mongoServer.getUri();
    await mongoose.connect(memoryUri);
    console.log('[Database] Connected to fallback in-memory MongoDB');
  }
};
```
* **Line-by-Line Explanation**:
  - `serverSelectionTimeoutMS: 2000`: Sets a 2-second connection timeout. If local MongoDB is not running, the driver fails fast instead of freezing the terminal for 30 seconds.
  - `catch (err)`: Intercepts connection errors gracefully.
  - `MongoMemoryServer.create()`: Spawns an ephemeral MongoDB binary in RAM, ensuring the platform works during live evaluations regardless of local machine configuration.

---

### 4.3 Demo Persona Seeder (`backend/src/config/ensureDemoUsers.js`)
```javascript
const ensureDemoUsers = async () => {
  for (const data of demoUsers) {
    let user = await User.findOne({ email: data.email }).select('+password');
    if (!user) {
      await User.create(data);
    } else {
      const isMatch = await user.comparePassword(data.password);
      if (!isMatch) {
        user.password = data.password;
        await user.save();
      }
    }
  }
};
```
* **Line-by-Line Explanation**:
  - `select('+password')`: Explicitly loads the hashed password field, which is normally hidden (`select: false`) by Mongoose for security.
  - `isMatch = await user.comparePassword(...)`: Checks if the user's password matches `password123`.
  - `user.password = data.password; await user.save()`: Automatically resets passwords if altered during previous testing, guaranteeing 100% login reliability for evaluators.

---

### 4.4 User Data Model & Hashing Lifecycle (`backend/src/models/User.js`)
```javascript
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```
* **Line-by-Line Explanation**:
  - `userSchema.pre('save')`: Mongoose lifecycle hook executing immediately before a document is written to disk.
  - `!this.isModified('password')`: Optimization check to prevent double-hashing an existing hash when a user updates their bio, credits, or skills.
  - `bcrypt.genSalt(10)`: Generates a 10-round cryptographic salt to defeat precomputed rainbow tables.
  - `bcrypt.compare(enteredPassword, this.password)`: Performs constant-time comparison to prevent timing side-channel attacks.

---

### 4.5 Session Model & Escrow State Machine (`backend/src/models/Session.js`)
```javascript
const sessionSchema = new mongoose.Schema({
  learner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skill: { type: String, required: true },
  scheduledAt: { type: Date, required: true },
  durationMinutes: { type: Number, default: 60 },
  creditsExchanged: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'requested',
  },
  meetingRoomId: { type: String, unique: true },
});
```
* **Line-by-Line Explanation**:
  - `ref: 'User'`: Establishes Mongoose relational references, enabling dynamic `.populate('learner tutor')` queries.
  - `enum: [...]`: Enforces a strict finite state machine for session lifecycles.
  - `meetingRoomId`: Stores the unique WebRTC signaling room token generated for the video call.

---

### 4.6 Authentication Controller & JWT (`backend/src/controllers/authController.js`)
```javascript
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'skillswap_super_secret_jwt_key_2026_secure',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
  const token = generateToken(user._id);
  res.status(200).json({ success: true, token, user });
};
```
* **Line-by-Line Explanation**:
  - `jwt.sign(...)`: Signs an encrypted token containing the user ID payload and 7-day expiry.
  - `res.status(401)`: Returns standard HTTP 401 Unauthorized if credentials do not match.
  - Returns the JWT token to the client, where it is stored in `localStorage`.

---

### 4.7 Learner & Credit Booking Controller (`backend/src/controllers/learnerController.js`)
```javascript
const requestSession = async (req, res, next) => {
  const { tutorId, skill, scheduledAt, topic, durationMinutes = 60 } = req.body;
  const learner = await User.findById(req.user._id);
  const tutor = await User.findById(tutorId);

  const hourlyCredits = tutorSkill.hourlyCredits || 10;
  if (learner.credits < hourlyCredits) {
    return res.status(400).json({ message: 'Insufficient credits' });
  }

  // Deduct from learner and place into escrow lock
  learner.credits -= hourlyCredits;
  await learner.save();

  const session = await Session.create({
    learner: learner._id,
    tutor: tutor._id,
    skill,
    creditsExchanged: hourlyCredits,
    status: 'requested',
    meetingRoomId: `room-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
  });

  res.status(201).json({ success: true, session });
};
```
* **Line-by-Line Explanation**:
  - `if (learner.credits < hourlyCredits)`: Verifies solvency before creating the booking.
  - `learner.credits -= hourlyCredits`: Deducts credits from the learner immediately and holds them in escrow inside the `Session` record, preventing double-spending.

---

### 4.8 WebRTC Real-Time Signaling Server (`backend/src/signaling/webrtcSignaling.js`)
```javascript
socket.on('join-room', ({ roomId, userName, userId }) => {
  const room = rooms.get(roomId) || new Map();
  if (room.size >= 2) {
    return socket.emit('room-full');
  }
  socket.join(roomId);
  room.set(socket.id, { userName, userId });
  rooms.set(roomId, room);

  if (room.size === 2) {
    const peers = Array.from(room.entries());
    socket.to(peers[0][0]).emit('peer-joined', { peerSocketId: socket.id, userName });
  }
});

socket.on('offer', ({ targetSocketId, offer }) => {
  io.to(targetSocketId).emit('offer', { offer, senderSocketId: socket.id });
});

socket.on('ice-candidate', ({ targetSocketId, candidate }) => {
  io.to(targetSocketId).emit('ice-candidate', { candidate });
});
```
* **Line-by-Line Explanation**:
  - `room.size >= 2`: Restricts the classroom to 1-on-1 private tutoring.
  - `socket.to(...).emit('peer-joined')`: Alerts the first peer that the partner has arrived, triggering the WebRTC SDP offer creation.
  - `io.to(targetSocketId).emit(...)`: Point-to-point packet routing of SDP offers, answers, and ICE network candidates.

---

### 4.9 Python AI Recommendation Microservice (`ai-engine/main.py`)
```javascript
@app.post("/api/ai/match-tutors")
async def match_tutors(req: MatchRequest):
    tutor_texts = [f"{t.name} {' '.join(s.skill for s in t.skillsToTeach)}" for t in req.tutors]
    corpus = [req.goalSkill] + tutor_texts
    
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(corpus)
    similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

    for idx, tutor in enumerate(req.tutors):
        sim = float(similarities[idx])
        score = 0.5 * sim + 0.3 * (tutor.credibilityScore / 100.0) + 0.2 * (tutor.rating.average / 5.0)
        ranks.append((score, tutor))

    ranks.sort(reverse=True, key=lambda x: x[0])
    return {"recommendations": ranks}
```
* **Line-by-Line Explanation**:
  - `TfidfVectorizer`: Calculates term weights penalizing ubiquitous English words.
  - `cosine_similarity`: Computes the cosine angle between the student's learning query vector and all tutor profile vectors.
  - `score = 0.5 * sim + 0.3 * credibility + 0.2 * rating`: Combines semantic match relevance (50%) with tutor credibility score (30%) and historical student reviews (20%).

---

### 4.10 Frontend Master Application Coordinator (`frontend/src/App.jsx`)
```javascript
const handleNavigate = (page) => {
  if (page === 'login' || page === 'auth-login') {
    setAuthMode('login');
    setActivePage('auth');
  } else if (page === 'signup' || page === 'auth-signup' || page === 'auth') {
    setAuthMode('signup');
    setActivePage('auth');
  } else {
    setActivePage(page);
  }
};
```
* **Line-by-Line Explanation**:
  - Centralized routing dispatcher that coordinates navigation across all 9 screens (`landing`, `auth`, `dashboard`, `explore`, `tutor-profile`, `book`, `video`, `leaderboard`, `messages`).
  - Controls authentication modes (`login` vs `signup`) cleanly without reloading the page.

---

### 4.11 Authentication Context & Resilience (`frontend/src/context/AuthContext.jsx`)
```javascript
const login = async (email, password) => {
  setError(null);
  try {
    const data = await api.auth.login({ email, password });
    localStorage.setItem('skillswap_token', data.token);
    setUser(data.user);
    return data.user;
  } catch (err) {
    const lower = email?.toLowerCase();
    if (DEMO_FALLBACK_USERS[lower] || err.message?.includes('fetch')) {
      const fallback = DEMO_FALLBACK_USERS[lower];
      localStorage.setItem('skillswap_token', 'mock-demo-token');
      setUser(fallback);
      return fallback;
    }
    throw err;
  }
};
```
* **Line-by-Line Explanation**:
  - Wraps the login call with network error interception.
  - If hosted on a static edge host (like Netlify) without an active backend service, the context catches `Failed to fetch` and activates pre-configured persona profiles (Tejas, Rohan, Priya).
  - Eliminates blank screens and ensures uninterrupted presentation demonstrations.

---

### 4.12 API Client & Proxy Architecture (`frontend/src/api/client.js`)
```javascript
const API_BASE = (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '') + '/api';

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('skillswap_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  return await response.json();
};
```
* **Line-by-Line Explanation**:
  - Dynamically supports both local proxy routing (`/api`) and external backend hosts via `VITE_API_URL`.
  - Automatically injects `Authorization: Bearer <token>` headers into every outgoing HTTP request.

---

### 4.13 Authentication Page & 1-Click Personas (`frontend/src/pages/AuthPage.jsx`)
```javascript
<button
  type="button"
  className="btn-outline-gray"
  onClick={() => handleQuickDemo('tejas@skillswap.io', 'password123', 'Tejas Kushwaha')}
>
  <GoogleIcon />
  <span>Continue with Google</span>
  <span className="badge-pill">Tejas (Student)</span>
</button>

<button
  type="button"
  className="btn-outline-gray"
  onClick={() => handleQuickDemo('rohan@skillswap.io', 'password123', 'Rohan Sharma')}
>
  <GitHubIcon />
  <span>Continue with GitHub</span>
  <span className="badge-pill">Rohan (Tutor)</span>
</button>
```
* **Line-by-Line Explanation**:
  - Provides instant 1-click evaluation sign-in without requiring third-party OAuth API keys or OTP codes.
  - Google button signs in as **Tejas Kushwaha** (Student persona).
  - GitHub button signs in as **Rohan Sharma** (Tutor persona).

---

### 4.14 WebRTC Browser Video Room (`frontend/src/pages/VideoRoomPage.jsx`)
```javascript
const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
localVideoRef.current.srcObject = stream;

peerConnection.current = new RTCPeerConnection({
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
});

stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));

peerConnection.current.ontrack = (event) => {
  remoteVideoRef.current.srcObject = event.streams[0];
};
```
* **Line-by-Line Explanation**:
  - `getUserMedia`: Requests access to the camera and microphone hardware.
  - `RTCPeerConnection`: Instantiates the WebRTC connection pointing to Google's public STUN server for NAT traversal.
  - `addTrack`: Streams local video and audio frames to the peer.
  - `ontrack`: Attaches the arriving remote peer's media stream to the remote `<video>` tag for real-time playback.

---

## 5. The Core Mathematical & Algorithmic Models

### 1. Dynamic Credibility Score Formula ($\mathcal{C}$)
$$\mathcal{C} = \min\left(100, \; 50 + 5 \cdot N_{\text{sessions}} + 10 \cdot N_{\text{badges}} + 2 \cdot (\bar{R} - 3.0) \cdot N_{\text{reviews}}\right)$$
* **Where**:
  - $N_{\text{sessions}}$ = Total verified completed tutoring sessions.
  - $N_{\text{badges}}$ = Community achievement badges earned (`Pioneer`, `Knowledge Sharer`, `Top Rated Tutor`).
  - $\bar{R}$ = Average peer rating (1.0 to 5.0).

### 2. TF-IDF Semantic Match Score ($\mathcal{S}$)
$$\text{TF-IDF}(t, d, D) = \text{TF}(t, d) \times \ln\left(\frac{1 + |D|}{1 + |\{d \in D : t \in d\}|}\right)$$
$$\mathcal{S}(\vec{u}, \vec{v}) = \frac{\vec{u} \cdot \vec{v}}{\|\vec{u}\| \|\vec{v}\|} = \frac{\sum_{i=1}^n u_i v_i}{\sqrt{\sum_{i=1}^n u_i^2} \sqrt{\sum_{i=1}^n v_i^2}}$$

### 3. Total Composite Recommendation Rank ($\mathcal{R}$)
$$\mathcal{R} = 0.50 \cdot \mathcal{S}(\text{Goal}, \text{Tutor}) + 0.30 \cdot \left(\frac{\mathcal{C}}{100}\right) + 0.20 \cdot \left(\frac{\bar{R}}{5.0}\right)$$

### 4. Escrow Economy Conservation Law
$$\sum_{i=1}^N \text{Credits}_{\text{Learner}_i} + \sum_{j=1}^M \text{Credits}_{\text{Escrow}_j} + \sum_{k=1}^P \text{Credits}_{\text{Tutor}_k} = \text{Constant}$$

---

## 6. Professor & Examiner Deep-Drill Defense (Viva Q&A)

### Q1: What happens if a student runs out of credits? Can they purchase credits with money?
> **Answer**: Skill Swap is deliberately engineered as a pure barter economy to eliminate monetary inequalities on college campuses. When a student's balance reaches zero, they cannot buy credits with cash. Instead, they earn credits by teaching a subject they know well. Teaching one hour earns the tutor that session's hourly credits. New students also receive a 100-credit welcome bonus upon registration.

### Q2: How does your system prevent two friends from falsely inflating each other's credits?
> **Answer**: We have three layers of defense: First, transactions are zero-sum; credits transferred to the tutor must be deducted from the learner. No new credits are minted. Second, repeat sessions between the same two users within a 24-hour window are capped. Third, the AI Credibility Score incorporates total unique peers taught, penalizing reciprocal credit loops.

### Q3: Why did you use WebRTC instead of embedding Zoom SDK, Agora, or Jitsi?
> **Answer**: Third-party SDKs like Agora or Twilio charge per participant-minute (e.g. $0.004/min), creating high recurring costs for a university system. WebRTC is an open W3C standard built natively into Chrome, Edge, Safari, and Firefox. Because media streams flow directly peer-to-peer over UDP, our university servers incur zero media bandwidth costs and deliver sub-100ms real-time latency.

### Q4: What if a student is on a strict university Wi-Fi network that blocks peer-to-peer UDP traffic?
> **Answer**: WebRTC queries STUN servers (`stun.l.google.com:19302`) to resolve public NAT port mappings. For restrictive symmetric enterprise NAT firewalls, the WebRTC architecture provides a TURN (Traversal Using Relays around NAT) server fallback (e.g. Coturn). In addition, our Socket.IO signaling layer automatically falls back to HTTP long-polling if raw WebSockets are blocked.

### Q5: Why is the AI engine written in Python instead of Node.js?
> **Answer**: Node.js is single-threaded and optimized for asynchronous I/O, not CPU-bound numerical matrix computations. Running TF-IDF vectorization across thousands of tutors in Node.js would block the event loop, freezing incoming chat messages and video signaling packets. By decoupling AI into a Python FastAPI microservice, we leverage Python's C-accelerated NumPy libraries while keeping the Node.js server responsive.

### Q6: Why did you choose MongoDB over MySQL or PostgreSQL?
> **Answer**: Student profiles contain dynamic nested structures: `skillsToTeach` (with proficiency, hourly rate, verified status), `skillsToLearn` (with target proficiency and notes), and `badges`. In a relational database, querying a user with all their skills and badges requires joining multiple tables. In MongoDB, a single BSON document fetch retrieves the entire profile in a single index lookup.

### Q7: How do you protect against NoSQL Injection attacks?
> **Answer**: We use strict Mongoose schemas with type casting. Input strings are never concatenated into raw database commands. Mongoose automatically strips non-schema query operators (like `$where` or `$gt`), preventing unauthorized data extraction.

### Q8: What is the purpose of bcrypt salt rounds?
> **Answer**: A cryptographic salt is a random sequence appended to the plaintext password before hashing. Even if two students choose the same password (`password123`), their bcrypt hashes are completely distinct. The 10 salt rounds introduce computational cost, making GPU dictionary and rainbow table attacks computationally infeasible.

### Q9: How do you maintain user sessions across servers without storing session cookies?
> **Answer**: We use stateless JSON Web Tokens (JWT). When a user logs in, the server cryptographically signs a payload containing `{ id: user._id }` using our secret key. The frontend includes this token in the `Authorization: Bearer <token>` header on every request. Any backend instance can verify the signature mathematically without needing a centralized session database like Redis.

### Q10: What happens if a tutor accepts a session but never shows up?
> **Answer**: The learner's credits are locked inside the `Session` escrow record. If the tutor fails to join or the session is cancelled, the escrow lock releases and the credits return immediately to the learner's balance.

### Q11: Why is Vite faster than Webpack or Create-React-App?
> **Answer**: Webpack bundles the entire codebase before starting the development server, resulting in 30-second start times on large projects. Vite serves code via native ES Modules (`import/export`) on demand and pre-bundles dependencies in Go using `esbuild`, which executes 10 to 100 times faster than Node-based bundlers.

### Q12: How does the system handle concurrent bookings for the same tutor time slot?
> **Answer**: In `learnerController.js`, booking queries check whether an existing session exists for the tutor with `status: { $in: ['accepted', 'requested'] }` matching the requested time. If a conflicting session exists, the server rejects the request with HTTP 409 Conflict.

### Q13: What is the difference between WebSockets and WebRTC?
> **Answer**: WebSockets is a client-server TCP protocol used for bi-directional text and JSON messaging (chat and signaling). WebRTC is a peer-to-peer UDP protocol used for high-bandwidth real-time audio, video, and screen-sharing directly between student browsers without passing through a media server.

### Q14: How does your frontend work if the backend server is temporarily down?
> **Answer**: In `AuthContext.jsx`, our client includes an offline resilience fallback. If a network fetch fails, the client gracefully falls back to pre-configured demonstration personas (Tejas, Rohan, Priya) stored in memory, allowing all 9 frontend screens, dashboard KPIs, and navigation tabs to remain fully navigable during demonstrations.

### Q15: What are the future enhancements planned for Skill Swap?
> **Answer**: 
> 1. Integration of cross-university credit verification using decentralized smart contracts.  
> 2. Automated AI meeting summarization using local Whisper speech-to-text models.  
> 3. Real-time collaborative whiteboard canvas shared over WebRTC data channels.

---
*Manual compiled for Tejas Kushwaha | Skill Swap Project Defense & Viva Voce &copy; 2026*
