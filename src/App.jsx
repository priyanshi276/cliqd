import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PostsProvider } from './context/PostsContext';
import { SocialProvider } from './context/SocialContext';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import ShopPage from './pages/ShopPage';
import './App.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="app-loading"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppLayout({ children, isDark, onToggleTheme }) {
  return (
    <div className="app-layout">
      <Sidebar />
      {/* Theme toggle button — top right */}
      <button className="theme-toggle" onClick={onToggleTheme} title="Toggle theme">
        {isDark ? (
          // Sun icon for light mode
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        ) : (
          // Moon icon for dark mode
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
        )}
      </button>
      <main className="app-main">{children}</main>
    </div>
  );
}

function AppRoutes({ isDark, onToggleTheme }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="app-loading"><div className="spinner" /></div>;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
      <Route path="/" element={<ProtectedRoute><AppLayout isDark={isDark} onToggleTheme={onToggleTheme}><Home /></AppLayout></ProtectedRoute>} />
      <Route path="/create" element={<ProtectedRoute><AppLayout isDark={isDark} onToggleTheme={onToggleTheme}><CreatePost /></AppLayout></ProtectedRoute>} />
      <Route path="/profile/:username" element={<ProtectedRoute><AppLayout isDark={isDark} onToggleTheme={onToggleTheme}><Profile /></AppLayout></ProtectedRoute>} />
      <Route path="/shop" element={<ProtectedRoute><AppLayout isDark={isDark} onToggleTheme={onToggleTheme}><ShopPage /></AppLayout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
      return next;
    });
  };

  // Set initial theme
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <PostsProvider>
          <SocialProvider>
            <AppRoutes isDark={isDark} onToggleTheme={toggleTheme} />
          </SocialProvider>
        </PostsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
