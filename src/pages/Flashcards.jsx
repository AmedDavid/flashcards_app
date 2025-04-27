import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Flashcard from '../components/Flashcard';
import FlashcardList from '../components/FlashcardList';
import { getFlashcards, getProgress } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';

// Page to view and manage flashcards for a category
function Flashcards() {
  const { user } = useAuth();
  const { category } = useParams();
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, completion: 0 });
  const [sortBy, setSortBy] = useState('default');

  // Fetch flashcards and stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getFlashcards(user.id);
        const filtered = data.filter((f) => f.category === decodeURIComponent(category));
        const progress = await getProgress(user.id);
        const categoryProgress = progress.filter(
          (p) => p.category === decodeURIComponent(category)
        );
        const completed = new Set(categoryProgress.map((p) => p.flashcardId)).size;
        setStats({
          total: filtered.length,
          completion: filtered.length > 0 ? (completed / filtered.length) * 100 : 0,
        });

        // Sort flashcards
        let sortedFlashcards = [...filtered];
        if (sortBy === 'difficulty') {
          sortedFlashcards.sort((a, b) => a.difficulty - b.difficulty);
        } else if (sortBy === 'recent') {
          sortedFlashcards.sort(
            (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
          );
        }
        setFlashcards(sortedFlashcards);
        if (filtered.length === 0) {
          setError(`No flashcards found for category "${decodeURIComponent(category)}"`);
        }
      } catch {
        setError('Failed to load flashcards');
      } finally {
        setLoading(false);
      }
    };
    if (user && category) fetchData();
  }, [category, user, sortBy]);

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
    const fetchFlashcards = async () => {
      try {
        const data = await getFlashcards(user.id);
        const filtered = data.filter((f) => f.category === decodeURIComponent(category));
        let sortedFlashcards = [...filtered];
        if (sortBy === 'difficulty') {
          sortedFlashcards.sort((a, b) => a.difficulty - b.difficulty);
        } else if (sortBy === 'recent') {
          sortedFlashcards.sort(
            (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
          );
        }
        setFlashcards(sortedFlashcards);
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen"
    >
      <Helmet>
        <title>{`${decodeURIComponent(category)} Flashcards`}</title>
        <meta
          name="description"
          content={`Study and manage ${decodeURIComponent(category)} flashcards with Flashcards. Track progress and master your subject.`}
        />
        <meta name="keywords" content={`${decodeURIComponent(category)}, flashcards, study, learning`} />
        <link rel="canonical" href={`https://flashcards-app-steel.vercel.app/${encodeURIComponent(category)}`} />
      </Helmet>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 dark:text-gray-100 text-center">
          {decodeURIComponent(category)} Flashcards
        </h1>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 mb-4 text-center"
          >
            {error}
          </motion.p>
        )}
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary mx-auto"></div>
          </div>
        ) : (
          <>
            {/* Stats Summary */}
            <Card className="mb-8 max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">Category Stats</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold dark:text-gray-100">
                    Total Flashcards: {stats.total}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Number of flashcards in this category
                  </p>
                </div>
                <div>
                  <p className="font-semibold dark:text-gray-100">
                    Completion: {stats.completion.toFixed(1)}%
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Percentage of flashcards attempted
                  </p>
                </div>
              </div>
            </Card>

            {/* Sort Options */}
            <div className="flex justify-end mb-6">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-primary"
                aria-label="Sort flashcards"
              >
                <option value="default">Default</option>
                <option value="difficulty">Difficulty</option>
                <option value="recent">Most Recent</option>
              </select>
            </div>

            {/* Flashcard Viewer */}
            {flashcards.length > 0 ? (
              <>
                <Flashcard
                  flashcard={flashcards[currentIndex]}
                  onNext={handleNext}
                  onPrev={handlePrev}
                  isFirst={currentIndex === 0}
                  isLast={currentIndex === flashcards.length - 1}
                />
                <div className="flex justify-center gap-4 mt-6">
                  <Button
                    onClick={() => navigate(`/quiz/${encodeURIComponent(category)}`)}
                    className="bg-secondary text-white hover:bg-emerald-600"
                    ariaLabel={`Start quiz for ${decodeURIComponent(category)}`}
                  >
                    Start Quiz
                  </Button>
                  <Button
                    onClick={() => navigate('/home')}
                    className="bg-gray-300 text-gray-700 hover:bg-gray-400"
                    ariaLabel="Back to home"
                  >
                    Back to Home
                  </Button>
                </div>
                <h2 className="text-2xl font-semibold mt-12 mb-6 dark:text-gray-100">
                  Manage Flashcards
                </h2>
                <FlashcardList flashcards={flashcards} onUpdate={handleUpdate} />
              </>
            ) : (
              <Card className="text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  No flashcards found for this category.
                </p>
                <Button
                  onClick={() => navigate('/create')}
                  className="mt-4 bg-primary text-white hover:bg-indigo-700"
                  ariaLabel="Create a new flashcard"
                >
                  Create One Now
                </Button>
              </Card>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

export default Flashcards;


