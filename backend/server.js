// server.js — Cliqd Backend Entry Point
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { seedIfEmpty } = require('./db');

// ── Route imports ──
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const socialRoutes = require('./routes/social');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' })); // allow base64 image strings
app.use(express.urlencoded({ extended: true }));

// ── Request logger (dev only) ──
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ── Health check ──
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Cliqd API is running 🚀',
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ──
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/social', socialRoutes);

// ── 404 handler ──
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ── Global error handler ──
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// ── Start server ──
app.listen(PORT, () => {
  seedIfEmpty(); // seed demo data if DB is empty
  console.log(`\n🟣 Cliqd API running at http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
