import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const PostsContext = createContext(null);

const DEMO_POSTS = [
  {
    id: 'demo1',
    userId: 'demo_user',
    username: 'stylehaus',
    // userAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=stylehaus',
    caption: 'Summer vibes with this stunning boho look ✨ The earrings are everything right now.',
    // mediaUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
    mediaUrl: 'earing1.png',
    mediaType: 'image',
    tags: [
      { id: 't1', productName: 'Gemstone Hoop Earrings', price: '₹899', link: '#', x: 28, y: 18 },
      { id: 't2', productName: 'Boho Maxi Dress', price: '₹2499', link: '#', x: 55, y: 62 }
    ],
    likes: ['user1','user2','user3'],
    createdAt: Date.now() - 3600000 * 2
  },
  {
    id: 'demo2',
    userId: 'demo_user2',
    username: 'urban.fits',
    // userAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=urbanfits',
    caption: 'Street style game on point 🔥 Sneakers doing the heavy lifting.',
    mediaUrl: 'dress2.png',
    mediaType: 'image',
    tags: [
      { id: 't3', productName: 'White Sneakers', price: '₹3499', link: '#', x: 42, y: 80 },
      { id: 't4', productName: 'Off shoulder dress', price: '₹1999', link: '#', x: 60, y: 40 }
    ],
    likes: ['user1'],
    createdAt: Date.now() - 3600000 * 5
  },
  {
    id: 'demo3',
    userId: 'demo_user3',
    username: 'accessory.lab',
    // userAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=accessorylab',
    caption: 'Obsessed with these pearl drop earrings 💎 Perfect for any occasion.',
    mediaUrl: 'earing2.png',
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
    // userAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=sneakervault',
    caption: 'New drops just landed 🚀 These kicks are fire.',
    mediaUrl: 'sneakers.png',
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
    // userAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=minimaldrip',
    caption: 'Less is more. Clean look, clean energy 🤍',
    mediaUrl: 'dress.png',
    mediaType: 'image',
    tags: [
      { id: 't8', productName: 'Coat', price: '₹1350', link: '#', x: 35, y: 20 },
      { id: 't9', productName: 'Black Floral Skirt', price: '₹799', link: '#', x: 52, y: 50 }
    ],
    likes: ['user2'],
    createdAt: Date.now() - 3600000 * 20
  },
  {
    id: 'demo6',
    userId: 'demo_user6',
    username: 'chic.corner',
    // userAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=chiccorner',
    caption: 'Layered necklaces are trending this season ✨ Minimal yet classy.',
    mediaUrl: 'pendant.png',
    mediaType: 'image',
    tags: [
      {  id: 't10', productName: 'Layered Gold Necklace', price: '₹1299', link: '#', x: 45, y: 35 },
      { id: 't11', productName: 'White Shirt', price: '₹899', link: '#', x: 50, y: 65 }
    ],
    likes: ['user1','user2'],
    createdAt: Date.now() - 3600000 * 3
  },
  {
    id: 'demo7',
    userId: 'demo_user7',
    username: 'trend.hub',
    // userAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=trendhub',
    caption: 'Casual jacket look for everyday comfort 💙',
    mediaUrl: 'leatherjacket.png',
    mediaType: 'image',
    tags: [
      { id: 't12', productName: 'Leather Jacket', price: '₹2299', link: '#', x: 48, y: 30 }
    ],
    likes: [],
    createdAt: Date.now() - 3600000 * 6
  },
  {
    id: 'demo8',
    userId: 'demo_user8',
    username: 'glam.zone',
    // userAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=glamzone',
    caption: 'Flowy floral skirt for the perfect brunch vibe 🌸✨',
    mediaUrl: 'skirt.png',
    mediaType: 'image',
    tags: [
      { id: 't13', productName: 'Mini Skirt', price: '₹1499', link: '#', x: 50, y: 65 },
      { id: 't14', productName: 'Strip Shirt', price: '₹999', link: '#', x: 50, y: 40 }
    ],
    likes: ['user1', 'user4'],
    createdAt: Date.now() - 3600000 * 4
  },
  {
  id: 'demo9',
  userId: 'demo_user9',
  username: 'bag.story',
  // userAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=bagstory',
  caption: 'This statement tote bag is giving main character energy 👜✨ Perfect for college & casual outings.',
  mediaUrl: 'bag.png',
  mediaType: 'image',
  tags: [
    { id: 't15', productName: 'Beige Tote Bag', price: '₹1499', link: '#', x: 55, y: 50 }
  ],
  likes: ['user1','user3'],
  createdAt: Date.now() - 3600000 * 11
},
{
  id: 'demo10',
  userId: 'demo_user10',
  username: 'ring.affair',
  // userAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=ringaffair',
  caption: 'Minimal gold ring with a touch of sparkle ✨ Perfect for everyday elegance.',
  mediaUrl: 'ring.png',
  mediaType: 'image',
  tags: [
    { id: 't16', productName: 'Minimal Gold Crystal Ring', price: '₹999', link: '#', x: 52, y: 55 }
  ],
  likes: ['user1','user4'],
  createdAt: Date.now() - 3600000 * 2
},
{
  id: 'demo11',
  userId: 'demo_user11',
  username: 'winter.vibes',
  // userAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=wintervibes',
  caption: 'Elegant long coat for a classy winter look ❄️✨ Perfect for brunch & evening outings.',
  mediaUrl: 'coat.png',
  mediaType: 'image',
  tags: [
    { 
      id: 't17', 
      productName: 'Elegant Long Winter Coat', 
      price: '₹3499', 
      link: '#', 
      x: 48, 
      y: 40 
    }
  ],
  likes: ['user2','user5'],
  createdAt: Date.now() - 3600000 * 3
},
{
  id: 'demo12',
  userId: 'demo_user12',
  username: 'timeless.style',
  // userAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=timelessstyle',
  caption: 'Classic wrist watch that defines elegance ⌚✨ Perfect for office & formal wear.',
  mediaUrl: 'watch3.png',
  mediaType: 'image',
  tags: [
    { 
      id: 't18', 
      productName: 'Classic Analog Watch', 
      price: '₹2799', 
      link: '#', 
      x: 50, 
      y: 60 
    }
  ],
  likes: ['user1','user3','user6'],
  createdAt: Date.now() - 3600000 * 4
},
{
  id: 'demo13',
  userId: 'demo_user13',
  username: 'glam.corner',
  // userAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=glamcorner',
  caption: 'Dreamy lavender ruffle gown 💜✨ Perfect for receptions & evening glam nights.',
  mediaUrl: 'gown.png',
  mediaType: 'image',
  tags: [
    { 
      id: 't19', 
      productName: 'Lavender Strapless Ruffle Gown', 
      price: '₹6999', 
      link: '#', 
      x: 55, 
      y: 45 
    }
  ],
  likes: ['user2','user7','user9'],
  createdAt: Date.now() - 3600000 * 5
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

  const createPost = ({ userId, username, caption, mediaUrl, mediaType, tags }) => {
    const post = {
      id: uuidv4(),
      userId, username, caption, mediaUrl, mediaType,
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
