import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import QuizMode from '../components/QuizMode';
import { getFlashcards } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';

// Quiz page for a specific category
function Quiz() {
  const { user } = useAuth();
  const { category } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch flashcards
  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        setLoading(true);
        const data = await getFlashcards(user.id);
        const filtered = data.filter((f) => f.category === decodeURIComponent(category));
        setFlashcards(filtered);
        if (filtered.length === 0) {
          setError(`No flashcards found for category "${decodeURIComponent(category)}"`);
        }
      } catch {
        setError('Failed to load flashcards');
      } finally {
        setLoading(false);
      }
    };
    if (user && category) fetchFlashcards();
  }, [category, user]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen"
    >
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 dark:text-gray-100 text-center">
          {decodeURIComponent(category)} Quiz
        </h1>
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary mx-auto"></div>
          </div>
        ) : error ? (
          <Card className="text-center max-w-lg mx-auto">
            <p className="text-red-500 mb-4">{error}</p>
            <Button
              onClick={() => navigate('/home')}
              className="bg-primary text-white hover:bg-indigo-700"
              ariaLabel="Go back to home"
            >
              Back to Home
            </Button>
          </Card>
        ) : (
          <QuizMode flashcards={flashcards} category={decodeURIComponent(category)} />
        )}
      </div>
    </motion.div>
  );
}

export default Quiz;