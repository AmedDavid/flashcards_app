import { getUsers, createUser } from './api';

//Auth the users
export const signIn = async (email, password) => {
    const users = await getUsers();
    const user = users.find((u) => u.email === email && u.password === password);

    //check validity
    if (!user) {
        throw new Error('Invalid Email or password. Try Again!');
    }
    return user;
};

//createUser
export const signUp = async (name, email, password) => {
    const users = await getUsers();
    //check if email is valid
    if (users.find((u) => u.email === email)) {
        throw new Error('Email already exists. Try another one!');
    }
    const user = await createUser({ name, email, password });
    return user;
};
