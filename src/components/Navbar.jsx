import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

// Navigation bar with enhanced animations and accessibility
function Navbar({ isDarkMode, toggleDarkMode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle logo click
  const handleLogoClick = () => {
    navigate(user ? '/home' : '/');
    setIsMenuOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // NavLink styling
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
      isActive
        ? 'bg-indigo-700 text-white font-semibold'
        : 'text-white hover:bg-indigo-700 hover:text-white'
    }`;

  return (
    <nav className="bg-primary text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleLogoClick}
          className="text-2xl font-bold"
          aria-label="Go to home or landing page"
        >
          FLashCards
        </motion.button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <NavLink to="/home" className={navLinkClass} aria-label="Home page">
                Home
              </NavLink>
              <NavLink to="/create" className={navLinkClass} aria-label="Create flashcard">
                Create
              </NavLink>
              <NavLink to="/progress" className={navLinkClass} aria-label="Progress page">
                Progress
              </NavLink>
              <NavLink to="/profile" className={navLinkClass} aria-label="Profile page">
                Profile
              </NavLink>
              <Button
                onClick={handleLogout}
                className="bg-transparent hover:bg-indigo-700"
                ariaLabel="Log out"
              >
                <LogOut size={20} />
              </Button>
            </>
          ) : (
            <>
              <NavLink to="/signin" className={navLinkClass} aria-label="Sign in">
                Sign In
              </NavLink>
              <NavLink to="/signup" className={navLinkClass} aria-label="Sign up">
                Sign Up
              </NavLink>
            </>
          )}
          <Button
            onClick={toggleDarkMode}
            className="bg-transparent hover:bg-indigo-700"
            ariaLabel={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          className="md:hidden bg-transparent hover:bg-indigo-700"
          onClick={toggleMenu}
          ariaLabel={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
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
            <div className="container mx-auto py-4 flex flex-col gap-4">
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
                  <Button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-white hover:bg-indigo-700"
                    ariaLabel="Log out"
                  >
                    <LogOut size={20} />
                    Log Out
                  </Button>
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
              <Button
                onClick={toggleDarkMode}
                className="flex items-center gap-2 text-white hover:bg-indigo-700"
                ariaLabel={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;