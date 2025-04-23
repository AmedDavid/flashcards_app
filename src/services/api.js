// Our API endpoints (json-server, cache, Flashcards, categories, progress)
import axios from 'axios';

// Api endpoint wth timeout
const api = axios.create({
    baseURL: 'http://localhost:3001',
    timeout: 5000,
})

//cache


//offline mode
const isOffline = async () => {
    try {
        await axios.get('http://localhost:3001/ping');
        return false;
    } catch {
        return true;
    }
}

//users api
export const getUsers = async () => {
    if (await isOffline()) return cache.users;
    const response = await api.get('/users')
    updateCache('users', response.data);
    return response.data;
};