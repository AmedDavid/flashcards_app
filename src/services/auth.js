import { getUsers, createUser } from './api';

//Auth the users
export const signIn = async (email, password) => {
    const users = await getUsers();
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    return { id: user.id, name: user.name, email: user.email, avatar: user.avatar || '' };
  };
  
  export const signUp = async (name, email, password) => {
    const users = await getUsers();
    if (users.some((u) => u.email === email)) {
      throw new Error('Email already exists');
    }
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      avatar: '',
    };
    await createUser(newUser);
    return { id: newUser.id, name: newUser.name, email: newUser.email, avatar: newUser.avatar };
  };