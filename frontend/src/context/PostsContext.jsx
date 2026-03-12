// src/context/PostsContext.jsx  (updated — uses Node.js backend)
import React, { createContext, useContext, useState, useEffect } from 'react';
import { postsAPI } from '../services/api';

const PostsContext = createContext(null);

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all posts on mount
  useEffect(() => {
    postsAPI.getAll()
      .then(({ posts }) => setPosts(posts))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const createPost = async (payload) => {
    const { post } = await postsAPI.create(payload);
    setPosts(prev => [post, ...prev]);
    return post;
  };

  const toggleLike = async (postId) => {
    const { likes } = await postsAPI.toggleLike(postId);
    setPosts(prev =>
      prev.map(p => p.id === postId ? { ...p, likes } : p)
    );
  };

  const deletePost = async (postId) => {
    await postsAPI.delete(postId);
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const getPostsByUser = (userId) => posts.filter(p => p.userId === userId);

  const searchPosts = async (query) => {
    if (!query.trim()) return posts;
    const { posts: results } = await postsAPI.search(query);
    return results;
  };

  return (
    <PostsContext.Provider value={{ posts, loading, createPost, toggleLike, deletePost, getPostsByUser, searchPosts }}>
      {children}
    </PostsContext.Provider>
  );
}

export const usePosts = () => useContext(PostsContext);
