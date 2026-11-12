const nodemailer = require('nodemailer');

let cachedEtherealAccount = null;

/**
 * Resolves the active mail transport:
 * 1. In tests: Nodemailer JSON transport (zero network I/O).
 * 2. When SMTP_USER & SMTP_PASS are configured in .env: Real SMTP (e.g., Gmail/Brevo/Resend).
 * 3. Otherwise in dev: Ethereal live sandbox SMTP account so real emails can be previewed immediately.
 */
async function createMailTransport() {
  if (process.env.NODE_ENV === 'test') {
    return {
      mode: 'test',
      transporter: nodemailer.createTransport({ jsonTransport: true }),
      fromAddress: process.env.SMTP_FROM || 'Skill Swap <no-reply@skillswap.io>',
    };
  }

  const smtpUser = (process.env.SMTP_USER || '').trim();
  const smtpPass = (process.env.SMTP_PASS || '').trim();

  if (smtpUser && smtpPass) {
    const port = Number(process.env.SMTP_PORT || 465);
    const secure =
      process.env.SMTP_SECURE !== undefined
        ? process.env.SMTP_SECURE === 'true'
        : port === 465;

    return {
      mode: 'smtp',
      transporter: nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port,
        secure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      }),
      fromAddress: process.env.SMTP_FROM || `Skill Swap <${smtpUser}>`,
    };
  }

  if (!cachedEtherealAccount) {
    cachedEtherealAccount = await nodemailer.createTestAccount();
  }

  return {
    mode: 'ethereal',
    transporter: nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: cachedEtherealAccount.user,
        pass: cachedEtherealAccount.pass,
      },
    }),
    fromAddress: process.env.SMTP_FROM || `Skill Swap <${cachedEtherealAccount.user}>`,
  };
}

/**
 * Sends a 6-digit email verification OTP for new account registration.
 */
async function sendOtpEmail({ to, name, username, otp }) {
  const html = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 520px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 28px; background: #ffffff;">
      <div style="border-bottom: 2px solid #0d9488; padding-bottom: 14px; margin-bottom: 20px;">
        <h2 style="margin: 0; color: #0f172a; font-size: 20px;">Skill Swap — Verify Your Email</h2>
      </div>
      <p style="color: #334155; font-size: 14px; line-height: 1.6;">
        Hi <strong>${name}</strong> (@${username}),
      </p>
      <p style="color: #334155; font-size: 14px; line-height: 1.6;">
        Use the 6-digit One-Time Password (OTP) below to complete your Skill Swap registration and unlock your 100 welcome credits:
      </p>
      <div style="background: #f0fdfa; border: 1px solid #99f6e4; padding: 18px; text-align: center; margin: 22px 0;">
        <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #0f766e;">${otp}</span>
      </div>
      <p style="color: #64748b; font-size: 12px; line-height: 1.5;">
        This verification code expires in <strong>10 minutes</strong>. If you did not request this signup, you can safely ignore this message.
      </p>
    </div>
  `;

  try {
    const { mode, transporter, fromAddress } = await createMailTransport();
    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject: `${otp} is your Skill Swap verification code`,
      text: `Hi ${name} (@${username}), your Skill Swap OTP is ${otp}. It expires in 10 minutes.`,
      html,
    });

    const previewUrl = mode === 'ethereal' ? nodemailer.getTestMessageUrl(info) : null;
    if (previewUrl) {
      console.log(`[Mail] Ethereal OTP Email Preview for ${to}: ${previewUrl}`);
    } else if (mode === 'smtp') {
      console.log(`[Mail] OTP Email delivered via SMTP to ${to}`);
    }

    return { deliveryMode: mode, previewUrl };
  } catch (err) {
    console.warn(`[Mail Fallback] SMTP delivery failed (${err.message}); OTP generated for ${to}: ${otp}`);
    return { deliveryMode: 'console', previewUrl: null };
  }
}

module.exports = { sendOtpEmail };
