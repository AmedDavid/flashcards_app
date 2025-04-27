// Our API endpoints (json-server, cache, Flashcards, categories, progress)
import axios from 'axios';

// Api endpoint wth timeout
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 5000,
});

//TODO: cache for offline mode
const cache = {
    flashcards: JSON.parse(localStorage.getItem('flashcards')) || [],
    categories: JSON.parse(localStorage.getItem('categories')) || [],
    progress: JSON.parse(localStorage.getItem('progress')) || [],
    badges: JSON.parse(localStorage.getItem('badges')) || [],
    users: JSON.parse(localStorage.getItem('users')) || [],
  };

// Save to cache
const updateCache = (key, data) => {
    cache[key] = data;
    localStorage.setItem(key, JSON.stringify(data));
  };
  

// Check if offline by pinging the /users endpoint
const isOffline = async () => {
  try {
    await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/users`);
    return false;
  } catch {
    return true;
  }
};

// Flashcards (get, create, update and delete)
export const getFlashcards = async (userId) => {
  if (await isOffline()) return cache.flashcards.filter((f) => f.userId === userId);
  const response = await api.get(`/flashcards?userId=${userId}`);

  updateCache('flashcards', response.data);
  return response.data;
};

//create
export const createFlashcard = async (flashcard) => {
  if (await isOffline()) {
    const newFlashcard = { ...flashcard, id: Date.now() };
    cache.flashcards.push(newFlashcard);
    updateCache('flashcards', cache.flashcards);
    return newFlashcard;
  }
  //pass the cards
  const response = await api.post('/flashcards', flashcard);
  updateCache('flashcards', [...cache.flashcards, response.data]);
  return response.data;
};

//delete
export const deleteFlashcard = async (id) => {
  if (await isOffline()) {
    cache.flashcards = cache.flashcards.filter((f) => f.id !== id);
    updateCache('flashcards', cache.flashcards);
    return;
  }
  await api.delete(`/flashcards/${id}`);
  updateCache('flashcards', cache.flashcards.filter((f) => f.id !== id));
};

//update the cards
export const updateFlashcard = async (id, flashcard) => {
  if (await isOffline()) {
    cache.flashcards = cache.flashcards.map((f) => (f.id === id ? { ...f, ...flashcard } : f));
    updateCache('flashcards', cache.flashcards);
    return flashcard;
  }
  const response = await api.patch(`/flashcards/${id}`, flashcard);
  updateCache('flashcards', cache.flashcards.map((f) => (f.id === id ? response.data : f)));
  return response.data;
};


// Categories get, create, update and delete (The most complex part)
export const getCategories = async (userId) => {
  if (await isOffline()) return cache.categories.filter((c) => c.userId === userId);
  const response = await api.get(`/categories?userId=${userId}`);
  updateCache('categories', response.data);
  return response.data;
};

export const createCategory = async (category) => {
  if (await isOffline()) {
    const newCategory = { ...category, id: Date.now() };
    cache.categories.push(newCategory);
    updateCache('categories', cache.categories);
    return newCategory;
  }
  const response = await api.post('/categories', category);
  updateCache('categories', [...cache.categories, response.data]);
  return response.data;
};

export const updateCategory = async (id, categoryName, userId) => {
  if (await isOffline()) {
    // Update category in cache
    cache.categories = cache.categories.map((c) =>
      c.id === id ? { ...c, name: categoryName } : c
    );
    // Update category name in flashcards
    cache.flashcards = cache.flashcards.map((f) =>
      f.userId === userId && f.category === cache.categories.find((c) => c.id === id).name
        ? { ...f, category: categoryName }
        : f
    );
    // Update category name in progress
    cache.progress = cache.progress.map((p) =>
      p.userId === userId && p.category === cache.categories.find((c) => c.id === id).name
        ? { ...p, category: categoryName }
        : p
    );
    updateCache('categories', cache.categories);
    updateCache('flashcards', cache.flashcards);
    updateCache('progress', cache.progress);
    return { id, name: categoryName, userId };
  }
  // Update category
  const response = await api.patch(`/categories/${id}`, { name: categoryName });
  // Update flashcards with new category name
  const flashcards = await api.get(`/flashcards?userId=${userId}&category=${encodeURIComponent(cache.categories.find((c) => c.id === id).name)}`);
  await Promise.all(
    flashcards.data.map((f) =>
      api.patch(`/flashcards/${f.id}`, { ...f, category: categoryName })
    )
  );
  // Update progress with new category name
  const progress = await api.get(`/progress?userId=${userId}&category=${encodeURIComponent(cache.categories.find((c) => c.id === id).name)}`);
  await Promise.all(
    progress.data.map((p) =>
      api.patch(`/progress/${p.id}`, { ...p, category: categoryName })
    )
  );
  updateCache('categories', cache.categories.map((c) => (c.id === id ? response.data : c)));
  updateCache('flashcards', cache.flashcards.map((f) =>
    f.userId === userId && f.category === cache.categories.find((c) => c.id === id).name
      ? { ...f, category: categoryName }
      : f
  ));
  updateCache('progress', cache.progress.map((p) =>
    p.userId === userId && p.category === cache.categories.find((c) => c.id === id).name
      ? { ...p, category: categoryName }
      : p
  ));
  return response.data;
};

export const deleteCategory = async (id, userId) => {
  if (await isOffline()) {
    const categoryName = cache.categories.find((c) => c.id === id)?.name;
    // Delete category
    cache.categories = cache.categories.filter((c) => c.id !== id);
    // Delete associated flashcards
    cache.flashcards = cache.flashcards.filter((f) => !(f.userId === userId && f.category === categoryName));
    // Delete associated progress
    cache.progress = cache.progress.filter((p) => !(p.userId === userId && p.category === categoryName));
    // Delete associated badges
    cache.badges = cache.badges.filter((b) => !(b.userId === userId && b.name.toLowerCase().includes(categoryName.toLowerCase())));
    updateCache('categories', cache.categories);
    updateCache('flashcards', cache.flashcards);
    updateCache('progress', cache.progress);
    updateCache('badges', cache.badges);
    return;
  }
  try {
    const categoryName = cache.categories.find((c) => c.id === id)?.name;
    // Fetch associated resources
    const [flashcards, progress, badges] = await Promise.all([
      api.get(`/flashcards?userId=${userId}&category=${encodeURIComponent(categoryName)}`).then((res) => res.data),
      api.get(`/progress?userId=${userId}&category=${encodeURIComponent(categoryName)}`).then((res) => res.data),
      api.get(`/badges?userId=${userId}`).then((res) => res.data.filter((b) => b.name.toLowerCase().includes(categoryName.toLowerCase()))),
    ]);
    // Delete resources
    await Promise.all([
      ...flashcards.map((f) => api.delete(`/flashcards/${f.id}`)),
      ...progress.map((p) => api.delete(`/progress/${p.id}`)),
      ...badges.map((b) => api.delete(`/badges/${b.id}`)),
      api.delete(`/categories/${id}`),
    ]);
    // Update cache
    cache.categories = cache.categories.filter((c) => c.id !== id);
    cache.flashcards = cache.flashcards.filter((f) => !(f.userId === userId && f.category === categoryName));
    cache.progress = cache.progress.filter((p) => !(p.userId === userId && p.category === categoryName));
    cache.badges = cache.badges.filter((b) => !(b.userId === userId && b.name.toLowerCase().includes(categoryName.toLowerCase())));
    updateCache('categories', cache.categories);
    updateCache('flashcards', cache.flashcards);
    updateCache('progress', cache.progress);
    updateCache('badges', cache.badges);
  } catch (error) {
    console.error('Error deleting category data:', error.message, error.response?.data);
    throw new Error('Failed to delete category');
  }
};

// Progress
export const getProgress = async (userId) => {
  if (await isOffline()) return cache.progress.filter((p) => p.userId === userId);
  const response = await api.get(`/progress?userId=${userId}`);
  updateCache('progress', response.data);
  return response.data;
};

export const saveProgress = async (progress) => {
  if (await isOffline()) {
    const newProgress = { ...progress, id: Date.now() };
    cache.progress.push(newProgress);
    updateCache('progress', cache.progress);
    return newProgress;
  }
  const response = await api.post('/progress', progress);
  updateCache('progress', [...cache.progress, response.data]);
  return response.data;
};

// Badges (for stretch functionality)
export const getBadges = async (userId) => {
  if (await isOffline()) return cache.badges.filter((b) => b.userId === userId);
  const response = await api.get(`/badges?userId=${userId}`);
  updateCache('badges', response.data);
  return response.data;
};

export const updateBadge = async (id, badge) => {
  if (await isOffline()) {
    cache.badges = cache.badges.map((b) => (b.id === id ? { ...b, ...badge } : b));
    updateCache('badges', cache.badges);
    return badge;
  }
  const response = await api.patch(`/badges/${id}`, badge);
  updateCache('badges', cache.badges.map((b) => (b.id === id ? response.data : b)));
  return response.data;
};

//users api create, update and get users
export const getUsers = async () => {
  if (await isOffline()) {
    // console.log('getUsers: Returning cached users', cache.users);
    return cache.users;
  }
  const response = await api.get('/users');
  // console.log('getUsers: Fetched users from API', response.data);
  updateCache('users', response.data);
  return response.data;
};

export const createUser = async (user) => {
  if (await isOffline()) {
    const newUser = { ...user, id: String(user.id || Date.now()), avatar: user.avatar || '' };
    // console.log('createUser: Adding to cache', newUser);
    cache.users.push(newUser);
    updateCache('users', cache.users);
    return newUser;
  }
  const response = await api.post('/users', { ...user, id: String(user.id), avatar: user.avatar || '' });
  // console.log('createUser: Added to API', response.data);
  updateCache('users', [...cache.users, response.data]);
  return response.data;
};

export const updateUser = async (id, user) => {
  if (await isOffline()) {
    cache.users = cache.users.map((u) => (u.id === id ? { ...u, ...user, avatar: user.avatar || '' } : u));
    updateCache('users', cache.users);
    return { ...user, avatar: user.avatar || '' };
  }
  const response = await api.patch(`/users/${id}`, { ...user, avatar: user.avatar || '' });
  updateCache('users', cache.users.map((u) => (u.id === id ? response.data : u)));
  return response.data;
};

//delete user
export const deleteUser = async (userId) => {
  if (await isOffline()) {
    cache.users = cache.users.filter((u) => u.id !== userId);
    cache.flashcards = cache.flashcards.filter((f) => f.userId !== userId);
    cache.progress = cache.progress.filter((p) => p.userId !== userId);
    cache.badges = cache.badges.filter((b) => b.userId !== userId);
    cache.categories = cache.categories.filter((c) => c.userId !== userId);
    updateCache('users', cache.users);
    updateCache('flashcards', cache.flashcards);
    updateCache('progress', cache.progress);
    updateCache('badges', cache.badges);
    updateCache('categories', cache.categories);
    return;
  }

  try {
    // Fetch all related resources
    const [flashcards, progress, badges, categories] = await Promise.all([
      api.get(`/flashcards?userId=${userId}`).then((res) => res.data),
      api.get(`/progress?userId=${userId}`).then((res) => res.data),
      api.get(`/badges?userId=${userId}`).then((res) => res.data),
      api.get(`/categories?userId=${userId}`).then((res) => res.data),
    ]);

    // Delete each resource individually
    await Promise.all([
      ...flashcards.map((f) => api.delete(`/flashcards/${f.id}`)),
      ...progress.map((p) => api.delete(`/progress/${p.id}`)),
      ...badges.map((b) => api.delete(`/badges/${b.id}`)),
      ...categories.map((c) => api.delete(`/categories/${c.id}`)),
      api.delete(`/users/${userId}`), // Delete user last
    ]);

    // Update cache after successful deletion
    cache.users = cache.users.filter((u) => u.id !== userId);
    cache.flashcards = cache.flashcards.filter((f) => f.userId !== userId);
    cache.progress = cache.progress.filter((p) => p.userId !== userId);
    cache.badges = cache.badges.filter((b) => b.userId !== userId);
    cache.categories = cache.categories.filter((c) => c.userId !== userId);
    updateCache('users', cache.users);
    updateCache('flashcards', cache.flashcards);
    updateCache('progress', cache.progress);
    updateCache('badges', cache.badges);
    updateCache('categories', cache.categories);
  } catch (error) {
    console.error('Error deleting user data:', error.message, error.response?.data);
    throw new Error('Failed to delete user account');
  }
};