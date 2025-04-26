import React, { useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Auth context to manage user state
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    // Load the user from local storage
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData) => {
    setUser({ ...userData, avatar: userData.avatar || '' });
    localStorage.setItem('user', JSON.stringify({ ...userData, avatar: userData.avatar || '' }));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/'); // Redirect to landing page
  };

  const updateUser = (userData) => {
    setUser({ ...userData, avatar: userData.avatar || '' });
    localStorage.setItem('user', JSON.stringify({ ...userData, avatar: userData.avatar || '' }));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}