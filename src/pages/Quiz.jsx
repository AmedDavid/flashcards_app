import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import QuizMode from '../components/QuizMode';
import { getFlashcards } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';

// TODO: More information on this page

// Quiz page for a specific category
function Quiz() {
  const { user } = useAuth();
  const { category } = useParams();
  const navigate = useNavigate();
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
      <Helmet>
        <title>{category} Quiz - Flashcards</title>
        <meta name="description" content="Test your knowledge with a {category} quiz on Flashcards." />
        <link rel="canonical" href="https://flashcards-app-steel.vercel.app/quiz/{category}" />
      </Helmet>
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-xl mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">
            {decodeURIComponent(category)} Quiz
          </h1>
          <p className="mt-2 text-sm md:text-base">
            Challenge yourself and track your progress!
          </p>
        </div>
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading quiz...</p>
          </div>
        ) : error ? (
          <Card className="text-center max-w-lg mx-auto space-y-6">
            <h2 className="text-2xl font-bold dark:text-gray-100">Oops!</h2>
            <p className="text-red-500">{error}</p>
            <Button
              as={Link}
              to="/home"
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

