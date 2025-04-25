import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import QuizMode from '../components/QuizMode';
import { getFlashcards } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Quiz page for a specific category
function Quiz() {
  const { user } = useAuth();
  const { category } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch flashcards for the quiz
    const fetchFlashcards = async () => {
      try {
        const data = await getFlashcards(user.id);
        const filtered = data.filter((f) => f.category === decodeURIComponent(category));
        setFlashcards(filtered);
        if (filtered.length === 0) {
          setError(`No flashcards found for category "${decodeURIComponent(category)}"`);
        }
      } catch {
        setError('Failed to load flashcards');
      }
    };
    if (user && category) fetchFlashcards();
  }, [category, user]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 dark:text-gray-100">{decodeURIComponent(category)} Quiz</h1>
      {error ? (
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link
            to="/home"
            className="bg-primary text-white p-2 rounded hover:bg-indigo-700 transition"
            aria-label="Go back to home"
          >
            Back to Home
          </Link>
        </div>
      ) : (
        <QuizMode flashcards={flashcards} category={decodeURIComponent(category)} />
      )}
    </div>
  );
}

export default Quiz;