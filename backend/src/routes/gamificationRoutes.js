const express = require('express');
const { getGamificationHistory, getLeaderboard } = require('../controllers/gamificationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/history', protect, getGamificationHistory);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
