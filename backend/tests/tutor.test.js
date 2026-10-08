const request = require('supertest');
const app = require('../src/app');
const { setupTestDB } = require('./setup');

describe('Tutor Module API Tests', () => {
  setupTestDB();

  let learnerToken;
  let learnerId;
  let tutorToken;
  let tutorId;

  beforeEach(async () => {
    // Create tutor
    const tutorRes = await request(app).post('/api/auth/register').send({
      name: 'Tutor Terry',
      email: 'terry@tutor.com',
      password: 'password123',
    });
    tutorToken = tutorRes.body.token;
    tutorId = tutorRes.body.user._id;

    // Create learner
    const learnerRes = await request(app).post('/api/auth/register').send({
      name: 'Learner Leo',
      email: 'leo@learner.com',
      password: 'password123',
    });
    learnerToken = learnerRes.body.token;
    learnerId = learnerRes.body.user._id;
  });

  describe('Offering Skills to Teach', () => {
    it('should allow user to offer a skill they can teach and earn Knowledge Sharer badge', async () => {
      const res = await request(app)
        .post('/api/tutor/skills')
        .set('Authorization', `Bearer ${tutorToken}`)
        .send({
          skill: 'TypeScript',
          proficiency: 'advanced',
          hourlyCredits: 15,
          description: 'Full-stack TypeScript developer with React & Node',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.skills.length).toBe(1);
      expect(res.body.skills[0].skill).toBe('typescript');
      expect(res.body.skills[0].hourlyCredits).toBe(15);

      // Verify profile received badge
      const profileRes = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${tutorToken}`);

      const badgeNames = profileRes.body.user.badges.map((b) => b.name);
      expect(badgeNames).toContain('Knowledge Sharer');
    });

    it('should allow tutor to toggle availability', async () => {
      const res = await request(app)
        .put('/api/tutor/availability')
        .set('Authorization', `Bearer ${tutorToken}`)
        .send({ isAvailable: false });

      expect(res.status).toBe(200);
      expect(res.body.isAvailable).toBe(false);
    });
  });

  describe('Responding to Session Requests', () => {
    let sessionId;

    beforeEach(async () => {
      // Tutor adds skill
      await request(app)
        .post('/api/tutor/skills')
        .set('Authorization', `Bearer ${tutorToken}`)
        .send({
          skill: 'javascript',
          proficiency: 'expert',
          hourlyCredits: 10,
        });

      // Learner books session
      const bookRes = await request(app)
        .post('/api/learner/sessions')
        .set('Authorization', `Bearer ${learnerToken}`)
        .send({
          tutorId,
          skill: 'javascript',
          scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        });

      sessionId = bookRes.body.session._id;
    });

    it('should list pending session requests for the tutor', async () => {
      const res = await request(app)
        .get('/api/tutor/sessions/requests')
        .set('Authorization', `Bearer ${tutorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.count).toBe(1);
      expect(res.body.requests[0]._id).toBe(sessionId);
      expect(res.body.requests[0].learner.name).toBe('Learner Leo');
    });

    it('should allow tutor to accept a session request', async () => {
      const res = await request(app)
        .patch(`/api/tutor/sessions/${sessionId}/respond`)
        .set('Authorization', `Bearer ${tutorToken}`)
        .send({
          action: 'accept',
          tutorNotes: 'Looking forward to our session!',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.session.status).toBe('accepted');
      expect(res.body.session.tutorNotes).toBe('Looking forward to our session!');
    });

    it('should allow tutor to reject a session request', async () => {
      const res = await request(app)
        .patch(`/api/tutor/sessions/${sessionId}/respond`)
        .set('Authorization', `Bearer ${tutorToken}`)
        .send({
          action: 'reject',
          tutorNotes: 'Schedule conflict, apologies.',
        });

      expect(res.status).toBe(200);
      expect(res.body.session.status).toBe('rejected');
    });
  });
});
