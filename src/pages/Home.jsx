import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import CategorySelector from '../components/CategorySelector';
import CreateFlashcard from '../components/CreateFlashcard';
import { BookOpen, Zap, Plus } from 'lucide-react';
import Button from '../components/Button';
import { useEffect, useState } from 'react';
import { getFlashcards, getProgress } from '../services/api';

// Home page with enhanced design and animations
function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const error = location.state?.error;
  const [stats, setStats] = useState({ flashcards: 0, streak: 0 });

  // Fetch user stats (flashcards created, current streak)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const flashcards = await getFlashcards(user.id);
        const progress = await getProgress(user.id);
        let currentStreak = 0;
        for (let i = progress.length - 1; i >= 0; i--) {
          if (progress[i].correct) currentStreak++;
          else break;
        }
        setStats({ flashcards: flashcards.length, streak: currentStreak });
      } catch {
        console.error('Failed to load stats');
      }
    };
    if (user) fetchStats();
  }, [user]);

  // Handle category selection
  const handleSelect = (category) => {
    navigate(`/flashcards/${encodeURIComponent(category)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-16 bg-gradient-to-r from-primary to-secondary text-white"
      >
      <Helmet>
        <title>Your Study Dashboard - Flashcards</title>
        <meta name="description" content="Manage your categories and flashcards with Flashcards's intuitive dashboard." />
        <link rel="canonical" href="https://flashcards-app-steel.vercel.app/home" />
      </Helmet>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome, {user.name}, to Flashcards
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Master your learning with interactive flashcards. Create, study, and track your progress
            with ease!
          </p>
          {error && <p className="text-red-300 mb-4">{error}</p>}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/create')}
              className="bg-accent text-white hover:bg-amber-600"
              ariaLabel="Create a new flashcard"
            >
              <Plus className="inline mr-2" size={20} />
              Create Flashcard
            </Button>
            <Button
              onClick={() => navigate('/progress')}
              className="bg-white text-primary hover:bg-gray-100"
              ariaLabel="View your progress"
            >
              <Zap className="inline mr-2" size={20} />
              View Progress
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="container mx-auto px-4 py-12"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold dark:text-gray-100">
              {stats.flashcards} Flashcards Created
            </h3>
            <p className="text-gray-600 dark:text-gray-300">Keep building your knowledge base!</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <Zap className="w-12 h-12 mx-auto mb-4 text-secondary" />
            <h3 className="text-xl font-semibold dark:text-gray-100">
              {stats.streak} Correct Streak
            </h3>
            <p className="text-gray-600 dark:text-gray-300">Maintain your learning momentum!</p>
          </div>
        </div>
      </motion.section>

      {/* Categories Section */}
      <motion.section
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="container mx-auto px-4 py-12"
      >
        <h2 className="text-3xl font-bold mb-8 dark:text-gray-100 text-center">
          Explore Your Categories
        </h2>
        <CategorySelector onSelect={handleSelect} />
      </motion.section>

      {/* Quick Create Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="container mx-auto px-4 py-12 bg-gray-100 dark:bg-gray-800 rounded-lg"
      >
        <h2 className="text-3xl font-bold mb-8 dark:text-gray-100 text-center">
          Add a Flashcard Now
        </h2>
        <CreateFlashcard compact />
      </motion.section>
    </div>
  );
}

export default Home;