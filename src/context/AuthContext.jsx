import React, { useState, createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Initialize auth state from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData) => {
    const authenticatedUser = {
      ...userData,
      isAuthenticated: true
    };
    setUser(authenticatedUser);
    localStorage.setItem('user', JSON.stringify(authenticatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        currentUser: user, // Alias for compatibility
        login, 
        logout, 
        updateUser,
        isAuthenticated: !!user?.isAuthenticated // Explicit auth check
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}