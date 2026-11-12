const Gamification = require('../models/Gamification');
const Session = require('../models/Session');
const User = require('../models/User');

// @desc    Get user gamification stats, badges, and activity ledger
// @route   GET /api/gamification/history
// @access  Private
const getGamificationHistory = async (req, res, next) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [history, user, completedSessionsCount, todayDailyBonus] = await Promise.all([
      Gamification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50),
      User.findById(req.user._id).select('credits credibilityScore badges rating'),
      Session.countDocuments({
        $or: [{ learner: req.user._id }, { tutor: req.user._id }],
        status: 'completed',
      }),
      Gamification.findOne({
        user: req.user._id,
        type: 'bonus_received',
        description: /Daily participation streak bonus/,
        createdAt: { $gte: startOfToday },
      }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        credits: user.credits,
        credibilityScore: user.credibilityScore,
        badgesCount: user.badges.length,
        rating: user.rating,
        completedSessions: completedSessionsCount,
        dailyClaimedToday: Boolean(todayDailyBonus),
      },
      badges: user.badges,
      history,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Claim daily +10 participation credit bonus (once per day)
// @route   POST /api/gamification/daily-bonus
// @access  Private
const claimDailyBonus = async (req, res, next) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const alreadyClaimed = await Gamification.findOne({
      user: req.user._id,
      type: 'bonus_received',
      description: /Daily participation streak bonus/,
      createdAt: { $gte: startOfToday },
    });

    if (alreadyClaimed) {
      return res.status(400).json({
        success: false,
        message: 'Daily participation bonus has already been claimed today.',
      });
    }

    const user = await User.findById(req.user._id);
    const bonusAmount = 10;
    user.credits += bonusAmount;

    if (!user.badges.some((b) => b.name === 'Consistent')) {
      user.badges.push({
        name: 'Consistent',
        description: 'Checked in and engaged with peer learning goals',
        icon: 'flame',
      });
      await Gamification.create({
        user: user._id,
        type: 'badge_unlocked',
        badgeName: 'Consistent',
        description: 'Unlocked badge "Consistent" via active daily check-in',
      });
    }

    await user.save();

    const record = await Gamification.create({
      user: user._id,
      type: 'bonus_received',
      amount: bonusAmount,
      balanceAfter: user.credits,
      description: 'Daily participation streak bonus (+10 credits)',
    });

    res.status(200).json({
      success: true,
      message: `+${bonusAmount} daily participation credits added!`,
      credits: user.credits,
      record,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top peers leaderboard sorted by AI Credibility Score & rating
// @route   GET /api/gamification/leaderboard
// @access  Public
const getLeaderboard = async (req, res, next) => {
  try {
    const topUsers = await User.find({})
      .select('name avatar credits rating credibilityScore badges')
      .sort({ credibilityScore: -1, 'rating.average': -1, credits: -1 })
      .limit(10)
      .lean();

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
  claimDailyBonus,
  getLeaderboard,
};
