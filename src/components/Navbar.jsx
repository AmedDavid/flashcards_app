import { NavLink, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut } from 'lucide-react'; //Icons
import { useAuth } from '../context/AuthContext';

// Navigation bar with dynamic links based on auth state
function Navbar({ isDarkMode, toggleDarkMode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logout clicked');
    logout();
    navigate('/');
  };

    // Function to conditionally apply classes for active/inactive links (to fix `activeClassName` error)
    const navLinkClass = ({ isActive }) =>
        isActive ? 'hover:underline underline' : 'hover:underline';

  return (
    <nav className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">FlashCards</h1>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
            {/* Pass the Nav Links */}
              <NavLink to="/home" className={navLinkClass}>
                Home
              </NavLink>
              <NavLink to="/create" className={navLinkClass}>
                Create
              </NavLink>
              <NavLink to="/quiz" className={navLinkClass}>
                Quiz
              </NavLink>
              <NavLink to="/progress" className={navLinkClass}>
                Progress
              </NavLink>
              <NavLink to="/profile" className={navLinkClass}>
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-indigo-700"
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
      </div>
    </nav>
  );
}

export default Navbar;