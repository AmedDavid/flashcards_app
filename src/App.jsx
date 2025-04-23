import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
// import Landing from './pages/Landing';
import Home from './pages/Home';
// import Flashcards from './pages/Flashcards';
// import Quiz from './pages/Quiz';
// import Create from './pages/Create';
// import Progress from './pages/Progress';
// import SignUpPage from './pages/SignUpPage';
// import SignInPage from './pages/SignInPage';
// import ProfilePage from './pages/ProfilePage';

//since we have Auth we can protect our routs
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/signin" />;
}

function App() {
  const [isDarkMode, setIsDarkMode ] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  })

//TODO: update local storage
useEffect(() => {
  localStorage.setItem('darkMode', isDarkMode);
  document.documentElement.classList.toggle('dark', isDarkMode);
}, [isDarkMode]);

const toggleDarkMode = () => {
  setIsDarkMode((prev) => !prev);
};
  return (
    <AuthProvider>
      <div className='min-h-screen bg-gray-100 dark:bg-gray-800 transition-colors'>
        <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <main className='container mx-auto p-4'>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/flashcards/:category" element={<Flashcards />} />
            <Route path="/quiz/:category" element={<Quiz />} />
            <Route path="/create" element={<Create />} />
            <Route path="/progress" element={<Progress />} /> */}
          </Routes>
        </main>
    </div>
    </AuthProvider>
  )
};

export default App
