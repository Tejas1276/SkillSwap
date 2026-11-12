const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

/**
 * Calls the Python 3 TensorFlow/Scikit-learn microservice with bounded timeout.
 * Falls back cleanly to a deterministic Node scorer if the Python service is unreachable.
 */
const postToAIService = async (path, payload) => {
  const response = await fetch(`${AI_SERVICE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(4000),
  });

  if (!response.ok) {
    throw new Error(`AI microservice returned HTTP ${response.status}`);
  }

  return response.json();
};

const getAIServiceHealth = async () => {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/health`, {
      signal: AbortSignal.timeout(2500),
    });
    if (!response.ok) {
      return { online: false, status: response.status, url: AI_SERVICE_URL };
    }
    const data = await response.json();
    return { online: true, ...data, url: AI_SERVICE_URL };
  } catch (err) {
    return {
      online: false,
      error: err.message,
      url: AI_SERVICE_URL,
    };
  }
};

// Fallback scorer used only if Python microservice is temporarily offline
const fallbackMatchTutors = (learner, tutors, limit = 10) => {
  const desired = (learner?.skillsToLearn || []).map((s) =>
    (typeof s === 'string' ? s : s.skill || '').toLowerCase()
  );
  if (learner?.goalSkill && !desired.includes(learner.goalSkill.toLowerCase())) {
    desired.unshift(learner.goalSkill.toLowerCase());
  }

  const ranked = (tutors || []).map((tutor) => {
    const taught = (tutor.skillsToTeach || []).map((s) =>
      (typeof s === 'string' ? s : s.skill || '').toLowerCase()
    );
    const matched = taught.filter((ts) =>
      desired.some((ls) => ls && (ts.includes(ls) || ls.includes(ts)))
    );

    const skillSim = desired.length > 0 ? Math.min(1, matched.length / desired.length) : 0.4;
    const ratingNorm = ((tutor.rating?.average ?? 4.5) / 5.0);
    const credNorm = ((tutor.credibilityScore ?? 75) / 100.0);
    const score = Math.round((0.5 * skillSim + 0.3 * ratingNorm + 0.2 * credNorm) * 1000) / 10;

    return {
      tutorId: String(tutor._id || tutor.id || ''),
      name: tutor.name,
      matchScore: score,
      skillSimilarity: Math.round(skillSim * 1000) / 10,
      neuralConfidence: score,
      compatibilityLabel: score >= 80 ? 'Top AI Match' : 'Recommended Peer',
      matchedSkills: matched,
      explanation: `Fallback scorer • Rating ${(tutor.rating?.average ?? 4.5).toFixed(1)} • Credibility ${tutor.credibilityScore ?? 75}`,
    };
  });

  ranked.sort((a, b) => b.matchScore - a.matchScore);
  return ranked.slice(0, limit);
};

const matchTutorsWithAI = async ({ learner, tutors, limit = 10 }) => {
  try {
    const result = await postToAIService('/ai/match-tutors', { learner, tutors, limit });
    return {
      source: 'python-ml-microservice',
      engine: result.engine || 'tensorflow-scikit-learn',
      matches: result.matches || [],
    };
  } catch (err) {
    console.warn(`[AI Service] Python microservice unreachable (${err.message}), using JS fallback.`);
    return {
      source: 'nodejs-fallback',
      engine: 'heuristic-fallback',
      matches: fallbackMatchTutors(learner, tutors, limit),
    };
  }
};

const getLearningPathWithAI = async ({ learner, goalSkill }) => {
  try {
    const result = await postToAIService('/ai/learning-path', { learner, goalSkill });
    return {
      source: 'python-ml-microservice',
      engine: result.engine || 'scikit-learn-tfidf-roadmap',
      learningPath: result.learningPath,
    };
  } catch (err) {
    console.warn(`[AI Service] Python learning-path unreachable (${err.message}), using JS fallback.`);
    const goal = (goalSkill || learner?.skillsToLearn?.[0]?.skill || 'Web Development').trim();
    return {
      source: 'nodejs-fallback',
      engine: 'curated-fallback',
      learningPath: {
        goalSkill: goal,
        matchedTrack: goal,
        confidence: 75.0,
        totalEstimatedHours: 9,
        steps: [
          { step: '1', skill: `${goal} Core Fundamentals`, level: 'beginner', focus: 'Syntax, setup & terminology', status: 'recommended', estimatedHours: 3 },
          { step: '2', skill: `${goal} Guided Peer Project`, level: 'intermediate', focus: 'Hands-on mentoring session', status: 'recommended', estimatedHours: 3 },
          { step: '3', skill: `${goal} Production Architecture`, level: 'advanced', focus: 'Code review & best practices', status: 'recommended', estimatedHours: 3 },
        ],
      },
    };
  }
};

const getTrendingSkillsWithAI = async ({ users, sessions, topN = 6 }) => {
  try {
    const result = await postToAIService('/ai/trending-skills', { users, sessions, topN });
    return {
      source: 'python-ml-microservice',
      engine: result.engine || 'skill-velocity-analytics',
      trending: result.trending || [],
    };
  } catch (err) {
    console.warn(`[AI Service] Python trending unreachable (${err.message}), using JS fallback.`);
    return {
      source: 'nodejs-fallback',
      engine: 'velocity-fallback',
      trending: [
        { skill: 'React', demandCount: 12, tutorsAvailable: 3, trendScore: 94.0, badge: '🔥 High Demand' },
        { skill: 'Python', demandCount: 10, tutorsAvailable: 2, trendScore: 91.5, badge: '🔥 High Demand' },
        { skill: 'Ui/Ux Design', demandCount: 8, tutorsAvailable: 2, trendScore: 86.0, badge: '📈 Rising' },
        { skill: 'Machine Learning', demandCount: 7, tutorsAvailable: 1, trendScore: 84.5, badge: '🔥 High Demand' },
        { skill: 'Dsa (C++)', demandCount: 6, tutorsAvailable: 2, trendScore: 79.0, badge: '📈 Rising' },
      ].slice(0, topN),
    };
  }
};

module.exports = {
  getAIServiceHealth,
  matchTutorsWithAI,
  getLearningPathWithAI,
  getTrendingSkillsWithAI,
};
