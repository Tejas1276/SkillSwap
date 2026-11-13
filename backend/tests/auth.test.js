const request = require('supertest');
const app = require('../src/app');
const { setupTestDB } = require('./setup');

describe('Auth Module API Tests', () => {
  setupTestDB();

  const mockUser = {
    name: 'Alice Johnson',
    email: 'alice@skillswap.io',
    password: 'password123',
    bio: 'Software engineer eager to learn photography',
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully and return a JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(mockUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('_id');
      expect(res.body.user.email).toBe(mockUser.email);
      expect(res.body.user.credits).toBe(100);
      expect(res.body.user.credibilityScore).toBe(70);
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should reject registration if email is already registered', async () => {
      await request(app).post('/api/auth/register').send(mockUser);

      const res = await request(app)
        .post('/api/auth/register')
        .send(mockUser);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already exists/i);
    });

    it('should reject registration if password is less than 6 chars', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Bob',
          email: 'bob@skillswap.io',
          password: '123',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(mockUser);
    });

    it('should log in with correct credentials and return token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: mockUser.email,
          password: mockUser.password,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(mockUser.email);
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: mockUser.email,
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me & PUT /api/auth/profile', () => {
    let token;

    beforeEach(async () => {
      const reg = await request(app).post('/api/auth/register').send(mockUser);
      token = reg.body.token;
    });

    it('should get current user profile with valid JWT', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(mockUser.email);
    });

    it('should update current user profile', async () => {
      const res = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bio: 'Updated bio: Enthusiastic full-stack dev',
          isAvailable: false,
        });

      expect(res.status).toBe(200);
      expect(res.body.user.bio).toBe('Updated bio: Enthusiastic full-stack dev');
      expect(res.body.user.isAvailable).toBe(false);
    });
  });
});
