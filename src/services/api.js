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

//users api create and get users
export const getUsers = async () => {
    if (await isOffline()) return cache.users;
    const response = await api.get('/users')
    updateCache('users', response.data);
    return response.data;
};

const createUser = async (user) => {
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
}