import CategorySelector from '../components/CategorySelector';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Home page with category selection for logged-in users
function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Handle category selection and navigate to Flashcards page
  const handleSelect = (category) => {
    if (!category) {
      console.error('No category provided for navigation');
      return;
    }
    // template literal to navigate to the flashcards page for the selected category
    navigate(`/flashcards/${encodeURIComponent(category)}`);
  };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 dark:text-gray-100">
                Welcome {user.name} to FlashCards
                <CategorySelector onSelect={handleSelect} />
            </h1>
        </div>
    )
}

export default Home;