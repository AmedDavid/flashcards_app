import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { saveProgress, getBadges, updateBadge, getProgress } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import Card from './Card';

// Quiz mode with spaced repetition, progress bar, and confetti
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
      <Card className="text-center">
        <p className="text-gray-600 dark:text-gray-300">
          No flashcards available for this quiz.
        </p>
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
          numberOfPieces={200}
        />
        <Card className="text-center max-w-lg mx-auto">
          <h2 className="text-3xl font-bold mb-4 dark:text-gray-100">Quiz Complete!</h2>
          <p className="text-lg mb-4 dark:text-gray-200">
            Your score: {score} / {flashcards.length} (
            {((score / flashcards.length) * 100).toFixed(1)}%)
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Time taken: {formatTime(timeElapsed)}
          </p>
          {incorrectAnswers.length > 0 && (
            <Button
              onClick={() => setShowReview(true)}
              className="bg-accent text-white hover:bg-amber-600 mb-4"
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
        </Card>
        {showReview && (
          <Card className="mt-6 max-w-lg mx-auto">
            <h3 className="text-xl font-semibold mb-4 dark:text-gray-100">
              Incorrect Answers
            </h3>
            <div className="space-y-4">
              {incorrectAnswers.map(({ flashcard, userAnswer }, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="font-semibold dark:text-gray-100">
                    Q: {flashcard.question}
                  </p>
                  <p className="text-red-500">Your Answer: {userAnswer}</p>
                  <p className="text-secondary">Correct Answer: {flashcard.answer}</p>
                </div>
              ))}
            </div>
            <Button
              onClick={() => setShowReview(false)}
              className="mt-4 bg-gray-300 text-gray-700 hover:bg-gray-400"
              ariaLabel="Close review"
            >
              Close
            </Button>
          </Card>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <Card className="w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold dark:text-gray-100">{category} Quiz</h2>
          <p className="text-gray-600 dark:text-gray-300">{formatTime(timeElapsed)}</p>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mb-6">
          <div
            className="bg-primary h-2.5 rounded-full"
            style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
          ></div>
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 mb-4"
          >
            {error}
          </motion.p>
        )}
        <p className="text-lg mb-4 dark:text-gray-200">{currentFlashcard.question}</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer"
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-primary mb-4"
            aria-label="Quiz answer"
          />
          <Button
            type="submit"
            className="w-full bg-secondary text-white hover:bg-emerald-600"
            ariaLabel="Submit answer"
          >
            Submit
          </Button>
        </form>
        <p className="mt-4 text-gray-600 dark:text-gray-300 text-center">
          Question {currentIndex + 1} of {flashcards.length}
        </p>
      </Card>
    </motion.div>
  );
}

export default QuizMode;