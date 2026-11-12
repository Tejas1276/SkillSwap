const request = require('supertest');
const app = require('../src/app');
const { setupTestDB } = require('./setup');

setupTestDB();

describe('AI Skill Matching & Microservice Proxy API (Phase 4)', () => {
  let learnerToken;

  beforeEach(async () => {
    const learnerRes = await request(app).post('/api/auth/register').send({
      name: 'Tejas Learner',
      email: 'tejas-ai@skillswap.io',
      password: 'password123',
      bio: 'Excited to learn React and Web Development',
    });
    learnerToken = learnerRes.body.token;

    await request(app)
      .post('/api/learner/skills')
      .set('Authorization', `Bearer ${learnerToken}`)
      .send({ skill: 'react', targetProficiency: 'intermediate' });

    const tutorRes = await request(app).post('/api/auth/register').send({
      name: 'Rohan AI Tutor',
      email: 'rohan-ai@skillswap.io',
      password: 'password123',
      bio: 'Senior React & Node Mentor',
    });
    const tutorToken = tutorRes.body.token;

    await request(app)
      .post('/api/tutor/skills')
      .set('Authorization', `Bearer ${tutorToken}`)
      .send({
        skill: 'react',
        proficiency: 'expert',
        hourlyCredits: 15,
        description: 'React hooks, context, and full-stack architecture',
      });
  });

  test('GET /api/ai/health should report microservice connectivity payload', async () => {
    const res = await request(app).get('/api/ai/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.microservice).toHaveProperty('url');
  });

  test('GET /api/ai/recommendations should return matched tutors for authenticated learner', async () => {
    const res = await request(app)
      .get('/api/ai/recommendations?skill=react')
      .set('Authorization', `Bearer ${learnerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.recommendations)).toBe(true);
    expect(res.body.recommendations.length).toBeGreaterThanOrEqual(1);
    expect(res.body.recommendations[0]).toHaveProperty('matchScore');
    expect(res.body.recommendations[0].tutor.name).toBe('Rohan AI Tutor');
  });

  test('POST /api/ai/learning-path should generate a step-by-step personalized roadmap', async () => {
    const res = await request(app)
      .post('/api/ai/learning-path')
      .set('Authorization', `Bearer ${learnerToken}`)
      .send({ goalSkill: 'web development' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.learningPath).toHaveProperty('matchedTrack');
    expect(Array.isArray(res.body.learningPath.steps)).toBe(true);
    expect(res.body.learningPath.steps.length).toBeGreaterThanOrEqual(3);
  });

  test('GET /api/ai/trending should return trending campus skills', async () => {
    const res = await request(app).get('/api/ai/trending?limit=5');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.trending)).toBe(true);
    expect(res.body.trending.length).toBeGreaterThanOrEqual(1);
  });
});
