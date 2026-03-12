# Cliqd — Social Commerce Platform

A full-stack social media app where users can share fashion posts, tag shoppable products directly on images, follow creators, and discover items to buy — all in one place.

---

## Live Demo

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- Demo Account: `demo@cliqd.com` / `demo1234`

---

## Features

- **Auth** — Register, login, JWT-based sessions, profile editing
- **Feed** — Scrollable post feed with live search by caption, user, or product
- **Shoppable Posts** — Tag products directly on images with price + purchase link
- **Shop Page** — Dedicated product page with wishlist, buy now, and related posts
- **Profiles** — Cover photo, bio, post grid, follower/following counts
- **Follow System** — Follow/unfollow users, see follower lists
- **Reels** — Video post support with play/pause
- **Responsive** — Mobile sidebar with hamburger menu

---

## Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite | Dev server & bundler |
| React Router v6 | Client-side routing |
| Context API | Global state (auth, posts, social) |
| CSS Variables | Theming & design tokens |

### Backend
| Tech | Purpose |
|------|---------|
| Node.js | Runtime |
| Express.js | REST API framework |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT auth tokens |
| uuid | Unique ID generation |
| JSON files | Data storage (no DB setup needed) |

---

## Project Structure

```
cliqd/
│
├── cliqd-frontend/                  ← React + Vite app
│   ├── src/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      ← Auth state, login/register/logout
│   │   │   ├── PostsContext.jsx     ← Posts state, create/like/delete
│   │   │   └── SocialContext.jsx    ← Follow/unfollow state
│   │   │
│   │   ├── services/
│   │   │   └── api.js               ← Central API client (fetch wrapper)
│   │   │
│   │   ├── components/
│   │   │   ├── Sidebar.jsx          ← Navigation sidebar
│   │   │   └── PostCard.jsx         ← Individual post with tags
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx             ← Feed + search
│   │   │   ├── Login.jsx            ← Sign in
│   │   │   ├── Register.jsx         ← Create account
│   │   │   ├── Profile.jsx          ← User profile page
│   │   │   ├── CreatePost.jsx       ← Upload + tag products
│   │   │   └── ShopPage.jsx         ← Product detail + buy
│   │   │
│   │   ├── App.jsx                  ← Routes setup
│   │   └── main.jsx                 ← Entry point
│   │
│   └── package.json
│
└── cliqd-backend/                   ← Node.js + Express API
    ├── server.js                    ← Entry point (port 5000)
    ├── db.js                        ← JSON file read/write helper
    ├── package.json
    │
    ├── middleware/
    │   └── auth.js                  ← JWT verification
    │
    ├── routes/
    │   ├── auth.js                  ← /api/auth/*
    │   ├── posts.js                 ← /api/posts/*
    │   └── social.js                ← /api/social/*
    │
    └── data/                        ← Auto-created on first run
        ├── users.json
        └── posts.json
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- npm v9+

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/cliqd.git
cd cliqd
```

### 2. Start the Backend
```bash
cd cliqd-backend
npm install
npm run dev
```
You should see:
```
🟣 Cliqd API running at http://localhost:5000
```

### 3. Start the Frontend
```bash
cd cliqd-frontend
npm install
npm run dev
```
You should see:
```
VITE ready in 2600ms
➜ Local: http://localhost:5173
```

### 4. Open in browser
```
http://localhost:5173
```

> Both servers must be running at the same time.

---

## API Reference

### Base URL
```
http://localhost:5000/api
```

### Auth Routes
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/auth/register` | ❌ | Create new account |
| POST | `/auth/login` | ❌ | Sign in, returns JWT |
| GET | `/auth/me` | ✅ | Get current user |
| PUT | `/auth/profile` | ✅ | Update profile / password |
| GET | `/auth/users/:username` | ❌ | Public user profile |

### Posts Routes
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/posts` | ❌ | Get all posts (feed) |
| GET | `/posts/search?q=` | ❌ | Search posts |
| GET | `/posts/user/:userId` | ❌ | Posts by user |
| GET | `/posts/:id` | ❌ | Single post |
| POST | `/posts` | ✅ | Create post |
| DELETE | `/posts/:id` | ✅ | Delete own post |
| POST | `/posts/:id/like` | ✅ | Toggle like |

### Social Routes
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/social/users?q=` | ❌ | Search users |
| POST | `/social/follow/:targetId` | ✅ | Follow user |
| DELETE | `/social/follow/:targetId` | ✅ | Unfollow user |
| GET | `/social/:userId/followers` | ❌ | List followers |
| GET | `/social/:userId/following` | ❌ | List following |
| GET | `/social/check/:currentId/:targetId` | ❌ | Check if following |

### Authentication Header
All protected routes require:
```
Authorization: Bearer <your_jwt_token>
```

---

## Environment Variables

### Backend (optional — has defaults)
Create `cliqd-backend/.env`:
```env
PORT=5000
JWT_SECRET=your_strong_secret_here
CLIENT_URL=http://localhost:5173
```

### Frontend (optional — has defaults)
Create `cliqd-frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

> The app works without any `.env` files in development.

---

## How Data Flows

```
User Action (click/submit)
        ↓
React Component
        ↓
Context Hook (useAuth / usePosts / useSocial)
        ↓
services/api.js  →  fetch() with JWT header
        ↓
Express Route Handler
        ↓
db.js  →  reads/writes data/*.json
        ↓
JSON response back to frontend
        ↓
Context updates state  →  UI re-renders
```

---

## Demo Account

Auto-created on first backend run:
```
Email:    demo@cliqd.com
Password: demo1234
```

---

## Roadmap / Future Improvements

- [ ] Swap JSON file storage for MongoDB or PostgreSQL
- [ ] Image upload to Cloudinary or AWS S3
- [ ] Comments on posts
- [ ] Notifications system
- [ ] Direct messages
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Render or Railway

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

MIT — free to use and modify.
