import { useLocation } from 'react-router-dom';
import CategorySelector from '../components/CategorySelector';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Home page with category selection for logged-in users
function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const error = location.state?.error;

  // Handle category selection and navigate to Flashcards page
  const handleSelect = (category) => {
    navigate(`/flashcards/${encodeURIComponent(category)}`);
  };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 dark:text-gray-100">
                Welcome {user.name} to FlashCards
                {/* Pass the errors */}
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <CategorySelector onSelect={handleSelect} />
            </h1>
        </div>
    )
}

export default Home;