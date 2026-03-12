// db.js — lightweight JSON file-based data store
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function getFilePath(collection) {
  return path.join(DATA_DIR, `${collection}.json`);
}

function read(collection) {
  const file = getFilePath(collection);
  if (!fs.existsSync(file)) return {};
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return {};
  }
}

function write(collection, data) {
  fs.writeFileSync(getFilePath(collection), JSON.stringify(data, null, 2));
}

// Seed demo data on first run
function seedIfEmpty() {
  const users = read('users');
  if (Object.keys(users).length === 0) {
    const bcrypt = require('bcryptjs');
    const { v4: uuidv4 } = require('uuid');
    const demoId = 'demo-user-001';
    users[demoId] = {
      id: demoId,
      name: 'Demo User',
      email: 'demo@cliqd.com',
      password: bcrypt.hashSync('demo1234', 10),
      username: 'demouser',
      avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=demouser',
      bio: 'Official demo account 👋 Explore Cliqd!',
      coverPhoto: '',
      followers: [],
      following: [],
      createdAt: Date.now(),
    };
    write('users', users);
    console.log('✅ Demo user seeded: demo@cliqd.com / demo1234');
  }

  const posts = read('posts');
  if (Object.keys(posts).length === 0) {
    const demoPosts = {
      demo1: {
        id: 'demo1', userId: 'demo_user', username: 'stylehaus',
        userAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=stylehaus',
        caption: 'Summer vibes with this stunning boho look ✨',
        mediaUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
        mediaType: 'image',
        tags: [
          { id: 't1', productName: 'Gold Hoop Earrings', price: '₹899', link: '#', x: 28, y: 18 },
          { id: 't2', productName: 'Boho Maxi Dress', price: '₹2499', link: '#', x: 55, y: 62 },
        ],
        likes: ['user1', 'user2', 'user3'],
        createdAt: Date.now() - 3600000 * 2,
      },
      demo2: {
        id: 'demo2', userId: 'demo_user2', username: 'urban.fits',
        userAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=urbanfits',
        caption: 'Street style game on point 🔥',
        mediaUrl: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=600&q=80',
        mediaType: 'image',
        tags: [
          { id: 't3', productName: 'White Sneakers', price: '₹3499', link: '#', x: 42, y: 80 },
          { id: 't4', productName: 'Oversized Jacket', price: '₹1999', link: '#', x: 60, y: 40 },
        ],
        likes: ['user1'],
        createdAt: Date.now() - 3600000 * 5,
      },
      demo3: {
        id: 'demo3', userId: 'demo_user3', username: 'accessory.lab',
        userAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=accessorylab',
        caption: 'Obsessed with these pearl drop earrings 💎',
        mediaUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
        mediaType: 'image',
        tags: [
          { id: 't5', productName: 'Pearl Drop Earrings', price: '₹650', link: '#', x: 30, y: 25 },
          { id: 't6', productName: 'Silk Blouse', price: '₹1799', link: '#', x: 50, y: 55 },
        ],
        likes: ['user1', 'user2', 'user3', 'user4', 'user5'],
        createdAt: Date.now() - 3600000 * 8,
      },
    };
    write('posts', demoPosts);
    console.log('✅ Demo posts seeded');
  }
}

module.exports = { read, write, seedIfEmpty };
