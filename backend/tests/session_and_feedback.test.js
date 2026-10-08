const request = require('supertest');
const app = require('../src/app');
const { setupTestDB } = require('./setup');

describe('Session Completion, Credits & Feedback API Tests', () => {
  setupTestDB();

  let learnerToken, learnerId;
  let tutorToken, tutorId;
  let sessionId;

  beforeEach(async () => {
    // Register learner with 100 credits
    const learnerRes = await request(app).post('/api/auth/register').send({
      name: 'Learner Lisa',
      email: 'lisa@test.com',
      password: 'password123',
    });
    learnerToken = learnerRes.body.token;
    learnerId = learnerRes.body.user._id;

    // Register tutor with 100 credits
    const tutorRes = await request(app).post('/api/auth/register').send({
      name: 'Tutor Tim',
      email: 'tim@test.com',
      password: 'password123',
    });
    tutorToken = tutorRes.body.token;
    tutorId = tutorRes.body.user._id;

    // Tutor adds skill (15 credits per session)
    await request(app)
      .post('/api/tutor/skills')
      .set('Authorization', `Bearer ${tutorToken}`)
      .send({
        skill: 'React',
        proficiency: 'expert',
        hourlyCredits: 15,
      });

    // Learner requests session
    const sessionRes = await request(app)
      .post('/api/learner/sessions')
      .set('Authorization', `Bearer ${learnerToken}`)
      .send({
        tutorId,
        skill: 'React',
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        durationMinutes: 60,
      });
    sessionId = sessionRes.body.session._id;

    // Tutor accepts session
    await request(app)
      .patch(`/api/tutor/sessions/${sessionId}/respond`)
      .set('Authorization', `Bearer ${tutorToken}`)
      .send({ action: 'accept' });
  });

  it('should complete session and transfer credits from learner to tutor', async () => {
    const completeRes = await request(app)
      .post(`/api/sessions/${sessionId}/complete`)
      .set('Authorization', `Bearer ${learnerToken}`);

    expect(completeRes.status).toBe(200);
    expect(completeRes.body.session.status).toBe('completed');

    // Check learner credits: 100 - 15 = 85
    const learnerCheck = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${learnerToken}`);
    expect(learnerCheck.body.user.credits).toBe(85);

    // Check tutor credits: 100 + 15 = 115
    const tutorCheck = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${tutorToken}`);
    expect(tutorCheck.body.user.credits).toBe(115);
  });

  it('should allow learner to submit feedback and update tutor rating and credibility score', async () => {
    // Complete session first
    await request(app)
      .post(`/api/sessions/${sessionId}/complete`)
      .set('Authorization', `Bearer ${learnerToken}`);

    // Submit 5-star feedback
    const feedbackRes = await request(app)
      .post('/api/feedback')
      .set('Authorization', `Bearer ${learnerToken}`)
      .send({
        sessionId,
        rating: 5,
        comment: 'Outstanding tutor! Explained React state very clearly.',
        criteria: { clarity: 5, helpfulness: 5, punctuality: 5 },
      });

    expect(feedbackRes.status).toBe(201);
    expect(feedbackRes.body.success).toBe(true);
    expect(feedbackRes.body.feedback.rating).toBe(5);

    // Check updated tutor profile
    const tutorProfile = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${tutorToken}`);

    expect(tutorProfile.body.user.rating.average).toBe(5);
    expect(tutorProfile.body.user.rating.count).toBe(1);
    // Credibility score should increase from default 70
    expect(tutorProfile.body.user.credibilityScore).toBeGreaterThan(70);
  });
});
