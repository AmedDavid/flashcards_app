import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
        const filtered = data.filter((f) => f.category === category);
        setFlashcards(filtered);
      } catch {
        setError('Failed to load flashcards');
      }
    };
    if (user) fetchFlashcards();
  }, [category, user]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 dark:text-gray-100">{category} Quiz</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <QuizMode flashcards={flashcards} category={category} />
    </div>
  );
}

export default Quiz;