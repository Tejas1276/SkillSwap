import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

const OAUTH_ERROR_MESSAGES = {
  google_not_configured:
    'Google OAuth is not configured yet. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in backend/.env.',
  github_not_configured:
    'GitHub OAuth is not configured yet. Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in backend/.env.',
  google_auth_failed: 'Google sign-in was cancelled or failed verification.',
  github_auth_failed: 'GitHub sign-in was cancelled or failed verification.',
  google_token_failed: 'Could not exchange Google authorization code for a token.',
  github_token_failed: 'Could not exchange GitHub authorization code for a token.',
  google_profile_failed: 'Unable to read your verified email address from Google.',
  github_email_unavailable:
    'Unable to read a verified email address from your GitHub account.',
  google_server_error: 'Server error while completing Google OAuth.',
  github_server_error: 'Server error while completing GitHub OAuth.',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('skillswap_token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [oauthRedirectTarget, setOauthRedirectTarget] = useState(null);

  const refreshUser = async () => {
    try {
      const data = await api.auth.getMe();
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.warn('Failed to refresh user:', err.message);
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const oauthToken = params.get('oauth_token');
      const authError = params.get('auth_error');

      if (oauthToken) {
        localStorage.setItem('skillswap_token', oauthToken);
        setToken(oauthToken);
        window.history.replaceState({}, document.title, window.location.pathname);
        setOauthRedirectTarget('dashboard');
      } else if (authError) {
        setError(OAUTH_ERROR_MESSAGES[authError] || 'OAuth authentication failed.');
        window.history.replaceState({}, document.title, window.location.pathname);
        setOauthRedirectTarget('login');
      }

      const activeToken = oauthToken || localStorage.getItem('skillswap_token');
      if (activeToken) {
        try {
          const data = await api.auth.getMe();
          setUser(data.user);
        } catch {
          console.warn('Token expired or invalid, logging out.');
          localStorage.removeItem('skillswap_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (identifier, password) => {
    setError(null);
    try {
      const data = await api.auth.login({ email: identifier, identifier, password });
      localStorage.setItem('skillswap_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const sendOtp = async ({ name, username, email, password, bio = '' }) => {
    setError(null);
    try {
      return await api.auth.sendOtp({ name, username, email, password, bio });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const verifyOtp = async (email, otp) => {
    setError(null);
    try {
      const data = await api.auth.verifyOtp({ email, otp });
      localStorage.setItem('skillswap_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (name, email, password, bio = '', username) => {
    setError(null);
    try {
      const payload = { name, email, password, bio };
      if (username) payload.username = username;
      const data = await api.auth.register(payload);
      localStorage.setItem('skillswap_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('skillswap_token');
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
        oauthRedirectTarget,
        clearOauthRedirect: () => setOauthRedirectTarget(null),
        login,
        sendOtp,
        verifyOtp,
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
