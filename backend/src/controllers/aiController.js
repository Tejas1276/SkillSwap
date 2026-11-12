const User = require('../models/User');
const Session = require('../models/Session');
const {
  getAIServiceHealth,
  matchTutorsWithAI,
  getLearningPathWithAI,
  getTrendingSkillsWithAI,
} = require('../services/aiService');

// @desc    Check Python AI Microservice health & version info
// @route   GET /api/ai/health
// @access  Public
const getAIHealth = async (req, res, next) => {
  try {
    const health = await getAIServiceHealth();
    res.status(200).json({
      success: true,
      microservice: health,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI-matched tutor recommendations for logged-in learner
// @route   GET /api/ai/recommendations
// @access  Private
const getAIRecommendations = async (req, res, next) => {
  try {
    const { skill, limit = 8 } = req.query;

    const currentUser = await User.findById(req.user._id).select(
      'name bio skillsToLearn skillsToTeach'
    );

    const candidateTutors = await User.find({
      _id: { $ne: req.user._id },
      isAvailable: true,
      'skillsToTeach.0': { $exists: true },
    })
      .select('name email bio avatar skillsToTeach rating credibilityScore isAvailable')
      .lean();

    const learnerPayload = {
      name: currentUser?.name || 'Student',
      bio: currentUser?.bio || '',
      skillsToLearn: currentUser?.skillsToLearn || [],
      skillsToTeach: currentUser?.skillsToTeach || [],
      ...(skill ? { goalSkill: skill.trim() } : {}),
    };

    const aiResponse = await matchTutorsWithAI({
      learner: learnerPayload,
      tutors: candidateTutors,
      limit: parseInt(limit, 10) || 8,
    });

    // Attach full tutor details to each ranked AI match
    const tutorMap = new Map(candidateTutors.map((t) => [String(t._id), t]));
    const recommendations = aiResponse.matches.map((m) => ({
      ...m,
      tutor: tutorMap.get(m.tutorId) || null,
    }));

    res.status(200).json({
      success: true,
      source: aiResponse.source,
      engine: aiResponse.engine,
      recommendations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate personalized AI learning path for a goal skill
// @route   POST /api/ai/learning-path
// @access  Private
const getLearningPath = async (req, res, next) => {
  try {
    const { goalSkill } = req.body;
    const currentUser = await User.findById(req.user._id)
      .select('name skillsToLearn skillsToTeach')
      .lean();

    const aiResponse = await getLearningPathWithAI({
      learner: currentUser || { skillsToLearn: [], skillsToTeach: [] },
      goalSkill,
    });

    res.status(200).json({
      success: true,
      source: aiResponse.source,
      engine: aiResponse.engine,
      learningPath: aiResponse.learningPath,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Analyze and return trending campus skills
// @route   GET /api/ai/trending
// @access  Public
const getTrendingSkills = async (req, res, next) => {
  try {
    const topN = parseInt(req.query.limit, 10) || 6;
    const [users, sessions] = await Promise.all([
      User.find().select('skillsToLearn skillsToTeach').lean(),
      Session.find().select('skill status').lean(),
    ]);

    const aiResponse = await getTrendingSkillsWithAI({
      users,
      sessions,
      topN,
    });

    res.status(200).json({
      success: true,
      source: aiResponse.source,
      engine: aiResponse.engine,
      trending: aiResponse.trending,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAIHealth,
  getAIRecommendations,
  getLearningPath,
  getTrendingSkills,
};
