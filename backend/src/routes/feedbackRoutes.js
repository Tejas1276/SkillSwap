const express = require('express');
const { body } = require('express-validator');
const { submitFeedback, getUserFeedback } = require('../controllers/feedbackController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('sessionId').isMongoId().withMessage('Valid session ID is required'),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be an integer between 1 and 5'),
    body('comment').optional().trim(),
    validate,
  ],
  submitFeedback
);

router.get('/user/:userId', getUserFeedback);

module.exports = router;
