const Feedback = require('../models/Feedback');
const Session = require('../models/Session');
const User = require('../models/User');
const Gamification = require('../models/Gamification');

/**
 * Calculates updated AI Credibility Score (10 - 100) using both
 * star rating and multidimensional criteria (clarity, helpfulness, punctuality).
 */
const computeCredibilityScore = (currentScore, feedbackRating, totalRatings, criteria = {}) => {
  const cClarity = Number(criteria?.clarity ?? feedbackRating);
  const cHelpfulness = Number(criteria?.helpfulness ?? feedbackRating);
  const cPunctuality = Number(criteria?.punctuality ?? feedbackRating);
  const criteriaAvg = (cClarity + cHelpfulness + cPunctuality) / 3;

  const effectiveRating = 0.7 * feedbackRating + 0.3 * criteriaAvg;
  const targetScoreFromRating = effectiveRating * 20; // 5.0 -> 100, 1.0 -> 20
  const weight = Math.min(0.25, Math.max(0.08, 1 / (totalRatings + 1)));
  const newScore = currentScore * (1 - weight) + targetScoreFromRating * weight;
  return Math.min(100, Math.max(10, Math.round(newScore * 10) / 10));
};

const awardBadgeIfMissing = async (userDoc, badgeDef, sessionId = null) => {
  const alreadyHas = userDoc.badges.some((b) => b.name === badgeDef.name);
  if (alreadyHas) return false;

  userDoc.badges.push({
    name: badgeDef.name,
    description: badgeDef.description,
    icon: badgeDef.icon,
  });

  await Gamification.create({
    user: userDoc._id,
    type: 'badge_unlocked',
    badgeName: badgeDef.name,
    description: `Unlocked badge "${badgeDef.name}": ${badgeDef.description}`,
    ...(sessionId ? { session: sessionId } : {}),
  });

  return true;
};

// @desc    Submit feedback for a completed session
// @route   POST /api/feedback
// @access  Private
const submitFeedback = async (req, res, next) => {
  try {
    const { sessionId, rating, comment, criteria } = req.body;

    if (!sessionId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Session ID and rating are required',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    if (session.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Feedback can only be submitted for completed sessions',
      });
    }

    const isLearner = session.learner.toString() === req.user._id.toString();
    const isTutor = session.tutor.toString() === req.user._id.toString();

    if (!isLearner && !isTutor) {
      return res.status(403).json({
        success: false,
        message: 'You are not a participant in this session',
      });
    }

    const role = isLearner ? 'learner' : 'tutor';
    const revieweeId = isLearner ? session.tutor : session.learner;

    const existingFeedback = await Feedback.findOne({
      session: sessionId,
      reviewer: req.user._id,
    });

    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted feedback for this session',
      });
    }

    const resolvedCriteria = criteria || {
      clarity: rating,
      helpfulness: rating,
      punctuality: rating,
    };

    const feedback = await Feedback.create({
      session: sessionId,
      reviewer: req.user._id,
      reviewee: revieweeId,
      role,
      rating,
      comment: comment || '',
      criteria: resolvedCriteria,
    });

    if (isLearner) {
      session.learnerFeedbackCompleted = true;
    } else {
      session.tutorFeedbackCompleted = true;
    }
    await session.save();

    // 1. Update reviewee rating, AI Credibility Score, and milestone badges
    const reviewee = await User.findById(revieweeId);
    let updatedCredibility = null;
    if (reviewee) {
      const priorCount = reviewee.rating.count || 0;
      const priorAvg = reviewee.rating.average || 0;
      const newCount = priorCount + 1;
      const newAvg = Math.round(((priorAvg * priorCount + rating) / newCount) * 10) / 10;

      const previousScore = reviewee.credibilityScore || 70.0;
      updatedCredibility = computeCredibilityScore(
        previousScore,
        rating,
        newCount,
        resolvedCriteria
      );

      reviewee.rating = {
        average: newAvg,
        count: newCount,
      };
      reviewee.credibilityScore = updatedCredibility;

      if (newCount >= 5 && newAvg >= 4.5) {
        await awardBadgeIfMissing(
          reviewee,
          {
            name: 'Top Rated Peer',
            description: 'Maintained 4.5+ star rating across 5 or more sessions',
            icon: 'star',
          },
          session._id
        );
      }

      if (rating === 5 && newCount >= 1) {
        await awardBadgeIfMissing(
          reviewee,
          {
            name: '5-Star Mentor',
            description: 'Earned a perfect 5-star review from a peer',
            icon: 'award',
          },
          session._id
        );
      }

      await reviewee.save();

      await Gamification.create({
        user: reviewee._id,
        type: 'credibility_updated',
        credibilityDelta: Math.round((updatedCredibility - previousScore) * 10) / 10,
        description: `AI Credibility Score updated to ${updatedCredibility} based on ${rating}★ review`,
        session: session._id,
      });
    }

    // 2. Reward reviewer (+5 participation credits + Active Reviewer badge)
    const reviewer = await User.findById(req.user._id);
    let reviewerCreditsAwarded = 0;
    if (reviewer) {
      reviewerCreditsAwarded = 5;
      reviewer.credits += reviewerCreditsAwarded;

      await awardBadgeIfMissing(
        reviewer,
        {
          name: 'Active Reviewer',
          description: 'Submitted constructive peer feedback to improve campus trust',
          icon: 'shield',
        },
        session._id
      );

      await reviewer.save();

      await Gamification.create({
        user: reviewer._id,
        type: 'bonus_received',
        amount: reviewerCreditsAwarded,
        balanceAfter: reviewer.credits,
        description: `Earned +${reviewerCreditsAwarded} bonus credits for submitting session review`,
        session: session._id,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Feedback submitted and AI Credibility Score updated successfully',
      feedback,
      updatedCredibilityScore: updatedCredibility,
      reviewerCreditsAwarded,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get feedback for a specific user
// @route   GET /api/feedback/user/:userId
// @access  Public
const getUserFeedback = async (req, res, next) => {
  try {
    const feedbackList = await Feedback.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name avatar')
      .populate('session', 'skill scheduledAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedbackList.length,
      feedback: feedbackList,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitFeedback,
  getUserFeedback,
  computeCredibilityScore,
};
