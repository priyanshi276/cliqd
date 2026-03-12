const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('cliqd_token');
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  };
  const res = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}

export const authAPI = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  getMe: () => request('/auth/me'),
  updateProfile: (updates) => request('/auth/profile', { method: 'PUT', body: updates }),
  getUserByUsername: (username) => request(`/auth/users/${username}`),
};

export const postsAPI = {
  getAll: () => request('/posts'),
  getById: (id) => request(`/posts/${id}`),
  getByUser: (userId) => request(`/posts/user/${userId}`),
  search: (query) => request(`/posts/search?q=${encodeURIComponent(query)}`),
  create: (payload) => request('/posts', { method: 'POST', body: payload }),
  delete: (postId) => request(`/posts/${postId}`, { method: 'DELETE' }),
  toggleLike: (postId) => request(`/posts/${postId}/like`, { method: 'POST' }),
};

export const socialAPI = {
  searchUsers: (query) => request(`/social/users?q=${encodeURIComponent(query)}`),
  getUserById: (userId) => request(`/social/users/${userId}`),
  follow: (targetId) => request(`/social/follow/${targetId}`, { method: 'POST' }),
  unfollow: (targetId) => request(`/social/follow/${targetId}`, { method: 'DELETE' }),
  getFollowers: (userId) => request(`/social/${userId}/followers`),
  getFollowing: (userId) => request(`/social/${userId}/following`),
  isFollowing: (currentId, targetId) => request(`/social/check/${currentId}/${targetId}`),
};

export const tokenUtils = {
  save: (token) => localStorage.setItem('cliqd_token', token),
  clear: () => localStorage.removeItem('cliqd_token'),
  get: getToken,
};