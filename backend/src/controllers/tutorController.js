const User = require('../models/User');
const Session = require('../models/Session');
const Gamification = require('../models/Gamification');

// @desc    Get user's offered teaching skills
// @route   GET /api/tutor/skills
// @access  Private
const getSkillsToTeach = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('skillsToTeach isAvailable');
    res.status(200).json({
      success: true,
      skills: user.skillsToTeach || [],
      isAvailable: user.isAvailable,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Offer a skill to teach
// @route   POST /api/tutor/skills
// @access  Private
const addSkillToTeach = async (req, res, next) => {
  try {
    const { skill, proficiency, hourlyCredits, description } = req.body;

    if (!skill || typeof skill !== 'string' || !skill.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid skill name',
      });
    }

    const normalizedSkill = skill.trim().toLowerCase();
    const user = await User.findById(req.user._id);

    // Check if skill already exists in teaching list
    const existingIndex = user.skillsToTeach.findIndex(
      (s) => s.skill.toLowerCase() === normalizedSkill
    );

    if (existingIndex > -1) {
      if (proficiency) user.skillsToTeach[existingIndex].proficiency = proficiency;
      if (hourlyCredits !== undefined) user.skillsToTeach[existingIndex].hourlyCredits = Number(hourlyCredits);
      if (description !== undefined) user.skillsToTeach[existingIndex].description = description;

      await user.save();

      return res.status(200).json({
        success: true,
        message: `Updated teaching profile for '${normalizedSkill}'`,
        skills: user.skillsToTeach,
      });
    }

    // Add new skill offering
    user.skillsToTeach.push({
      skill: normalizedSkill,
      proficiency: proficiency || 'intermediate',
      hourlyCredits: hourlyCredits !== undefined ? Number(hourlyCredits) : 10,
      description: description || '',
    });

    // Check for "First Teaching Skill" badge
    const hasTutorBadge = user.badges.some((b) => b.name === 'Knowledge Sharer');
    if (!hasTutorBadge) {
      user.badges.push({
        name: 'Knowledge Sharer',
        description: 'Offered first skill to teach the community',
        icon: 'book-open',
      });
      await Gamification.create({
        user: user._id,
        type: 'badge_unlocked',
        badgeName: 'Knowledge Sharer',
        description: `Unlocked 'Knowledge Sharer' badge by offering to teach ${normalizedSkill}`,
      });
    }

    await user.save();

    res.status(201).json({
      success: true,
      message: `Skill '${normalizedSkill}' offered successfully`,
      skills: user.skillsToTeach,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove an offered skill
// @route   DELETE /api/tutor/skills/:skillName
// @access  Private
const removeSkillToTeach = async (req, res, next) => {
  try {
    const { skillName } = req.params;
    const normalizedSkill = decodeURIComponent(skillName).trim().toLowerCase();

    const user = await User.findById(req.user._id);
    const initialLength = user.skillsToTeach.length;

    user.skillsToTeach = user.skillsToTeach.filter(
      (s) => s.skill.toLowerCase() !== normalizedSkill
    );

    if (user.skillsToTeach.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: `Skill '${normalizedSkill}' was not found in your teaching list`,
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: `Skill '${normalizedSkill}' removed from teaching list`,
      skills: user.skillsToTeach,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get session requests awaiting tutor approval
// @route   GET /api/tutor/sessions/requests
// @access  Private
const getSessionRequests = async (req, res, next) => {
  try {
    const requests = await Session.find({
      tutor: req.user._id,
      status: 'requested',
    })
      .populate('learner', 'name email avatar credits credibilityScore')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept or reject a session request
// @route   PATCH /api/tutor/sessions/:sessionId/respond
// @access  Private
const respondToSessionRequest = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { action, tutorNotes } = req.body;

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Action must be either 'accept' or 'reject'",
      });
    }

    const session = await Session.findOne({
      _id: sessionId,
      tutor: req.user._id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session request not found',
      });
    }

    if (session.status !== 'requested') {
      return res.status(400).json({
        success: false,
        message: `Cannot respond to a session that is already '${session.status}'`,
      });
    }

    session.status = action === 'accept' ? 'accepted' : 'rejected';
    if (tutorNotes) {
      session.tutorNotes = tutorNotes;
    }

    await session.save();

    const populatedSession = await Session.findById(session._id)
      .populate('learner', 'name email avatar')
      .populate('tutor', 'name email avatar');

    res.status(200).json({
      success: true,
      message: `Session request ${session.status} successfully`,
      session: populatedSession,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all sessions where user is tutor
// @route   GET /api/tutor/sessions
// @access  Private
const getTutorSessions = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { tutor: req.user._id };

    if (status) {
      query.status = status;
    }

    const sessions = await Session.find(query)
      .populate('learner', 'name email avatar rating credibilityScore')
      .sort({ scheduledAt: -1 });

    res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle or update tutor availability
// @route   PUT /api/tutor/availability
// @access  Private
const updateAvailability = async (req, res, next) => {
  try {
    const { isAvailable } = req.body;

    if (typeof isAvailable !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: "'isAvailable' must be a boolean",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { isAvailable },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `Tutor status set to ${isAvailable ? 'available' : 'unavailable'}`,
      isAvailable: user.isAvailable,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSkillsToTeach,
  addSkillToTeach,
  removeSkillToTeach,
  getSessionRequests,
  respondToSessionRequest,
  getTutorSessions,
  updateAvailability,
};
