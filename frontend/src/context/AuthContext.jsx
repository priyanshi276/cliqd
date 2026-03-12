// src/context/AuthContext.jsx  (updated — uses Node.js backend)
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, tokenUtils } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from stored token on mount
  useEffect(() => {
    const token = tokenUtils.get();
    if (token) {
      authAPI.getMe()
        .then(({ user }) => setUser(user))
        .catch(() => tokenUtils.clear()) // token expired / invalid
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const register = async (payload) => {
    const { token, user } = await authAPI.register(payload);
    tokenUtils.save(token);
    setUser(user);
    return user;
  };

  const login = async (payload) => {
    const { token, user } = await authAPI.login(payload);
    tokenUtils.save(token);
    setUser(user);
    return user;
  };

  const logout = () => {
    tokenUtils.clear();
    setUser(null);
  };

  const updateProfile = async (updates) => {
    const { user: updated } = await authAPI.updateProfile(updates);
    setUser(updated);
    return updated;
  };

  const refreshUser = async () => {
    const { user: fresh } = await authAPI.getMe();
    setUser(fresh);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
