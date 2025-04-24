import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

// Navigation bar with dynamic links based on auth state
function Navbar({ isDarkMode, toggleDarkMode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle logo click based on auth status
  const handleLogoClick = () => {
    navigate(user ? '/home' : '/');
  };

  // Handle logout
  const handleLogout = () => {
    // console.log('Logout clicked');
    logout();
    navigate('/');
    setIsMenuOpen(false); // Close menu on logout
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

    // Function to conditionally apply classes for active/inactive links (to fix `activeClassName` error)
    const navLinkClass = ({ isActive }) =>
      isActive
        ? 'text-white font-semibold underline underline-offset-4'
        : 'text-white hover:text-indigo-200 transition-colors';

  return (
    <nav className="bg-primary text-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Title */}
        <button
          onClick={handleLogoClick}
          className="text-2xl font-bold cursor-pointer hover:text-indigo-200 transition-colors"
          aria-label="Go to home or landing page"
        >
          FlashCards
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
            {/* Pass the Nav Links */}
              <NavLink to="/home" className={navLinkClass}>
                Home
              </NavLink>
              <NavLink to="/create" className={navLinkClass}>
                Create
              </NavLink>
              <NavLink to="/progress" className={navLinkClass}>
                Progress
              </NavLink>
              <NavLink to="/profile" className={navLinkClass}>
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-indigo-700 transition-colors"
                aria-label="Log out"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
            {/* // Sign-in/signup links */}
              <NavLink to="/signin" className={navLinkClass}>
                Sign In
              </NavLink>
              <NavLink to="/signup" className={navLinkClass}>
                Sign Up
              </NavLink>
            </>
          )}
        <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-indigo-700"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-indigo-700 transition-colors"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-primary overflow-hidden"
          >
            <div className="container mx-auto py-4 flex flex-col space-y-4">
              {user ? (
                <>
                  <NavLink
                    to="/home"
                    className={navLinkClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </NavLink>
                  <NavLink
                    to="/create"
                    className={navLinkClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Create
                  </NavLink>
                  <NavLink
                    to="/quiz"
                    className={navLinkClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Quiz
                  </NavLink>
                  <NavLink
                    to="/progress"
                    className={navLinkClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Progress
                  </NavLink>
                  <NavLink
                    to="/profile"
                    className={navLinkClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-white hover:text-indigo-200 transition-colors"
                    aria-label="Log out"
                  >
                    <LogOut size={20} className="mr-2" />
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/signin"
                    className={navLinkClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className={navLinkClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </NavLink>
                </>
              )}
              <button
                onClick={toggleDarkMode}
                className="flex items-center text-white hover:text-indigo-200 transition-colors"
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <>
                    <Sun size={20} className="mr-2" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon size={20} className="mr-2" />
                    Dark Mode
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;