import { NavLink } from "react-router-dom";
import { Sun, Moon } from 'lucide-react'; //for changing modes

//dark and Light modes
function Navbar({ isDarkMode, toggleDarkMode }) {
    return (
        <nav className="bg-primary text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">FlashCards</h1>
                <div className="flex items-center space-x-4">
                    <NavLink to="/" className="hover:underline">
                        Home
                    </NavLink>
                    <NavLink to="/create" className="hover:underline">
                        Create
                    </NavLink>
                    <NavLink to="/quiz" className="hover:underline">
                        Quiz
                    </NavLink>
                    <NavLink to="/progress" className="hover:underline">
                        Progress
                    </NavLink>
                    <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full hover:bg-indigo-700"
                    arial-label={isDarkMode ? 'Switch to light mode': 'Switch to dark mode'}
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </div>
        </nav>
    )
};

export default Navbar;