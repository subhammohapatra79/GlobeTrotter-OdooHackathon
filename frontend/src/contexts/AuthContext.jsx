import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(!!localStorage.getItem('token'));
  const [error, setError] = useState(null);
  const hasVerified = useRef(false);

  /**
   * Verify token and get user info (only on initial load)
   */
  const verifyToken = useCallback(async (tokenValue) => {
    if (hasVerified.current || !tokenValue) {
      console.log('Skipping verify - hasVerified:', hasVerified.current, 'tokenValue:', !!tokenValue);
      setAuthLoading(false);
      return;
    }

    try {
      console.log('=== VERIFY TOKEN START ===');
      hasVerified.current = true;
      const response = await authAPI.getCurrentUser();
      console.log('getCurrentUser response:', response);
      const userData = response.data?.user || response.user;
      console.log('Extracted userData:', userData);
      setUser(userData);
      console.log('=== VERIFY TOKEN END - User set ===');
    } catch (err) {
      console.error('Token verification failed:', err);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      hasVerified.current = false;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // Verify token only on initial app load if token exists
  useEffect(() => {
    if (token && !hasVerified.current) {
      console.log('Initial load: Token exists, verifying...');
      verifyToken(token);
    } else {
      setAuthLoading(false);
    }
  }, []); // Empty dependency array - run only once on mount

  /**
   * Sign up
   */
  const signup = useCallback(async (email, password, firstName, lastName, phone, city, country) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.signup(email, password, firstName, lastName, phone, city, country);
      console.log('Signup response:', response);

      const tokenData = response.data || response;
      const { token: newToken, user: newUser, profile } = tokenData;

      console.log('Signup token:', newToken, 'User:', newUser);

      if (!newToken || !newUser) {
        throw new Error('Invalid response: missing token or user data');
      }

      console.log('Before setToken - token:', newToken);
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser({ ...newUser, profile });
      hasVerified.current = true;
      setAuthLoading(false);
      console.log('After setUser state');

      return { success: true };
    } catch (err) {
      console.error('Signup error:', err);
      setError(err?.message || 'Signup failed');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Log in
   */
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.login(email, password);
      console.log('Login response:', response);

      const tokenData = response.data || response;
      const { token: newToken, user: newUser, profile } = tokenData;

      console.log('Token:', newToken, 'User:', newUser);

      if (!newToken || !newUser) {
        throw new Error('Invalid response: missing token or user data');
      }

      console.log('Before setToken - token:', newToken);
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser({ ...newUser, profile });
      hasVerified.current = true;
      setAuthLoading(false);
      console.log('After setUser state');

      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      setError(err?.message || 'Login failed');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Log out
   */
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError(null);
    setAuthLoading(false);
    hasVerified.current = false;
  }, []);

  const isAuthenticated = !!token && !!user;

  const value = {
    user,
    token,
    loading,
    authLoading,
    error,
    isAuthenticated,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
