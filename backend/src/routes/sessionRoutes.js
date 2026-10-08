const express = require('express');
const {
  getSessionById,
  completeSession,
  cancelSession,
} = require('../controllers/sessionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/:id', getSessionById);
router.post('/:id/complete', completeSession);
router.post('/:id/cancel', cancelSession);

module.exports = router;
