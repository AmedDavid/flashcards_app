// Our API endpoints (json-server, cache, Flashcards, categories, progress)
import axios from 'axios';

// Api endpoint wth timeout
const api = axios.create({
    baseURL: 'http://localhost:3001',
    timeout: 5000,
})

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
      await axios.get('http://localhost:3001/users');
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


// Categories get and create
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
    if (await isOffline()) return cache.users;
    const response = await api.get('/users');
    updateCache('users', response.data);
    return response.data;
  };  

export const createUser = async (user) => {
    if (await isOffline()) {
        const newUser = { ...user, id: Date.now() };

        //get data from cache
        cache.user.push(newUser);
        updateCache('users', cache.users);
        return newUser;
    }

    //send the response
    const response = await api.post('/users', user);
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
  await Promise.all([
    api.delete(`/users/${userId}`),
    api.delete(`/flashcards?userId=${userId}`),
    api.delete(`/progress?userId=${userId}`),
    api.delete(`/badges?userId=${userId}`),
    api.delete(`/categories?userId=${userId}`)
  ]);
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
};