// routes/social.js
const express = require('express');
const { read, write } = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

function toPublic(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}

// GET /api/social/users — search users
router.get('/users', (req, res) => {
  const { q } = req.query;
  const users = read('users');
  let result = Object.values(users).map(toPublic);

  if (q && q.trim()) {
    const query = q.toLowerCase();
    result = result.filter(u =>
      u.username?.toLowerCase().includes(query) ||
      u.name?.toLowerCase().includes(query)
    );
  }

  res.json({ users: result });
});

// GET /api/social/users/:userId — get user by ID
router.get('/users/:userId', (req, res) => {
  const users = read('users');
  const user = users[req.params.userId];
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json({ user: toPublic(user) });
});

// POST /api/social/follow/:targetId — follow a user
router.post('/follow/:targetId', authMiddleware, (req, res) => {
  const { targetId } = req.params;
  const currentId = req.user.id;

  if (currentId === targetId) {
    return res.status(400).json({ error: 'You cannot follow yourself.' });
  }

  const users = read('users');
  const currentUser = users[currentId];
  const targetUser = users[targetId];

  if (!currentUser || !targetUser) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (!Array.isArray(currentUser.following)) currentUser.following = [];
  if (!Array.isArray(targetUser.followers)) targetUser.followers = [];

  if (currentUser.following.includes(targetId)) {
    return res.status(400).json({ error: 'Already following this user.' });
  }

  currentUser.following.push(targetId);
  targetUser.followers.push(currentId);

  users[currentId] = currentUser;
  users[targetId] = targetUser;
  write('users', users);

  res.json({
    success: true,
    following: true,
    followerCount: targetUser.followers.length,
    followingCount: currentUser.following.length,
  });
});

// DELETE /api/social/follow/:targetId — unfollow a user
router.delete('/follow/:targetId', authMiddleware, (req, res) => {
  const { targetId } = req.params;
  const currentId = req.user.id;

  const users = read('users');
  const currentUser = users[currentId];
  const targetUser = users[targetId];

  if (!currentUser || !targetUser) {
    return res.status(404).json({ error: 'User not found.' });
  }

  currentUser.following = (currentUser.following || []).filter(id => id !== targetId);
  targetUser.followers = (targetUser.followers || []).filter(id => id !== currentId);

  users[currentId] = currentUser;
  users[targetId] = targetUser;
  write('users', users);

  res.json({
    success: true,
    following: false,
    followerCount: targetUser.followers.length,
    followingCount: currentUser.following.length,
  });
});

// GET /api/social/:userId/followers — list followers
router.get('/:userId/followers', (req, res) => {
  const users = read('users');
  const user = users[req.params.userId];
  if (!user) return res.status(404).json({ error: 'User not found.' });

  const followers = (user.followers || [])
    .map(id => users[id])
    .filter(Boolean)
    .map(toPublic);

  res.json({ followers, count: followers.length });
});

// GET /api/social/:userId/following — list following
router.get('/:userId/following', (req, res) => {
  const users = read('users');
  const user = users[req.params.userId];
  if (!user) return res.status(404).json({ error: 'User not found.' });

  const following = (user.following || [])
    .map(id => users[id])
    .filter(Boolean)
    .map(toPublic);

  res.json({ following, count: following.length });
});

// GET /api/social/check/:currentId/:targetId — is following?
router.get('/check/:currentId/:targetId', (req, res) => {
  const users = read('users');
  const currentUser = users[req.params.currentId];
  const isFollowing = (currentUser?.following || []).includes(req.params.targetId);
  res.json({ isFollowing });
});

module.exports = router;
