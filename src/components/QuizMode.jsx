import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { saveProgress, getBadges, updateBadge, getProgress } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import Card from './Card';

// Quiz mode with enhanced design, spaced repetition, and confetti
function QuizMode({ flashcards, category }) {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [showReview, setShowReview] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Timer for quiz duration
  useEffect(() => {
    if (!isComplete) {
      const timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isComplete]);

  // Implement Leitner system for spaced repetition
  const getNextFlashcard = () => {
    const incorrect = flashcards.filter((f) => {
      const progress = JSON.parse(localStorage.getItem('progress') || '[]');
      const lastAttempt = progress.find(
        (p) => p.flashcardId === f.id && p.userId === user.id && !p.correct
      );
      return lastAttempt;
    });
    return incorrect.length > 0 ? incorrect[0] : flashcards[currentIndex];
  };

  const currentFlashcard = getNextFlashcard();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) {
      setError('Please enter an answer');
      return;
    }

    const isCorrect = answer.toLowerCase() === currentFlashcard.answer.toLowerCase();
    setScore((prev) => (isCorrect ? prev + 1 : prev));

    if (!isCorrect) {
      setIncorrectAnswers((prev) => [
        ...prev,
        { flashcard: currentFlashcard, userAnswer: answer },
      ]);
    }

    // Save progress
    try {
      await saveProgress({
        flashcardId: currentFlashcard.id,
        userId: user.id,
        correct: isCorrect,
        category,
        timestamp: new Date().toISOString(),
      });

      // Check for Quiz Master badge
      const progress = await getProgress(user.id);
      const correctCount = progress.filter((p) => p.correct).length;
      if (correctCount >= 10) {
        const badges = await getBadges(user.id);
        const quizMaster = badges.find((b) => b.name === 'Quiz Master');
        if (quizMaster && !quizMaster.earned) {
          await updateBadge(quizMaster.id, { earned: true });
        }
      }
    } catch {
      setError('Failed to save progress');
    }

    setAnswer('');
    setError('');

    if (currentIndex + 1 < flashcards.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!currentFlashcard) {
    return (
      <Card className="text-center max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">No Flashcards Available</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          There are no flashcards for this quiz. Create some in the {category} category to get started!
        </p>
        <Button
          as={Link}
          to="/home"
          className="bg-primary text-white hover:bg-indigo-700"
          ariaLabel="Go back to home"
        >
          Back to Home
        </Button>
      </Card>
    );
  }

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={300}
          tweenDuration={5000}
        />
        <Card className="text-center max-w-lg mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-primary dark:text-indigo-300">Quiz Complete!</h2>
          <p className="text-lg text-gray-600 dark:text-gray-200">
            You scored <span className="font-semibold">{score}</span> out of{' '}
            <span className="font-semibold">{flashcards.length}</span> (
            {((score / flashcards.length) * 100).toFixed(1)}%)
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Time taken: <span className="font-semibold">{formatTime(timeElapsed)}</span>
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            {score === flashcards.length
              ? 'Perfect score! You’re a quiz master! 🎉'
              : 'Great effort! Review your mistakes to improve next time.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {incorrectAnswers.length > 0 && (
              <Button
                onClick={() => setShowReview(true)}
                className="bg-accent text-white hover:bg-amber-600"
                ariaLabel="Review incorrect answers"
              >
                Review Mistakes
              </Button>
            )}
            <Button
              onClick={() => window.location.reload()}
              className="bg-primary text-white hover:bg-indigo-700"
              ariaLabel="Restart quiz"
            >
              Restart Quiz
            </Button>
          </div>
        </Card>
        {showReview && (
          <Card className="mt-6 max-w-lg mx-auto space-y-6">
            <h3 className="text-2xl font-semibold text-center dark:text-gray-100">
              Review Your Mistakes
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Here’s what you got wrong. Study these to improve!
            </p>
            <div className="space-y-4">
              {incorrectAnswers.map(({ flashcard, userAnswer }, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <p className="font-semibold dark:text-gray-100">
                    Question: {flashcard.question}
                  </p>
                  <p className="text-red-500">Your Answer: {userAnswer}</p>
                  <p className="text-secondary font-medium">
                    Correct Answer: {flashcard.answer}
                  </p>
                </motion.div>
              ))}
            </div>
            <Button
              onClick={() => setShowReview(false)}
              className="w-full bg-gray-300 text-gray-700 hover:bg-gray-400"
              ariaLabel="Close review"
            >
              Close Review
            </Button>
          </Card>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <Card className="w-full max-w-lg space-y-6">
        <div className="bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-t-xl">
          <h2 className="text-2xl font-bold text-center">{category} Quiz</h2>
          <p className="text-center text-sm mt-1">
            Test your knowledge with these flashcards. Type your answer below!
          </p>
        </div>
        <div className="px-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600 dark:text-gray-300 font-semibold">
              Score: {score} / {flashcards.length}
            </p>
            <p className="text-gray-600 dark:text-gray-300">{formatTime(timeElapsed)}</p>
          </div>
          <motion.div
            className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mb-6"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="bg-primary h-3 rounded-full"
              style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
            ></motion.div>
          </motion.div>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-2">
            Question {currentIndex + 1} of {flashcards.length}
          </p>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-center mb-4"
            >
              {error}
            </motion.p>
          )}
          <AnimatePresence mode="wait">
            <motion.p
              key={currentFlashcard.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="text-lg font-medium text-center dark:text-gray-100 mb-4"
            >
              {currentFlashcard.question}
            </motion.p>
          </AnimatePresence>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here"
              className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent transition"
              aria-label="Quiz answer input"
              autoFocus
            />
            <Button
              type="submit"
              className="w-full bg-secondary text-white hover:bg-emerald-600 text-lg font-semibold py-3"
              ariaLabel="Submit quiz answer"
            >
              Submit Answer
            </Button>
          </form>
        </div>
      </Card>
    </motion.div>
  );
}

export default QuizMode;

// This code is a React component for a quiz mode in a flashcard application. It includes features like spaced repetition, confetti on completion, and a review of incorrect answers. The component uses hooks for state management and effects, and it integrates with an API to save progress and check for badges.
// The design is enhanced with animations using Framer Motion and a responsive layout. The component also includes error handling and user feedback for a better user experience.




