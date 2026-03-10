import React, { createContext, useContext, useState, useCallback } from 'react';

const SocialContext = createContext(null);

export function SocialProvider({ children }) {
  const [tick, setTick] = useState(0);
  const bump = () => setTick(t => t + 1);

  const getUsers = () => {
    try { return JSON.parse(localStorage.getItem('cliqd_users') || '{}'); } catch { return {}; }
  };
  const saveUsers = (u) => {
    localStorage.setItem('cliqd_users', JSON.stringify(u));
    bump();
  };

  const follow = (currentUserId, targetUserId) => {
    const users = getUsers();
    if (!users[currentUserId] || !users[targetUserId]) return false;
    if (!Array.isArray(users[currentUserId].following)) users[currentUserId].following = [];
    if (!Array.isArray(users[targetUserId].followers)) users[targetUserId].followers = [];
    if (!users[currentUserId].following.includes(targetUserId)) {
      users[currentUserId].following = [...users[currentUserId].following, targetUserId];
      users[targetUserId].followers = [...users[targetUserId].followers, currentUserId];
      saveUsers(users);
      return true;
    }
    return false;
  };

  const unfollow = (currentUserId, targetUserId) => {
    const users = getUsers();
    if (!users[currentUserId] || !users[targetUserId]) return false;
    users[currentUserId].following = (users[currentUserId].following || []).filter(id => id !== targetUserId);
    users[targetUserId].followers = (users[targetUserId].followers || []).filter(id => id !== currentUserId);
    saveUsers(users);
    return true;
  };

  const isFollowing = (currentUserId, targetUserId) => {
    const users = getUsers();
    return (users[currentUserId]?.following || []).includes(targetUserId);
  };

  const getFollowerCount = (userId) => {
    const users = getUsers();
    return (users[userId]?.followers || []).length;
  };

  const getFollowingCount = (userId) => {
    const users = getUsers();
    return (users[userId]?.following || []).length;
  };

  const getFollowers = (userId) => {
    const users = getUsers();
    return (users[userId]?.followers || []).map(id => users[id]).filter(Boolean);
  };

  const getFollowing = (userId) => {
    const users = getUsers();
    return (users[userId]?.following || []).map(id => users[id]).filter(Boolean);
  };

  const getUserByUsername = (username) => {
    const users = getUsers();
    return Object.values(users).find(u => u.username === username) || null;
  };

  const getUserById = (id) => {
    const users = getUsers();
    return users[id] || null;
  };

  return (
    <SocialContext.Provider value={{
      tick, follow, unfollow, isFollowing,
      getFollowerCount, getFollowingCount,
      getFollowers, getFollowing,
      getUserByUsername, getUserById
    }}>
      {children}
    </SocialContext.Provider>
  );
}

export const useSocial = () => useContext(SocialContext);
