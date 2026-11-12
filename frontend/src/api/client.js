// Skill Swap API Client
const API_BASE = '/api';

const getAuthToken = () => localStorage.getItem('skillswap_token');

const request = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const api = {
  // Auth API
  auth: {
    register: (userData) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    login: (credentials) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    getMe: () => request('/auth/me'),
    updateProfile: (profileData) =>
      request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      }),
  },

  // Learner Module API
  learner: {
    getSkillsToLearn: () => request('/learner/skills'),
    addSkillToLearn: (skillData) =>
      request('/learner/skills', {
        method: 'POST',
        body: JSON.stringify(skillData),
      }),
    removeSkillToLearn: (skillName) =>
      request(`/learner/skills/${encodeURIComponent(skillName)}`, {
        method: 'DELETE',
      }),
    searchTutors: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/learner/tutors${query ? `?${query}` : ''}`);
    },
    requestSession: (sessionData) =>
      request('/learner/sessions', {
        method: 'POST',
        body: JSON.stringify(sessionData),
      }),
    getLearnerSessions: (status) =>
      request(`/learner/sessions${status ? `?status=${status}` : ''}`),
  },

  // Tutor Module API
  tutor: {
    getSkillsToTeach: () => request('/tutor/skills'),
    addSkillToTeach: (skillData) =>
      request('/tutor/skills', {
        method: 'POST',
        body: JSON.stringify(skillData),
      }),
    removeSkillToTeach: (skillName) =>
      request(`/tutor/skills/${encodeURIComponent(skillName)}`, {
        method: 'DELETE',
      }),
    getSessionRequests: () => request('/tutor/sessions/requests'),
    respondToSessionRequest: (sessionId, action, tutorNotes = '') =>
      request(`/tutor/sessions/${sessionId}/respond`, {
        method: 'PATCH',
        body: JSON.stringify({ action, tutorNotes }),
      }),
    getTutorSessions: (status) =>
      request(`/tutor/sessions${status ? `?status=${status}` : ''}`),
    updateAvailability: (isAvailable) =>
      request('/tutor/availability', {
        method: 'PUT',
        body: JSON.stringify({ isAvailable }),
      }),
  },

  // Sessions API
  sessions: {
    getById: (sessionId) => request(`/sessions/${sessionId}`),
    complete: (sessionId) =>
      request(`/sessions/${sessionId}/complete`, { method: 'POST' }),
    cancel: (sessionId) =>
      request(`/sessions/${sessionId}/cancel`, { method: 'POST' }),
  },

  // Feedback API
  feedback: {
    submit: (feedbackData) =>
      request('/feedback', {
        method: 'POST',
        body: JSON.stringify(feedbackData),
      }),
    getUserFeedback: (userId) => request(`/feedback/user/${userId}`),
  },

  // Gamification API
  gamification: {
    getHistory: () => request('/gamification/history'),
    getLeaderboard: () => request('/gamification/leaderboard'),
  },

  // Phase 4: AI Skill Matching & Recommendation Engine API
  ai: {
    getHealth: () => request('/ai/health'),
    getRecommendations: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/ai/recommendations${query ? `?${query}` : ''}`);
    },
    getLearningPath: (goalSkill) =>
      request('/ai/learning-path', {
        method: 'POST',
        body: JSON.stringify({ goalSkill }),
      }),
    getTrendingSkills: (limit = 6) => request(`/ai/trending?limit=${limit}`),
  },
};
