const express = require('express');
const { body } = require('express-validator');
const {
  sendOtp,
  verifyOtp,
  register,
  login,
  getMe,
  updateProfile,
} = require('../controllers/authController');
const {
  getAuthProviders,
  googleAuthRedirect,
  googleAuthCallback,
  githubAuthRedirect,
  githubAuthCallback,
} = require('../controllers/oauthController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be 3 to 30 characters')
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage('Username may only contain letters, numbers, underscores, dots, and hyphens'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validate,
];

const sendOtpValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be 3 to 30 characters')
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage('Username may only contain letters, numbers, underscores, dots, and hyphens'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validate,
];

const verifyOtpValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('otp')
    .trim()
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('Valid 6-digit OTP is required'),
  validate,
];

const loginValidation = [
  body().custom((value, { req }) => {
    const id = req.body.email || req.body.identifier || req.body.username;
    if (!id || !String(id).trim()) {
      throw new Error('Email or username is required');
    }
    return true;
  }),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

// Local email/username + OTP verification routes
router.post('/send-otp', sendOtpValidation, sendOtp);
router.post('/verify-otp', verifyOtpValidation, verifyOtp);
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// OAuth 2.0 provider status & flows
router.get('/providers', getAuthProviders);
router.get('/google', googleAuthRedirect);
router.get('/google/callback', googleAuthCallback);
router.get('/github', githubAuthRedirect);
router.get('/github/callback', githubAuthCallback);

// Protected account routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
