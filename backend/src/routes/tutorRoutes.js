const express = require('express');
const { body } = require('express-validator');
const {
  getSkillsToTeach,
  addSkillToTeach,
  removeSkillToTeach,
  getSessionRequests,
  respondToSessionRequest,
  getTutorSessions,
  updateAvailability,
} = require('../controllers/tutorController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// All tutor endpoints are protected
router.use(protect);

// Manage teaching skills
router.get('/skills', getSkillsToTeach);
router.post(
  '/skills',
  [
    body('skill').trim().notEmpty().withMessage('Skill name is required'),
    body('proficiency')
      .optional()
      .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
      .withMessage('Invalid proficiency level'),
    body('hourlyCredits')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Hourly credits must be a positive number'),
    validate,
  ],
  addSkillToTeach
);
router.delete('/skills/:skillName', removeSkillToTeach);

// Session requests & management
router.get('/sessions/requests', getSessionRequests);
router.patch(
  '/sessions/:sessionId/respond',
  [
    body('action')
      .isIn(['accept', 'reject'])
      .withMessage("Action must be either 'accept' or 'reject'"),
    validate,
  ],
  respondToSessionRequest
);
router.get('/sessions', getTutorSessions);

// Availability status
router.put(
  '/availability',
  [
    body('isAvailable').isBoolean().withMessage("'isAvailable' must be boolean"),
    validate,
  ],
  updateAvailability
);

module.exports = router;
