import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

const DEMO_FALLBACK_USERS = {
  'tejas@skillswap.io': {
    _id: 'demo-tejas',
    name: 'Tejas Kushwaha',
    email: 'tejas@skillswap.io',
    bio: 'Computer Science Undergraduate & Fullstack Learner at Delhi Technological University',
    avatar: '/avatars/default.svg',
    credits: 150,
    credibilityScore: 88,
    rating: { average: 4.8, count: 12 },
    skillsToLearn: [
      { skill: 'react', targetProficiency: 'intermediate', notes: 'Mastering React state and hooks' },
      { skill: 'ui/ux design', targetProficiency: 'beginner', notes: 'Learning Figma prototyping' },
    ],
    skillsToTeach: [
      { skill: 'python', proficiency: 'intermediate', hourlyCredits: 10, description: 'Python scripting and backend data algorithms', verified: true },
    ],
    badges: [
      { name: 'Pioneer', description: 'Joined Skill Swap', icon: 'compass' },
      { name: 'Active Learner', description: 'Participated in learning sessions', icon: 'zap' },
    ],
    role: 'user',
  },
  'rohan@skillswap.io': {
    _id: 'demo-rohan',
    name: 'Rohan Sharma',
    email: 'rohan@skillswap.io',
    bio: 'Senior Peer Tutor & React Specialist at IIT Delhi',
    avatar: '/avatars/marcus.svg',
    credits: 240,
    credibilityScore: 95,
    rating: { average: 4.9, count: 24 },
    skillsToTeach: [
      { skill: 'react', proficiency: 'expert', hourlyCredits: 15, description: 'Modern React 19, hooks, and clean state machines', verified: true },
      { skill: 'nodejs', proficiency: 'advanced', hourlyCredits: 15, description: 'Scalable REST APIs and real-time WebSockets', verified: true },
    ],
    skillsToLearn: [
      { skill: 'machine learning', targetProficiency: 'intermediate', notes: 'Integrating AI models' },
    ],
    badges: [
      { name: 'Pioneer', description: 'Joined Skill Swap', icon: 'compass' },
      { name: 'Top Rated Tutor', description: 'Maintained 4.9 rating across 20+ sessions', icon: 'star' },
      { name: 'Knowledge Sharer', description: 'Taught over 50 hours of sessions', icon: 'book-open' },
    ],
    role: 'user',
  },
  'priya@skillswap.io': {
    _id: 'demo-priya',
    name: 'Priya Singh',
    email: 'priya@skillswap.io',
    bio: 'UI/UX Designer & Design Systems Mentor at NID',
    avatar: '/avatars/elena.svg',
    credits: 180,
    credibilityScore: 92,
    rating: { average: 4.8, count: 19 },
    skillsToTeach: [
      { skill: 'ui/ux design', proficiency: 'expert', hourlyCredits: 20, description: 'Figma UI design, tokens, wireframing, and user testing', verified: true },
    ],
    skillsToLearn: [
      { skill: 'react', targetProficiency: 'beginner', notes: 'Learning to build frontend components' },
    ],
    badges: [
      { name: 'Pioneer', description: 'Joined Skill Swap', icon: 'compass' },
      { name: 'Creative Mentor', description: 'Helped 15+ students with design portfolios', icon: 'award' },
    ],
    role: 'user',
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem('skillswap_user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('skillswap_token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshUser = async () => {
    try {
      const data = await api.auth.getMe();
      setUser(data.user);
      localStorage.setItem('skillswap_user', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      console.warn('Failed to refresh user:', err.message);
      return user;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('skillswap_token');
      if (savedToken) {
        try {
          const data = await api.auth.getMe();
          setUser(data.user);
          localStorage.setItem('skillswap_user', JSON.stringify(data.user));
        } catch {
          // If we have cached user for offline/static deployment, keep it
          const cached = localStorage.getItem('skillswap_user');
          if (cached) {
            try {
              setUser(JSON.parse(cached));
            } catch {
              localStorage.removeItem('skillswap_token');
              localStorage.removeItem('skillswap_user');
              setToken(null);
              setUser(null);
            }
          } else {
            localStorage.removeItem('skillswap_token');
            setToken(null);
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await api.auth.login({ email, password });
      localStorage.setItem('skillswap_token', data.token);
      localStorage.setItem('skillswap_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      // Fallback for static hosting without live backend
      const lower = email?.toLowerCase();
      if (DEMO_FALLBACK_USERS[lower] || err.message?.includes('fetch') || err.message?.includes('Network')) {
        const fallback = DEMO_FALLBACK_USERS[lower] || {
          _id: `user-${Date.now()}`,
          name: email.split('@')[0],
          email,
          bio: 'Skill Swap Member',
          avatar: '/avatars/default.svg',
          credits: 100,
          credibilityScore: 75,
          rating: { average: 5.0, count: 1 },
          skillsToLearn: [{ skill: 'react', targetProficiency: 'intermediate' }],
          skillsToTeach: [{ skill: 'javascript', proficiency: 'intermediate', hourlyCredits: 10 }],
          badges: [{ name: 'Pioneer', description: 'Joined Skill Swap', icon: 'compass' }],
          role: 'user',
        };
        const demoToken = `mock-token-${Date.now()}`;
        localStorage.setItem('skillswap_token', demoToken);
        localStorage.setItem('skillswap_user', JSON.stringify(fallback));
        setToken(demoToken);
        setUser(fallback);
        return fallback;
      }
      setError(err.message);
      throw err;
    }
  };

  const register = async (name, email, password, bio = '') => {
    setError(null);
    try {
      const data = await api.auth.register({ name, email, password, bio });
      localStorage.setItem('skillswap_token', data.token);
      localStorage.setItem('skillswap_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      if (err.message?.includes('fetch') || err.message?.includes('Network')) {
        const fallback = {
          _id: `user-${Date.now()}`,
          name: name || email.split('@')[0],
          email,
          bio: bio || 'Skill Swap Member',
          avatar: '/avatars/default.svg',
          credits: 100,
          credibilityScore: 70,
          rating: { average: 5.0, count: 0 },
          skillsToLearn: [],
          skillsToTeach: [],
          badges: [{ name: 'Pioneer', description: 'Joined Skill Swap', icon: 'compass' }],
          role: 'user',
        };
        const demoToken = `mock-token-${Date.now()}`;
        localStorage.setItem('skillswap_token', demoToken);
        localStorage.setItem('skillswap_user', JSON.stringify(fallback));
        setToken(demoToken);
        setUser(fallback);
        return fallback;
      }
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('skillswap_token');
    localStorage.removeItem('skillswap_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
