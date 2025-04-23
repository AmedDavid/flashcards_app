import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Home from './pages/Home';
// import Flashcards from './pages/Flashcards';
// import Quiz from './pages/Quiz';
// import Create from './pages/Create';
// import Progress from './pages/Progress';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
// import ProfilePage from './pages/ProfilePage';

// Protected route component for authenticated users
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/signin" />;
}

// Main app component with dark mode and authentication (in progress)
function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-800 transition-colors">
        <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Landing />} />
            {/* pass sigin and signup pages */}
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            {/* other routes */}
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;