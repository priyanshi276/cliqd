// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { read, write } = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'cliqd_dev_secret';

// ── Helper: build safe session object (no password) ──
function toSession(user) {
  const { password, ...safe } = user;
  return safe;
}

// ── Helper: sign JWT ──
function signToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    if (username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters.' });
    }
    if (!/^[a-zA-Z0-9_.]+$/.test(username)) {
      return res.status(400).json({ error: 'Username can only contain letters, numbers, _ and .' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const users = read('users');

    if (Object.values(users).find(u => u.email === email)) {
      return res.status(409).json({ error: 'Email already registered.' });
    }
    if (Object.values(users).find(u => u.username === username)) {
      return res.status(409).json({ error: 'Username already taken.' });
    }

    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id,
      name,
      email,
      password: hashedPassword,
      username: username.toLowerCase(),
      avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=${username}`,
      bio: '',
      coverPhoto: '',
      followers: [],
      following: [],
      createdAt: Date.now(),
    };

    users[id] = newUser;
    write('users', users);

    const token = signToken(newUser);
    res.status(201).json({ token, user: toSession(newUser) });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const users = read('users');
    const user = Object.values(users).find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = signToken(user);
    res.json({ token, user: toSession(user) });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// GET /api/auth/me  — get current user from token
router.get('/me', authMiddleware, (req, res) => {
  const users = read('users');
  const user = users[req.user.id];
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json({ user: toSession(user) });
});

// PUT /api/auth/profile — update profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const users = read('users');
    const user = users[req.user.id];
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const allowedFields = ['name', 'bio', 'avatar', 'coverPhoto'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) user[field] = req.body[field];
    });

    // Handle password change
    if (req.body.newPassword) {
      if (!req.body.currentPassword) {
        return res.status(400).json({ error: 'Current password is required.' });
      }
      const match = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!match) return res.status(401).json({ error: 'Current password is incorrect.' });
      user.password = await bcrypt.hash(req.body.newPassword, 10);
    }

    users[req.user.id] = user;
    write('users', users);
    res.json({ user: toSession(user) });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Server error updating profile.' });
  }
});

// GET /api/auth/users/:username — get public user profile
router.get('/users/:username', (req, res) => {
  const users = read('users');
  const user = Object.values(users).find(u => u.username === req.params.username);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json({ user: toSession(user) });
});

module.exports = router;
