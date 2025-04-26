import { getUsers, createUser } from './api';

// Auth the users
export const signIn = async (email, password) => {
  // console.log('signIn: Input credentials', { email, password });
  const users = await getUsers();
  // console.log('signIn: Fetched users', users);
  const user = users.find((u) => u.email.trim() === email.trim() && u.password === password);
  if (!user) {
    throw new Error('Invalid email or password');
  }
  return { id: String(user.id), name: user.name, email: user.email, avatar: user.avatar || '' };
};

export const signUp = async (name, email, password) => {
  const users = await getUsers();
  if (users.some((u) => u.email.trim() === email.trim())) {
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