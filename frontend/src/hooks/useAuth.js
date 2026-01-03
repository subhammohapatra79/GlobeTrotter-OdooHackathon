/**
 * useAuth hook
 * Manages authentication state
 */

import { useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token]);

  /**
   * Verify token and get user info
   */
  const verifyToken = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getCurrentUser();
      setUser(response.data?.user);
    } catch (err) {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign up
   */
  const signup = useCallback(async (email, password, firstName, lastName) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.signup(email, password, firstName, lastName);
      const { token: newToken, user: newUser } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      return { success: true };
    } catch (err) {
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
      const { token: newToken, user: newUser } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      return { success: true };
    } catch (err) {
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
  }, []);

  const isAuthenticated = !!token && !!user;

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    signup,
    login,
    logout
  };
};

export default useAuth;