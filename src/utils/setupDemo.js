// This file initializes demo data on first load
// It's imported in Register.jsx automatically

export function ensureDemoAccount() {
  const users = JSON.parse(localStorage.getItem('cliqd_users') || '{}');
  const demoExists = Object.values(users).find(u => u.email === 'demo@cliqd.com');
  if (!demoExists) {
    const id = 'demo-user-' + Date.now();
    users[id] = {
      id,
      name: 'Demo User',
      email: 'demo@cliqd.com',
      password: 'demo1234',
      username: 'demouser',
      avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=demouser',
      bio: 'Official demo account 👋 Explore Cliqd!',
      followers: [],
      following: [],
      createdAt: Date.now()
    };
    localStorage.setItem('cliqd_users', JSON.stringify(users));
  }
}
