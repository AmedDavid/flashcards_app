import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Flashcard from '../components/Flashcard';
import FlashcardList from '../components/FlashcardList';
import { getFlashcards } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Page to view and manage flashcards for a category
function Flashcards() {
  const { user } = useAuth();
  const { category } = useParams();
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch flashcards for the selected category and user
    const fetchFlashcards = async () => {
      try {
        const data = await getFlashcards(user.id);
        const filtered = data.filter((f) => f.category === category);
        setFlashcards(filtered);
      } catch {
        setError('Failed to load flashcards');
      }
    };
    if (user) fetchFlashcards();
  }, [category, user]);

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleUpdate = () => {
    // Refresh flashcards after edit/delete
    const fetchFlashcards = async () => {
      try {
        const data = await getFlashcards(user.id);
        const filtered = data.filter((f) => f.category === category);
        setFlashcards(filtered);
        if (currentIndex >= filtered.length) {
          setCurrentIndex(Math.max(0, filtered.length - 1));
        }
      } catch {
        setError('Failed to refresh flashcards');
      }
    };
    fetchFlashcards();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 dark:text-gray-100">{category} Flashcards</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {flashcards.length > 0 ? (
        <>
          <Flashcard
            flashcard={flashcards[currentIndex]}
            onNext={handleNext}
            onPrev={handlePrev}
            isFirst={currentIndex === 0}
            isLast={currentIndex === flashcards.length - 1}
          />
          <button
            onClick={() => navigate(`/quiz/${category}`)}
            className="mt-4 bg-secondary text-white p-2 rounded hover:bg-emerald-600 transition"
            aria-label={`Start quiz for ${category}`}
          >
            Start Quiz
          </button>
          <h2 className="text-xl font-semibold mt-8 mb-4 dark:text-gray-100">Manage Flashcards</h2>
          <FlashcardList flashcards={flashcards} onUpdate={handleUpdate} />
        </>
      ) : (
        <p className="text-gray-600 dark:text-gray-300">No flashcards found for this category.</p>
      )}
    </div>
  );
}

export default Flashcards;