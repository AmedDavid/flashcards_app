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


//categories

//progress

//Badges

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
      cache.users = cache.users.map((u) => (u.id === id ? { ...u, ...user } : u));
      updateCache('users', cache.users);
      return user;
    }
    const response = await api.patch(`/users/${id}`, user);
    updateCache('users', cache.users.map((u) => (u.id === id ? response.data : u)));
    return response.data;
  };