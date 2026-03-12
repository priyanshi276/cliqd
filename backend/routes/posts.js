// routes/posts.js
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { read, write } = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// ── Helper: posts object → sorted array ──
function postsArray(postsObj) {
  return Object.values(postsObj).sort((a, b) => b.createdAt - a.createdAt);
}

// GET /api/posts — get all posts (feed)
router.get('/', (req, res) => {
  const posts = read('posts');
  res.json({ posts: postsArray(posts) });
});

// GET /api/posts/search?q=query — search posts
router.get('/search', (req, res) => {
  const { q } = req.query;
  if (!q || !q.trim()) {
    return res.json({ posts: postsArray(read('posts')) });
  }
  const query = q.toLowerCase();
  const posts = read('posts');
  const results = Object.values(posts).filter(p =>
    p.caption?.toLowerCase().includes(query) ||
    p.username?.toLowerCase().includes(query) ||
    p.tags?.some(t => t.productName?.toLowerCase().includes(query))
  ).sort((a, b) => b.createdAt - a.createdAt);

  res.json({ posts: results });
});

// GET /api/posts/user/:userId — posts by a specific user
router.get('/user/:userId', (req, res) => {
  const posts = read('posts');
  const userPosts = Object.values(posts)
    .filter(p => p.userId === req.params.userId)
    .sort((a, b) => b.createdAt - a.createdAt);
  res.json({ posts: userPosts });
});

// GET /api/posts/:id — single post
router.get('/:id', (req, res) => {
  const posts = read('posts');
  const post = posts[req.params.id];
  if (!post) return res.status(404).json({ error: 'Post not found.' });
  res.json({ post });
});

// POST /api/posts — create a post (auth required)
router.post('/', authMiddleware, (req, res) => {
  try {
    const { caption, mediaUrl, mediaType, tags, userAvatar } = req.body;

    if (!mediaUrl) {
      return res.status(400).json({ error: 'Media URL is required.' });
    }

    const posts = read('posts');
    const users = read('users');
    const user = users[req.user.id];

    const post = {
      id: uuidv4(),
      userId: req.user.id,
      username: req.user.username,
      userAvatar: user?.avatar || userAvatar || '',
      caption: caption || '',
      mediaUrl,
      mediaType: mediaType || 'image',
      tags: tags || [],
      likes: [],
      createdAt: Date.now(),
    };

    posts[post.id] = post;
    write('posts', posts);
    res.status(201).json({ post });
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ error: 'Server error creating post.' });
  }
});

// DELETE /api/posts/:id — delete a post (owner only)
router.delete('/:id', authMiddleware, (req, res) => {
  const posts = read('posts');
  const post = posts[req.params.id];

  if (!post) return res.status(404).json({ error: 'Post not found.' });
  if (post.userId !== req.user.id) {
    return res.status(403).json({ error: 'You can only delete your own posts.' });
  }

  delete posts[req.params.id];
  write('posts', posts);
  res.json({ success: true, deletedId: req.params.id });
});

// POST /api/posts/:id/like — toggle like (auth required)
router.post('/:id/like', authMiddleware, (req, res) => {
  const posts = read('posts');
  const post = posts[req.params.id];

  if (!post) return res.status(404).json({ error: 'Post not found.' });

  const userId = req.user.id;
  const alreadyLiked = post.likes.includes(userId);

  post.likes = alreadyLiked
    ? post.likes.filter(id => id !== userId)
    : [...post.likes, userId];

  posts[req.params.id] = post;
  write('posts', posts);

  res.json({ liked: !alreadyLiked, likesCount: post.likes.length, likes: post.likes });
});

module.exports = router;
