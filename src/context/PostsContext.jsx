import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const PostsContext = createContext(null);

const DEMO_POSTS = [
  {
    id: 'demo1',
    userId: 'demo_user',
    username: 'stylehaus',
    userAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=stylehaus',
    caption: 'Summer vibes with this stunning boho look ✨ The earrings are everything right now.',
    mediaUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
    mediaType: 'image',
    tags: [
      { id: 't1', productName: 'Gold Hoop Earrings', price: '₹899', link: '#', x: 28, y: 18 },
      { id: 't2', productName: 'Boho Maxi Dress', price: '₹2499', link: '#', x: 55, y: 62 }
    ],
    likes: ['user1','user2','user3'],
    createdAt: Date.now() - 3600000 * 2
  },
  {
    id: 'demo2',
    userId: 'demo_user2',
    username: 'urban.fits',
    userAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=urbanfits',
    caption: 'Street style game on point 🔥 Sneakers doing the heavy lifting.',
    mediaUrl: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=600&q=80',
    mediaType: 'image',
    tags: [
      { id: 't3', productName: 'White Sneakers', price: '₹3499', link: '#', x: 42, y: 80 },
      { id: 't4', productName: 'Oversized Jacket', price: '₹1999', link: '#', x: 60, y: 40 }
    ],
    likes: ['user1'],
    createdAt: Date.now() - 3600000 * 5
  },
  {
    id: 'demo3',
    userId: 'demo_user3',
    username: 'accessory.lab',
    userAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=accessorylab',
    caption: 'Obsessed with these pearl drop earrings 💎 Perfect for any occasion.',
    mediaUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
    mediaType: 'image',
    tags: [
      { id: 't5', productName: 'Pearl Drop Earrings', price: '₹650', link: '#', x: 30, y: 25 },
      { id: 't6', productName: 'Silk Blouse', price: '₹1799', link: '#', x: 50, y: 55 }
    ],
    likes: ['user1','user2','user3','user4','user5'],
    createdAt: Date.now() - 3600000 * 8
  },
  {
    id: 'demo4',
    userId: 'demo_user4',
    username: 'sneaker.vault',
    userAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=sneakervault',
    caption: 'New drops just landed 🚀 These kicks are fire.',
    mediaUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    mediaType: 'image',
    tags: [
      { id: 't7', productName: 'Red Sneakers', price: '₹5999', link: '#', x: 50, y: 55 }
    ],
    likes: [],
    createdAt: Date.now() - 3600000 * 12
  },
  {
    id: 'demo5',
    userId: 'demo_user5',
    username: 'minimal.drip',
    userAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=minimaldrip',
    caption: 'Less is more. Clean look, clean energy 🤍',
    mediaUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
    mediaType: 'image',
    tags: [
      { id: 't8', productName: 'Stud Earrings', price: '₹350', link: '#', x: 35, y: 20 },
      { id: 't9', productName: 'White Tee', price: '₹799', link: '#', x: 52, y: 50 }
    ],
    likes: ['user2'],
    createdAt: Date.now() - 3600000 * 20
  }
];

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('cliqd_posts');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) { setPosts(parsed); return; }
      } catch {}
    }
    setPosts(DEMO_POSTS);
    localStorage.setItem('cliqd_posts', JSON.stringify(DEMO_POSTS));
  }, []);

  const savePosts = (newPosts) => {
    setPosts(newPosts);
    localStorage.setItem('cliqd_posts', JSON.stringify(newPosts));
  };

  const createPost = ({ userId, username, userAvatar, caption, mediaUrl, mediaType, tags }) => {
    const post = {
      id: uuidv4(),
      userId, username, userAvatar, caption, mediaUrl, mediaType,
      tags: tags || [],
      likes: [],
      createdAt: Date.now()
    };
    const updated = [post, ...posts];
    savePosts(updated);
    return post;
  };

  const toggleLike = (postId, userId) => {
    const updated = posts.map(p => {
      if (p.id !== postId) return p;
      const liked = p.likes.includes(userId);
      return { ...p, likes: liked ? p.likes.filter(id => id !== userId) : [...p.likes, userId] };
    });
    savePosts(updated);
  };

  const deletePost = (postId, userId) => {
    const updated = posts.filter(p => !(p.id === postId && p.userId === userId));
    savePosts(updated);
  };

  const getPostsByUser = (userId) => posts.filter(p => p.userId === userId);

  const searchPosts = (query) => {
    if (!query.trim()) return posts;
    const q = query.toLowerCase();
    return posts.filter(p =>
      p.caption?.toLowerCase().includes(q) ||
      p.username?.toLowerCase().includes(q) ||
      p.tags?.some(t => t.productName?.toLowerCase().includes(q))
    );
  };

  return (
    <PostsContext.Provider value={{ posts, createPost, toggleLike, deletePost, getPostsByUser, searchPosts }}>
      {children}
    </PostsContext.Provider>
  );
}

export const usePosts = () => useContext(PostsContext);
