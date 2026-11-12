const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const EmailOtp = require('../models/EmailOtp');
const Gamification = require('../models/Gamification');
const { sendOtpEmail } = require('../services/mailService');

// Helper to generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'skillswap_super_secret_jwt_key_2026_secure',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const hashOtp = (otp) =>
  crypto.createHash('sha256').update(String(otp).trim()).digest('hex');

const slugifyUsername = (raw) =>
  String(raw || 'learner')
    .toLowerCase()
    .replace(/[^a-z0-9_.-]/g, '')
    .slice(0, 24) || 'learner';

const resolveUniqueUsername = async (preferred) => {
  const base = slugifyUsername(preferred);
  let candidate = base.length >= 3 ? base : `${base}user`;
  let exists = await User.exists({ username: candidate });
  while (exists) {
    const suffix = crypto.randomInt(100, 9999);
    candidate = `${base.slice(0, 20)}${suffix}`;
    exists = await User.exists({ username: candidate });
  }
  return candidate;
};

/**
 * Creates a User document with the 100-credit welcome bonus and Pioneer badge.
 * Used by /register, /verify-otp, Google OAuth, and GitHub OAuth.
 */
const createUserAndAwardBonus = async ({
  name,
  username,
  email,
  password,
  passwordHash,
  bio = '',
  authProvider = 'local',
  googleId,
  githubId,
  emailVerified = false,
}) => {
  const userData = {
    name,
    email,
    bio,
    authProvider,
    emailVerified,
    credits: 100,
    credibilityScore: 70.0,
    badges: [
      {
        name: 'Pioneer',
        description: 'Joined the Skill Swap community',
        icon: 'compass',
      },
    ],
  };

  if (username) {
    userData.username = await resolveUniqueUsername(username);
  }
  if (googleId) userData.googleId = googleId;
  if (githubId) userData.githubId = githubId;

  const user = new User(userData);
  if (passwordHash) {
    user.password = passwordHash;
    user.$locals.skipPasswordHash = true;
  } else if (password) {
    user.password = password;
  }

  await user.save();

  await Gamification.create({
    user: user._id,
    type: 'bonus_received',
    amount: 100,
    balanceAfter: 100,
    description: 'Welcome bonus: 100 free credits to start learning and teaching',
  });

  return user;
};

// @desc    Send 6-digit email OTP before creating account
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res, next) => {
  try {
    const { name, username, email, password, bio } = req.body;
    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedUsername = String(username).trim().toLowerCase();

    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    const existingUsername = await User.findOne({ username: normalizedUsername });
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: 'This username is already taken. Please choose another.',
      });
    }

    const otp = String(crypto.randomInt(100000, 1000000));
    const passwordHash = await bcrypt.hash(password, 10);

    await EmailOtp.findOneAndUpdate(
      { email: normalizedEmail },
      {
        email: normalizedEmail,
        name: name.trim(),
        username: normalizedUsername,
        passwordHash,
        bio: bio || '',
        otpHash: hashOtp(otp),
        attempts: 0,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      { upsert: true, new: true }
    );

    const mailResult = await sendOtpEmail({
      to: normalizedEmail,
      name: name.trim(),
      username: normalizedUsername,
      otp,
    });

    res.status(200).json({
      success: true,
      message: `Verification OTP sent to ${normalizedEmail}`,
      deliveryMode: mailResult.deliveryMode,
      previewUrl: mailResult.previewUrl || null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify 6-digit email OTP and create verified user account
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res, next) => {
  try {
    const normalizedEmail = String(req.body.email).trim().toLowerCase();
    const submittedOtp = String(req.body.otp).trim();

    const record = await EmailOtp.findOne({ email: normalizedEmail });
    if (!record) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired or not requested. Please request a new code.',
      });
    }

    if (record.expiresAt < new Date()) {
      await EmailOtp.deleteOne({ _id: record._id });
      return res.status(400).json({
        success: false,
        message: 'Verification OTP has expired. Please request a new code.',
      });
    }

    if (record.attempts >= 5) {
      return res.status(429).json({
        success: false,
        message: 'Too many invalid attempts. Please request a new OTP.',
      });
    }

    const submittedHash = Buffer.from(hashOtp(submittedOtp), 'hex');
    const expectedHash = Buffer.from(record.otpHash, 'hex');
    const isValid =
      submittedHash.length === expectedHash.length &&
      crypto.timingSafeEqual(submittedHash, expectedHash);

    if (!isValid) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({
        success: false,
        message: 'Invalid verification OTP code',
      });
    }

    const existingConflict = await User.findOne({
      $or: [{ email: record.email }, { username: record.username }],
    });
    if (existingConflict) {
      await EmailOtp.deleteOne({ _id: record._id });
      return res.status(409).json({
        success: false,
        message: 'An account with this email or username already exists',
      });
    }

    const user = await createUserAndAwardBonus({
      name: record.name,
      username: record.username,
      email: record.email,
      passwordHash: record.passwordHash,
      bio: record.bio,
      authProvider: 'local',
      emailVerified: true,
    });

    await EmailOtp.deleteOne({ _id: record._id });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Email verified and account created successfully',
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Direct register (preserved for automated tests & API clients)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, username, email, password, bio } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    if (username) {
      const existingUsername = await User.findOne({ username: username.toLowerCase() });
      if (existingUsername) {
        return res.status(409).json({
          success: false,
          message: 'This username is already taken',
        });
      }
    }

    const user = await createUserAndAwardBonus({
      name,
      username,
      email,
      password,
      bio,
      authProvider: 'local',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user via email or username & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const rawIdentifier = req.body.email || req.body.identifier || req.body.username || '';
    const identifier = String(rawIdentifier).trim().toLowerCase();
    const { password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email/username and password',
      });
    }

    const query = identifier.includes('@') ? { email: identifier } : { username: identifier };
    const user = await User.findOne(query).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (user.authProvider !== 'local' && !user.password) {
      return res.status(401).json({
        success: false,
        message: `This account uses ${user.authProvider} sign-in. Please continue with ${user.authProvider}.`,
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, avatar, isAvailable } = req.body;
    const updates = {};

    if (name !== undefined) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (avatar !== undefined) updates.avatar = avatar;
    if (isAvailable !== undefined) updates.isAvailable = isAvailable;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateToken,
  createUserAndAwardBonus,
  sendOtp,
  verifyOtp,
  register,
  login,
  getMe,
  updateProfile,
};
