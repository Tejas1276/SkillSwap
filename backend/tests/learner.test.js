const request = require('supertest');
const app = require('../src/app');
const { setupTestDB } = require('./setup');

describe('Learner Module API Tests', () => {
  setupTestDB();

  let learnerToken;
  let learnerId;
  let tutorToken;
  let tutorId;

  beforeEach(async () => {
    // Create learner
    const learnerRes = await request(app).post('/api/auth/register').send({
      name: 'Learner Lucy',
      email: 'lucy@learner.com',
      password: 'password123',
    });
    learnerToken = learnerRes.body.token;
    learnerId = learnerRes.body.user._id;

    // Create tutor
    const tutorRes = await request(app).post('/api/auth/register').send({
      name: 'Tutor Tom',
      email: 'tom@tutor.com',
      password: 'password123',
    });
    tutorToken = tutorRes.body.token;
    tutorId = tutorRes.body.user._id;

    // Tom offers Python
    await request(app)
      .post('/api/tutor/skills')
      .set('Authorization', `Bearer ${tutorToken}`)
      .send({
        skill: 'python',
        proficiency: 'expert',
        hourlyCredits: 20,
        description: 'Python master with 5+ years experience',
      });
  });

  describe('Skills to Learn Management', () => {
    it('should allow learner to add a skill they want to learn', async () => {
      const res = await request(app)
        .post('/api/learner/skills')
        .set('Authorization', `Bearer ${learnerToken}`)
        .send({
          skill: 'Python',
          targetProficiency: 'intermediate',
          notes: 'Want to build data science models',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.skills.length).toBe(1);
      expect(res.body.skills[0].skill).toBe('python');
    });

    it('should list user learning skills', async () => {
      await request(app)
        .post('/api/learner/skills')
        .set('Authorization', `Bearer ${learnerToken}`)
        .send({ skill: 'Docker' });

      const res = await request(app)
        .get('/api/learner/skills')
        .set('Authorization', `Bearer ${learnerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.skills.length).toBe(1);
      expect(res.body.skills[0].skill).toBe('docker');
    });

    it('should allow learner to remove a skill from learning list', async () => {
      await request(app)
        .post('/api/learner/skills')
        .set('Authorization', `Bearer ${learnerToken}`)
        .send({ skill: 'React' });

      const deleteRes = await request(app)
        .delete('/api/learner/skills/React')
        .set('Authorization', `Bearer ${learnerToken}`);

      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.skills.length).toBe(0);
    });
  });

  describe('Tutor Search and Session Booking', () => {
    it('should search and find tutors offering a specific skill', async () => {
      const res = await request(app)
        .get('/api/learner/tutors?skill=python')
        .set('Authorization', `Bearer ${learnerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.tutors.length).toBe(1);
      expect(res.body.tutors[0].name).toBe('Tutor Tom');
      expect(res.body.tutors[0].skillsToTeach[0].skill).toBe('python');
    });

    it('should allow learner to book a learning session with a tutor', async () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString(); // Tomorrow

      const res = await request(app)
        .post('/api/learner/sessions')
        .set('Authorization', `Bearer ${learnerToken}`)
        .send({
          tutorId,
          skill: 'python',
          topic: 'AsyncIO and decorators in Python',
          scheduledAt: futureDate,
          durationMinutes: 60,
          learnerNotes: 'Please cover practical examples',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.session.status).toBe('requested');
      expect(res.body.session.skill).toBe('python');
      expect(res.body.session.meetingRoomId).toBeDefined();
    });

    it('should reject booking if tutor does not offer that skill', async () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString();

      const res = await request(app)
        .post('/api/learner/sessions')
        .set('Authorization', `Bearer ${learnerToken}`)
        .send({
          tutorId,
          skill: 'Rust', // Tom only offers python
          scheduledAt: futureDate,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/does not offer skill/i);
    });
  });
});
