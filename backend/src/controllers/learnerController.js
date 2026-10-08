const User = require('../models/User');
const Session = require('../models/Session');

// @desc    Get user's learning wishlist/skills to learn
// @route   GET /api/learner/skills
// @access  Private
const getSkillsToLearn = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('skillsToLearn');
    res.status(200).json({
      success: true,
      skills: user.skillsToLearn || [],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add or select a skill to learn
// @route   POST /api/learner/skills
// @access  Private
const addSkillToLearn = async (req, res, next) => {
  try {
    const { skill, targetProficiency, notes } = req.body;

    if (!skill || typeof skill !== 'string' || !skill.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid skill name',
      });
    }

    const normalizedSkill = skill.trim().toLowerCase();
    const user = await User.findById(req.user._id);

    // Check if skill is already in learning list
    const existingIndex = user.skillsToLearn.findIndex(
      (s) => s.skill.toLowerCase() === normalizedSkill
    );

    if (existingIndex > -1) {
      // Update existing skill target
      user.skillsToLearn[existingIndex].targetProficiency =
        targetProficiency || user.skillsToLearn[existingIndex].targetProficiency;
      if (notes !== undefined) {
        user.skillsToLearn[existingIndex].notes = notes;
      }
      await user.save();

      return res.status(200).json({
        success: true,
        message: `Updated learning goals for '${normalizedSkill}'`,
        skills: user.skillsToLearn,
      });
    }

    // Add new skill
    user.skillsToLearn.push({
      skill: normalizedSkill,
      targetProficiency: targetProficiency || 'intermediate',
      notes: notes || '',
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: `Skill '${normalizedSkill}' added to learning list`,
      skills: user.skillsToLearn,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a skill from learning list
// @route   DELETE /api/learner/skills/:skillName
// @access  Private
const removeSkillToLearn = async (req, res, next) => {
  try {
    const { skillName } = req.params;
    const normalizedSkill = decodeURIComponent(skillName).trim().toLowerCase();

    const user = await User.findById(req.user._id);
    const initialLength = user.skillsToLearn.length;

    user.skillsToLearn = user.skillsToLearn.filter(
      (s) => s.skill.toLowerCase() !== normalizedSkill
    );

    if (user.skillsToLearn.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: `Skill '${normalizedSkill}' was not found in your learning list`,
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: `Skill '${normalizedSkill}' removed from learning list`,
      skills: user.skillsToLearn,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Find available tutors for a skill
// @route   GET /api/learner/tutors
// @access  Private
const searchTutors = async (req, res, next) => {
  try {
    const { skill, minRating, page = 1, limit = 10 } = req.query;

    const query = {
      _id: { $ne: req.user._id }, // Don't return self
      isAvailable: true,
      'skillsToTeach.0': { $exists: true }, // Must offer at least one skill
    };

    if (skill) {
      query['skillsToTeach.skill'] = new RegExp(skill.trim(), 'i');
    }

    if (minRating) {
      query['rating.average'] = { $gte: parseFloat(minRating) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tutors = await User.find(query)
      .select('name email bio avatar skillsToTeach rating credibilityScore isAvailable')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ 'rating.average': -1, credibilityScore: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      tutors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Request a learning session with a tutor
// @route   POST /api/learner/sessions
// @access  Private
const requestSession = async (req, res, next) => {
  try {
    const { tutorId, skill, topic, scheduledAt, durationMinutes = 60, learnerNotes } = req.body;

    if (!tutorId || !skill || !scheduledAt) {
      return res.status(400).json({
        success: false,
        message: 'Tutor ID, skill, and scheduled time are required',
      });
    }

    if (tutorId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot book a session with yourself',
      });
    }

    const tutor = await User.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: 'Tutor not found',
      });
    }

    // Check tutor offers this skill
    const offeredSkill = tutor.skillsToTeach.find(
      (s) => s.skill.toLowerCase() === skill.trim().toLowerCase()
    );

    if (!offeredSkill) {
      return res.status(400).json({
        success: false,
        message: `Tutor does not offer skill '${skill}'`,
      });
    }

    // Hourly credits required
    const hourlyCredits = offeredSkill.hourlyCredits || 10;
    const creditsRequired = Math.round((hourlyCredits * durationMinutes) / 60);

    const learner = await User.findById(req.user._id);
    if (learner.credits < creditsRequired) {
      return res.status(400).json({
        success: false,
        message: `Insufficient credits. You need ${creditsRequired} credits, but you have ${learner.credits}.`,
      });
    }

    const scheduledDate = new Date(scheduledAt);
    if (isNaN(scheduledDate.getTime()) || scheduledDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Scheduled time must be a valid future date and time',
      });
    }

    const session = await Session.create({
      learner: req.user._id,
      tutor: tutor._id,
      skill: skill.trim().toLowerCase(),
      topic: topic || `Learning ${skill}`,
      scheduledAt: scheduledDate,
      durationMinutes,
      creditsExchanged: creditsRequired,
      learnerNotes: learnerNotes || '',
      status: 'requested',
    });

    const populatedSession = await Session.findById(session._id)
      .populate('tutor', 'name email avatar rating credibilityScore')
      .populate('learner', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Session requested successfully',
      session: populatedSession,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all sessions for the learner
// @route   GET /api/learner/sessions
// @access  Private
const getLearnerSessions = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { learner: req.user._id };

    if (status) {
      query.status = status;
    }

    const sessions = await Session.find(query)
      .populate('tutor', 'name email avatar rating credibilityScore')
      .sort({ scheduledAt: -1 });

    res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSkillsToLearn,
  addSkillToLearn,
  removeSkillToLearn,
  searchTutors,
  requestSession,
  getLearnerSessions,
};
