const Gamification = require('../models/Gamification');
const User = require('../models/User');

// @desc    Get user gamification activity history
// @route   GET /api/gamification/history
// @access  Private
const getGamificationHistory = async (req, res, next) => {
  try {
    const history = await Gamification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    const user = await User.findById(req.user._id).select('credits credibilityScore badges rating');

    res.status(200).json({
      success: true,
      stats: {
        credits: user.credits,
        credibilityScore: user.credibilityScore,
        badgesCount: user.badges.length,
        rating: user.rating,
      },
      badges: user.badges,
      history,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top tutors / leaderboard
// @route   GET /api/gamification/leaderboard
// @access  Public
const getLeaderboard = async (req, res, next) => {
  try {
    const topUsers = await User.find({ 'rating.count': { $gte: 1 } })
      .select('name avatar rating credibilityScore badges')
      .sort({ credibilityScore: -1, 'rating.average': -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      leaderboard: topUsers,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGamificationHistory,
  getLeaderboard,
};
