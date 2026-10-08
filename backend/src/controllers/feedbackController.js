const Feedback = require('../models/Feedback');
const Session = require('../models/Session');
const User = require('../models/User');
const Gamification = require('../models/Gamification');

// Helper to calculate updated AI Credibility Score
const computeCredibilityScore = (currentScore, feedbackRating, totalRatings) => {
  // A 5-star rating pulls score toward 95-100; a 1-star pulls down toward 20-40.
  // Weight factor scales with confidence (number of ratings)
  const targetScoreFromRating = feedbackRating * 20; // 5 -> 100, 4 -> 80, 3 -> 60, etc.
  const weight = Math.min(0.2, 1 / (totalRatings + 1));
  const newScore = currentScore * (1 - weight) + targetScoreFromRating * weight;
  return Math.min(100, Math.max(10, Math.round(newScore * 10) / 10));
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

    // Check if feedback already submitted by this user for this session
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

    const feedback = await Feedback.create({
      session: sessionId,
      reviewer: req.user._id,
      reviewee: revieweeId,
      role,
      rating,
      comment: comment || '',
      criteria: criteria || { clarity: 5, helpfulness: 5, punctuality: 5 },
    });

    // Update session flags
    if (isLearner) {
      session.learnerFeedbackCompleted = true;
    } else {
      session.tutorFeedbackCompleted = true;
    }
    await session.save();

    // Update reviewee user rating and AI Credibility Score
    const reviewee = await User.findById(revieweeId);
    if (reviewee) {
      const priorCount = reviewee.rating.count || 0;
      const priorAvg = reviewee.rating.average || 0;
      const newCount = priorCount + 1;
      const newAvg = Math.round(((priorAvg * priorCount + rating) / newCount) * 10) / 10;

      const previousScore = reviewee.credibilityScore || 70.0;
      const updatedCredibility = computeCredibilityScore(previousScore, rating, newCount);

      reviewee.rating = {
        average: newAvg,
        count: newCount,
      };
      reviewee.credibilityScore = updatedCredibility;

      // Check for high rating badges
      if (newCount >= 5 && newAvg >= 4.5) {
        const hasTopRatedBadge = reviewee.badges.some((b) => b.name === 'Top Rated Peer');
        if (!hasTopRatedBadge) {
          reviewee.badges.push({
            name: 'Top Rated Peer',
            description: 'Maintained 4.5+ star rating across 5 or more sessions',
            icon: 'star',
          });
        }
      }

      await reviewee.save();

      // Log Gamification credibility update
      await Gamification.create({
        user: reviewee._id,
        type: 'credibility_updated',
        credibilityDelta: Math.round((updatedCredibility - previousScore) * 10) / 10,
        description: `Credibility score updated to ${updatedCredibility} based on rating ${rating}★`,
        session: session._id,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Feedback submitted and credibility updated successfully',
      feedback,
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
};
