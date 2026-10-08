# Skill Swap - Peer-to-Peer Learning Platform

Skill Swap is a modern peer-to-peer learning and teaching platform enabling users to exchange skills, schedule interactive 1-on-1 sessions, and engage in a gamified learning journey with real-time video, AI matchmaking, and credibility tracking.

---

## Project Roadmap

| Phase | Description | Status |
|---|---|:---:|
| **Phase 1** | **Backend & Database Initialization** (Node.js, Express, MongoDB, Mongoose, Auth, Learner Module, Tutor Module) | **Completed & Verified** |
| **Phase 2** | **React Frontend & Dashboard** (React 19, Vite, Dashboards, session scheduling, progress tracking) | **Completed & Verified** |
| **Phase 3** | WebRTC Video Integration (Real-time P2P video, Node.js signaling server) | *Queued* |
| **Phase 4** | AI Skill Matching Engine (Python 3, TensorFlow/Scikit-learn microservice) | *Queued* |
| **Phase 5** | Gamification & Feedback System (Badges, credits, AI Credibility Score updates) | *Core logic integrated* |

---

## Phase 1 Implementation Summary

### 1. Architecture & Technologies
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB with Mongoose ODM (with seamless in-memory fallback support for zero-setup local dev & automated testing)
- **Security**: JWT (JSON Web Tokens), `bcryptjs` password hashing, sanitized inputs via `express-validator`
- **Testing**: Jest & Supertest integration suite with 100% test pass rate

### 2. Mongoose Schemas & Models
- [`User`](backend/src/models/User.js):
  - Credentials & Profile (`name`, `email`, hashed `password`, `bio`, `avatar`, `isAvailable`)
  - Skill inventories: `skillsToLearn` (proficiency target, notes) & `skillsToTeach` (proficiency, hourly credits, description)
  - Gamification metrics: `credits` (100 welcome bonus), `credibilityScore` (default 70.0), `badges`, `rating` (average & count)
- [`Session`](backend/src/models/Session.js):
  - Learner & Tutor references, skill, scheduled time, duration, status lifecycle (`requested`, `accepted`, `rejected`, `in-progress`, `completed`, `cancelled`)
  - Credits exchanged, generated WebRTC `meetingRoomId`, notes, feedback tracking
- [`Feedback`](backend/src/models/Feedback.js):
  - Session link, reviewer/reviewee, rating (1-5), comments, criteria (`clarity`, `helpfulness`, `punctuality`)
- [`Gamification`](backend/src/models/Gamification.js):
  - Audit log for credit deductions/earnings, badge unlocks, and dynamic AI Credibility Score updates

---

## RESTful API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/auth/register` | Register new user with 100 welcome credits & Pioneer badge | No |
| `POST` | `/api/auth/login` | Authenticate user and receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile, skills & badges | Yes |
| `PUT` | `/api/auth/profile` | Update profile bio, avatar, and availability | Yes |

### Learner Module (`/api/learner`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/learner/skills` | View user's learning wishlist | Yes |
| `POST` | `/api/learner/skills` | Add/select a skill to learn (`skill`, `targetProficiency`, `notes`) | Yes |
| `DELETE` | `/api/learner/skills/:skillName` | Remove a skill from learning wishlist | Yes |
| `GET` | `/api/learner/tutors` | Search tutors by skill, rating, and availability | Yes |
| `POST` | `/api/learner/sessions` | Request a learning session with a selected tutor | Yes |
| `GET` | `/api/learner/sessions` | List all sessions booked by current user as a learner | Yes |

### Tutor Module (`/api/tutor`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/tutor/skills` | View skills currently offered to teach | Yes |
| `POST` | `/api/tutor/skills` | Offer a skill to teach (`skill`, `proficiency`, `hourlyCredits`, `description`) | Yes |
| `DELETE` | `/api/tutor/skills/:skillName` | Remove an offered skill | Yes |
| `GET` | `/api/tutor/sessions/requests` | View pending session requests from learners | Yes |
| `PATCH` | `/api/tutor/sessions/:sessionId/respond` | Accept or reject session request (`action: 'accept' \| 'reject'`) | Yes |
| `GET` | `/api/tutor/sessions` | List all sessions where user is tutor | Yes |
| `PUT` | `/api/tutor/availability` | Toggle tutor availability status | Yes |

### Session & Feedback Lifecycle (`/api/sessions`, `/api/feedback`, `/api/gamification`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/sessions/:id` | Get session details and WebRTC room ID | Yes |
| `POST` | `/api/sessions/:id/complete` | Complete session & automatically transfer credits between peers | Yes |
| `POST` | `/api/sessions/:id/cancel` | Cancel a scheduled session | Yes |
| `POST` | `/api/feedback` | Submit rating & review, dynamically updating peer's AI Credibility Score | Yes |
| `GET` | `/api/feedback/user/:userId` | Get public reviews for a user | No |
| `GET` | `/api/gamification/history` | View credit transactions, badges, and credibility deltas | Yes |
| `GET` | `/api/gamification/leaderboard` | Leaderboard ranked by AI Credibility Score and ratings | No |

---

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas URI via `.env`, or automatic memory server)

### 2. Run Tests
```bash
cd backend
npm test
```
All 4 test suites (20 tests) will execute and verify all API endpoints against isolated in-memory MongoDB storage.

### 3. Run Development Server
```bash
cd backend
npm run dev
# or npm start
```
The server starts on `http://localhost:5000`. You can test health via `GET http://localhost:5000/api/health`.
