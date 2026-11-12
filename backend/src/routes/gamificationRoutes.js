const express = require('express');
const {
  getGamificationHistory,
  claimDailyBonus,
  getLeaderboard,
} = require('../controllers/gamificationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/history', protect, getGamificationHistory);
router.post('/daily-bonus', protect, claimDailyBonus);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
