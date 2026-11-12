const request = require('supertest');
const app = require('../src/app');
const { setupTestDB } = require('./setup');

setupTestDB();

describe('Gamification, Badges, Daily Bonus & Feedback Credibility Engine (Phase 5)', () => {
  let learnerToken;
  let tutorToken;
  let tutorId;

  beforeEach(async () => {
    const learnerRes = await request(app).post('/api/auth/register').send({
      name: 'Tejas Learner',
      email: 'tejas-g@skillswap.io',
      password: 'password123',
    });
    learnerToken = learnerRes.body.token;

    const tutorRes = await request(app).post('/api/auth/register').send({
      name: 'Rohan Tutor',
      email: 'rohan-g@skillswap.io',
      password: 'password123',
    });
    tutorToken = tutorRes.body.token;
    tutorId = tutorRes.body.user._id;

    await request(app)
      .post('/api/tutor/skills')
      .set('Authorization', `Bearer ${tutorToken}`)
      .send({ skill: 'react', proficiency: 'expert', hourlyCredits: 15 });
  });

  test('should award First Step & Helper badges on session completion, +5 bonus credits & Active Reviewer on feedback, and dynamically update AI Credibility Score', async () => {
    // 1. Request & Accept Session
    const futureDate = new Date(Date.now() + 86400000).toISOString();
    const reqRes = await request(app)
      .post('/api/learner/sessions')
      .set('Authorization', `Bearer ${learnerToken}`)
      .send({ tutorId, skill: 'react', scheduledAt: futureDate });

    const sessionId = reqRes.body.session._id;

    await request(app)
      .patch(`/api/tutor/sessions/${sessionId}/respond`)
      .set('Authorization', `Bearer ${tutorToken}`)
      .send({ action: 'accept' });

    // 2. Complete session (100 - 15 = 85 credits for learner, 100 + 15 = 115 for tutor)
    const compRes = await request(app)
      .post(`/api/sessions/${sessionId}/complete`)
      .set('Authorization', `Bearer ${learnerToken}`);
    expect(compRes.statusCode).toBe(200);

    // 3. Submit 5-star feedback with 5/5 criteria
    const fbRes = await request(app)
      .post('/api/feedback')
      .set('Authorization', `Bearer ${learnerToken}`)
      .send({
        sessionId,
        rating: 5,
        comment: 'Clear examples and great mentorship!',
        criteria: { clarity: 5, helpfulness: 5, punctuality: 5 },
      });

    expect(fbRes.statusCode).toBe(201);
    expect(fbRes.body.updatedCredibilityScore).toBeGreaterThan(70.0);
    expect(fbRes.body.reviewerCreditsAwarded).toBe(5);

    // Verify learner received +5 feedback bonus + badges (First Step + Active Reviewer)
    const learnerHist = await request(app)
      .get('/api/gamification/history')
      .set('Authorization', `Bearer ${learnerToken}`);

    expect(learnerHist.statusCode).toBe(200);
    expect(learnerHist.body.stats.credits).toBe(90); // 100 - 15 + 5
    expect(learnerHist.body.badges.map((b) => b.name)).toEqual(
      expect.arrayContaining(['First Step', 'Active Reviewer'])
    );

    // Verify tutor received updated AI credibility + Helper + 5-Star Mentor badges
    const tutorHist = await request(app)
      .get('/api/gamification/history')
      .set('Authorization', `Bearer ${tutorToken}`);

    expect(tutorHist.body.stats.credibilityScore).toBeGreaterThan(70.0);
    expect(tutorHist.body.badges.map((b) => b.name)).toEqual(
      expect.arrayContaining(['Helper', '5-Star Mentor'])
    );

    // Verify Leaderboard sorts highest AI Credibility first
    const lbRes = await request(app).get('/api/gamification/leaderboard');
    expect(lbRes.statusCode).toBe(200);
    expect(lbRes.body.leaderboard[0].name).toBe('Rohan Tutor');
  });

  test('should award +10 daily bonus once per calendar day and unlock Consistent badge', async () => {
    const firstClaim = await request(app)
      .post('/api/gamification/daily-bonus')
      .set('Authorization', `Bearer ${learnerToken}`);

    expect(firstClaim.statusCode).toBe(200);
    expect(firstClaim.body.credits).toBe(110);

    // Duplicate claim same day rejected
    const secondClaim = await request(app)
      .post('/api/gamification/daily-bonus')
      .set('Authorization', `Bearer ${learnerToken}`);

    expect(secondClaim.statusCode).toBe(400);
    expect(secondClaim.body.message).toMatch(/already been claimed/i);
  });
});
