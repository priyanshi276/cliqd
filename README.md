# Cliqd – Social Commerce Platform

A professional social commerce React app where users can tag products on photos/videos.

## Features
- 🔐 Real authentication & authorization (localStorage-based, persistent)
- 📸 Upload photos & videos (Reels)
- 🏷️ Click-to-tag products on images
- ❤️ Like posts
- 👥 Follow / Unfollow users
- 🔍 Search by product name (e.g., "earrings", "sneakers")
- 👤 Profile pages with post grid
- 📱 Fully responsive (mobile + desktop)
- 💾 All posts & data persist across sessions

## Getting Started

### Install dependencies
```bash
cd cliqd
npm install
```

### Run the app
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Account
- Email: `demo@cliqd.com`
- Password: `demo1234`

## Folder Structure
```
src/
├── App.jsx              # Main app with routing
├── index.js             # Entry point
├── index.css            # Global styles & design tokens
├── App.css              # Layout styles
├── context/
│   ├── AuthContext.jsx  # Auth state (login/register/logout)
│   ├── PostsContext.jsx # Posts CRUD + search
│   └── SocialContext.jsx # Follow/unfollow system
├── components/
│   ├── Sidebar.jsx      # Navigation sidebar
│   ├── Sidebar.css
│   ├── PostCard.jsx     # Post with tags, likes, media
│   └── PostCard.css
├── pages/
│   ├── Home.jsx         # Feed + search
│   ├── Home.css
│   ├── Login.jsx        # Login page
│   ├── Register.jsx     # Sign up page
│   ├── Auth.css         # Shared auth styles
│   ├── CreatePost.jsx   # Upload + product tagging
│   ├── CreatePost.css
│   ├── Profile.jsx      # User profile + grid + follow
│   └── Profile.css
└── utils/
    └── setupDemo.js     # Demo account initializer
```

## How Product Tagging Works
1. Upload a photo on Create Post
2. Click anywhere on the image — a purple dot appears
3. Select a product from the list (or type a custom product)
4. The tag is placed at that coordinate
5. On the feed, click the tag icon to see product dots
6. Click a dot to see product name, price, and Shop Now link

## Data Storage
All data is stored in `localStorage`:
- `cliqd_users` – user accounts
- `cliqd_posts` – all posts
- `cliqd_session` – current logged-in user

This means data persists across browser sessions! ✅
