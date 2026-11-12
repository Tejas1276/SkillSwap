const crypto = require('crypto');
const User = require('../models/User');
const { generateToken, createUserAndAwardBonus } = require('./authController');

const getFrontendUrl = () =>
  (process.env.FRONTEND_URL || process.env.CORS_ORIGIN || 'http://localhost:3000').replace(/\/$/, '');

const getStateSecret = () =>
  process.env.JWT_SECRET || 'skillswap_super_secret_jwt_key_2026_secure';

const createSignedState = (provider) => {
  const payload = `${provider}.${Date.now()}.${crypto.randomBytes(12).toString('hex')}`;
  const sig = crypto.createHmac('sha256', getStateSecret()).update(payload).digest('hex');
  return `${payload}.${sig}`;
};

const verifySignedState = (state, expectedProvider) => {
  if (!state || typeof state !== 'string') return false;
  const parts = state.split('.');
  if (parts.length !== 4) return false;
  const [provider, ts, nonce, sig] = parts;
  if (provider !== expectedProvider) return false;
  if (Date.now() - Number(ts) > 10 * 60 * 1000) return false;

  const expectedSig = crypto
    .createHmac('sha256', getStateSecret())
    .update(`${provider}.${ts}.${nonce}`)
    .digest('hex');

  const sigBuf = Buffer.from(sig, 'hex');
  const expBuf = Buffer.from(expectedSig, 'hex');
  return sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf);
};

// @desc    Inspect which OAuth/SMTP providers have credentials configured
// @route   GET /api/auth/providers
// @access  Public
const getAuthProviders = (req, res) => {
  res.status(200).json({
    success: true,
    providers: {
      googleConfigured: Boolean(
        process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ),
      githubConfigured: Boolean(
        process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ),
      smtpConfigured: Boolean(process.env.SMTP_USER && process.env.SMTP_PASS),
    },
  });
};

// @desc    Redirect user to real Google OAuth 2.0 consent screen
// @route   GET /api/auth/google
// @access  Public
const googleAuthRedirect = (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const frontendUrl = getFrontendUrl();

  if (!clientId || !clientSecret) {
    return res.redirect(`${frontendUrl}/?auth_error=google_not_configured`);
  }

  const callbackUrl =
    process.env.GOOGLE_CALLBACK_URL || `${frontendUrl}/api/auth/google/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'online',
    prompt: 'select_account',
    state: createSignedState('google'),
  });

  return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
};

// @desc    Handle Google OAuth 2.0 callback & issue Skill Swap JWT
// @route   GET /api/auth/google/callback
// @access  Public
const googleAuthCallback = async (req, res) => {
  const frontendUrl = getFrontendUrl();
  try {
    const { code, state, error } = req.query;
    if (error || !code || !verifySignedState(state, 'google')) {
      return res.redirect(`${frontendUrl}/?auth_error=google_auth_failed`);
    }

    const callbackUrl =
      process.env.GOOGLE_CALLBACK_URL || `${frontendUrl}/api/auth/google/callback`;

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: String(code),
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: callbackUrl,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      return res.redirect(`${frontendUrl}/?auth_error=google_token_failed`);
    }

    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileRes.json();

    if (!profileRes.ok || !profile.email) {
      return res.redirect(`${frontendUrl}/?auth_error=google_profile_failed`);
    }

    const normalizedEmail = String(profile.email).toLowerCase();
    let user = await User.findOne({
      $or: [{ googleId: String(profile.id) }, { email: normalizedEmail }],
    });

    if (user) {
      let dirty = false;
      if (!user.googleId) {
        user.googleId = String(profile.id);
        dirty = true;
      }
      if (!user.emailVerified) {
        user.emailVerified = true;
        dirty = true;
      }
      if (dirty) await user.save();
    } else {
      user = await createUserAndAwardBonus({
        name: profile.name || normalizedEmail.split('@')[0],
        username: normalizedEmail.split('@')[0],
        email: normalizedEmail,
        bio: 'Joined via Google OAuth',
        authProvider: 'google',
        googleId: String(profile.id),
        emailVerified: true,
      });
    }

    const jwtToken = generateToken(user._id);
    return res.redirect(`${frontendUrl}/?oauth_token=${encodeURIComponent(jwtToken)}`);
  } catch (err) {
    console.error('[OAuth Google Error]:', err);
    return res.redirect(`${frontendUrl}/?auth_error=google_server_error`);
  }
};

// @desc    Redirect user to real GitHub OAuth consent screen
// @route   GET /api/auth/github
// @access  Public
const githubAuthRedirect = (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const frontendUrl = getFrontendUrl();

  if (!clientId || !clientSecret) {
    return res.redirect(`${frontendUrl}/?auth_error=github_not_configured`);
  }

  const callbackUrl =
    process.env.GITHUB_CALLBACK_URL || `${frontendUrl}/api/auth/github/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl,
    scope: 'read:user user:email',
    state: createSignedState('github'),
  });

  return res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
};

// @desc    Handle GitHub OAuth callback & issue Skill Swap JWT
// @route   GET /api/auth/github/callback
// @access  Public
const githubAuthCallback = async (req, res) => {
  const frontendUrl = getFrontendUrl();
  try {
    const { code, state, error } = req.query;
    if (error || !code || !verifySignedState(state, 'github')) {
      return res.redirect(`${frontendUrl}/?auth_error=github_auth_failed`);
    }

    const callbackUrl =
      process.env.GITHUB_CALLBACK_URL || `${frontendUrl}/api/auth/github/callback`;

    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: String(code),
        redirect_uri: callbackUrl,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      return res.redirect(`${frontendUrl}/?auth_error=github_token_failed`);
    }

    const ghHeaders = {
      Authorization: `Bearer ${tokenData.access_token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'SkillSwap-App',
    };

    const [userRes, emailsRes] = await Promise.all([
      fetch('https://api.github.com/user', { headers: ghHeaders }),
      fetch('https://api.github.com/user/emails', { headers: ghHeaders }),
    ]);

    const ghUser = await userRes.json();
    const ghEmails = emailsRes.ok ? await emailsRes.json() : [];

    const primaryVerified = Array.isArray(ghEmails)
      ? ghEmails.find((e) => e.primary && e.verified) ||
        ghEmails.find((e) => e.verified) ||
        ghEmails[0]
      : null;

    const resolvedEmail = (ghUser.email || primaryVerified?.email || '').toLowerCase();
    if (!userRes.ok || !resolvedEmail) {
      return res.redirect(`${frontendUrl}/?auth_error=github_email_unavailable`);
    }

    let user = await User.findOne({
      $or: [{ githubId: String(ghUser.id) }, { email: resolvedEmail }],
    });

    if (user) {
      let dirty = false;
      if (!user.githubId) {
        user.githubId = String(ghUser.id);
        dirty = true;
      }
      if (!user.emailVerified) {
        user.emailVerified = true;
        dirty = true;
      }
      if (dirty) await user.save();
    } else {
      user = await createUserAndAwardBonus({
        name: ghUser.name || ghUser.login || resolvedEmail.split('@')[0],
        username: ghUser.login || resolvedEmail.split('@')[0],
        email: resolvedEmail,
        bio: ghUser.bio || 'Joined via GitHub OAuth',
        authProvider: 'github',
        githubId: String(ghUser.id),
        emailVerified: true,
      });
    }

    const jwtToken = generateToken(user._id);
    return res.redirect(`${frontendUrl}/?oauth_token=${encodeURIComponent(jwtToken)}`);
  } catch (err) {
    console.error('[OAuth GitHub Error]:', err);
    return res.redirect(`${frontendUrl}/?auth_error=github_server_error`);
  }
};

module.exports = {
  getAuthProviders,
  googleAuthRedirect,
  googleAuthCallback,
  githubAuthRedirect,
  githubAuthCallback,
};
