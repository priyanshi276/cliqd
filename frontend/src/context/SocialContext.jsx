// src/context/SocialContext.jsx  (updated — uses Node.js backend)
import React, { createContext, useContext, useState } from 'react';
import { socialAPI } from '../services/api';

const SocialContext = createContext(null);

export function SocialProvider({ children }) {
  // tick forces re-renders after follow/unfollow (same API as before)
  const [tick, setTick] = useState(0);
  const bump = () => setTick(t => t + 1);

  const follow = async (currentUserId, targetUserId) => {
    await socialAPI.follow(targetUserId);
    bump();
    return true;
  };

  const unfollow = async (currentUserId, targetUserId) => {
    await socialAPI.unfollow(targetUserId);
    bump();
    return true;
  };

  // Sync check — cached from last server response stored locally
  const isFollowing = (currentUserId, targetUserId) => {
    try {
      const users = JSON.parse(localStorage.getItem('cliqd_social_cache') || '{}');
      return (users[currentUserId]?.following || []).includes(targetUserId);
    } catch { return false; }
  };

  const getFollowerCount = (userId) => {
    try {
      const users = JSON.parse(localStorage.getItem('cliqd_social_cache') || '{}');
      return (users[userId]?.followers || []).length;
    } catch { return 0; }
  };

  const getFollowingCount = (userId) => {
    try {
      const users = JSON.parse(localStorage.getItem('cliqd_social_cache') || '{}');
      return (users[userId]?.following || []).length;
    } catch { return 0; }
  };

  // Async fetchers (use in Profile page etc.)
  const fetchFollowers = (userId) => socialAPI.getFollowers(userId);
  const fetchFollowing = (userId) => socialAPI.getFollowing(userId);
  const fetchIsFollowing = (currentId, targetId) => socialAPI.isFollowing(currentId, targetId);

  const getUserByUsername = async (username) => {
    const { user } = await socialAPI.searchUsers(username)
      .then(({ users }) => ({ user: users.find(u => u.username === username) || null }));
    return user;
  };

  const getUserById = async (id) => {
    const { user } = await socialAPI.getUserById(id);
    return user;
  };

  return (
    <SocialContext.Provider value={{
      tick,
      follow, unfollow, isFollowing,
      getFollowerCount, getFollowingCount,
      fetchFollowers, fetchFollowing, fetchIsFollowing,
      getUserByUsername, getUserById,
    }}>
      {children}
    </SocialContext.Provider>
  );
}

export const useSocial = () => useContext(SocialContext);
