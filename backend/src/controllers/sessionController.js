const Session = require('../models/Session');
const User = require('../models/User');
const Gamification = require('../models/Gamification');

// @desc    Get session details by ID
// @route   GET /api/sessions/:id
// @access  Private
const getSessionById = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('learner', 'name email avatar credits credibilityScore')
      .populate('tutor', 'name email avatar rating credibilityScore');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    // Verify requesting user is learner or tutor
    const isLearner = session.learner._id.toString() === req.user._id.toString();
    const isTutor = session.tutor._id.toString() === req.user._id.toString();

    if (!isLearner && !isTutor) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this session',
      });
    }

    res.status(200).json({
      success: true,
      session,
      isLearner,
      isTutor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete a session & transfer credits
// @route   POST /api/sessions/:id/complete
// @access  Private
const completeSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    // Must be tutor or learner
    const isLearner = session.learner.toString() === req.user._id.toString();
    const isTutor = session.tutor.toString() === req.user._id.toString();

    if (!isLearner && !isTutor) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to complete this session',
      });
    }

    if (session.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Session is already marked as completed',
      });
    }

    session.status = 'completed';
    await session.save();

    // Credit Transfer Logic
    const learner = await User.findById(session.learner);
    const tutor = await User.findById(session.tutor);
    const creditsToTransfer = session.creditsExchanged || 10;

    // Deduct from learner if sufficient
    if (learner.credits >= creditsToTransfer) {
      learner.credits -= creditsToTransfer;
    } else {
      learner.credits = 0;
    }
    await learner.save();

    // Credit to tutor
    tutor.credits += creditsToTransfer;
    await tutor.save();

    // Log gamification credit records
    await Gamification.create([
      {
        user: learner._id,
        type: 'credit_spent',
        amount: -creditsToTransfer,
        balanceAfter: learner.credits,
        description: `Spent ${creditsToTransfer} credits for ${session.skill} session`,
        session: session._id,
      },
      {
        user: tutor._id,
        type: 'credit_earned',
        amount: creditsToTransfer,
        balanceAfter: tutor.credits,
        description: `Earned ${creditsToTransfer} credits for tutoring ${session.skill}`,
        session: session._id,
      },
    ]);

    res.status(200).json({
      success: true,
      message: 'Session completed and credits transferred successfully',
      session,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a session
// @route   POST /api/sessions/:id/cancel
// @access  Private
const cancelSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    const isLearner = session.learner.toString() === req.user._id.toString();
    const isTutor = session.tutor.toString() === req.user._id.toString();

    if (!isLearner && !isTutor) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to cancel this session',
      });
    }

    if (session.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Completed sessions cannot be cancelled',
      });
    }

    session.status = 'cancelled';
    await session.save();

    res.status(200).json({
      success: true,
      message: 'Session cancelled successfully',
      session,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSessionById,
  completeSession,
  cancelSession,
};
