import { NavLink, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut } from 'lucide-react'; //Icons
import { useAuth } from '../context/AuthContext';

// Navigation bar with dynamic links based on auth state
function Navbar({ isDarkMode, toggleDarkMode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">FlashCards</h1>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
            {/* Pass the Nav Links */}
              <NavLink to="/home" className="hover:underline" activeClassName="underline">
                Home
              </NavLink>
              <NavLink to="/create" className="hover:underline" activeClassName="underline">
                Create
              </NavLink>
              <NavLink to="/quiz" className="hover:underline" activeClassName="underline">
                Quiz
              </NavLink>
              <NavLink to="/progress" className="hover:underline" activeClassName="underline">
                Progress
              </NavLink>
              <NavLink to="/profile" className="hover:underline" activeClassName="underline">
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
              <NavLink to="/signin" className="hover:underline" activeClassName="underline">
                Sign In
              </NavLink>
              <NavLink to="/signup" className="hover:underline" activeClassName="underline">
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