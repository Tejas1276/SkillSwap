const express = require('express');
const { body } = require('express-validator');
const {
  getSkillsToLearn,
  addSkillToLearn,
  removeSkillToLearn,
  searchTutors,
  requestSession,
  getLearnerSessions,
} = require('../controllers/learnerController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// All learner endpoints are protected
router.use(protect);

// Manage learning skills
router.get('/skills', getSkillsToLearn);
router.post(
  '/skills',
  [
    body('skill').trim().notEmpty().withMessage('Skill name is required'),
    body('targetProficiency')
      .optional()
      .isIn(['beginner', 'intermediate', 'advanced'])
      .withMessage('Invalid proficiency level'),
    validate,
  ],
  addSkillToLearn
);
router.delete('/skills/:skillName', removeSkillToLearn);

// Tutor search & session booking
router.get('/tutors', searchTutors);
router.post(
  '/sessions',
  [
    body('tutorId').isMongoId().withMessage('Valid tutor ID is required'),
    body('skill').trim().notEmpty().withMessage('Skill is required'),
    body('scheduledAt').isISO8601().withMessage('Valid scheduled date/time is required'),
    body('durationMinutes')
      .optional()
      .isInt({ min: 15, max: 240 })
      .withMessage('Duration must be between 15 and 240 minutes'),
    validate,
  ],
  requestSession
);
router.get('/sessions', getLearnerSessions);

module.exports = router;
