const express = require('express');
const { body } = require('express-validator');
const {
  getAIHealth,
  getAIRecommendations,
  getLearningPath,
  getTrendingSkills,
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

router.get('/health', getAIHealth);
router.get('/trending', getTrendingSkills);
router.get('/recommendations', protect, getAIRecommendations);
router.post(
  '/learning-path',
  protect,
  [
    body('goalSkill').optional().trim().isString().withMessage('goalSkill must be a string'),
    validate,
  ],
  getLearningPath
);

module.exports = router;
