import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('cliqd_session');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setLoading(false);
  }, []);

  const getUsers = () => {
    try { return JSON.parse(localStorage.getItem('cliqd_users') || '{}'); } catch { return {}; }
  };
  const saveUsers = (users) => localStorage.setItem('cliqd_users', JSON.stringify(users));

  const register = async ({ name, email, password, username }) => {
    const users = getUsers();
    if (Object.values(users).find(u => u.email === email)) {
      throw new Error('Email already registered');
    }
    if (Object.values(users).find(u => u.username === username)) {
      throw new Error('Username already taken');
    }
    const id = uuidv4();
    const newUser = {
      id, name, email, password, username,
      avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=${username}`,
      bio: '',
      followers: [],
      following: [],
      createdAt: Date.now()
    };
    users[id] = newUser;
    saveUsers(users);
    const session = { id, name, email, username, avatar: newUser.avatar, bio: newUser.bio, coverPhoto: '' };
    setUser(session);
    localStorage.setItem('cliqd_session', JSON.stringify(session));
    return session;
  };

  const login = async ({ email, password }) => {
    const users = getUsers();
    const found = Object.values(users).find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid email or password');
    const session = { id: found.id, name: found.name, email: found.email, username: found.username, avatar: found.avatar, bio: found.bio, coverPhoto: found.coverPhoto || '' };
    setUser(session);
    localStorage.setItem('cliqd_session', JSON.stringify(session));
    return session;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cliqd_session');
  };

  const updateProfile = (updates) => {
    const users = getUsers();
    if (users[user.id]) {
      users[user.id] = { ...users[user.id], ...updates };
      saveUsers(users);
    }
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('cliqd_session', JSON.stringify(updated));
  };

  const refreshUser = () => {
    const users = getUsers();
    if (user && users[user.id]) {
      const u = users[user.id];
      const session = { id: u.id, name: u.name, email: u.email, username: u.username, avatar: u.avatar, bio: u.bio };
      setUser(session);
      localStorage.setItem('cliqd_session', JSON.stringify(session));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, refreshUser, getUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
