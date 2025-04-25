import { useState, useEffect } from 'react';
import { saveProgress, getBadges, updateBadge } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Quiz mode with spaced repetition and badge awards (stretch  function)
function QuizMode({ flashcards, category }) {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  // Implement Leitner system for spaced repetition (testing)
  const getNextFlashcard = () => {
    const incorrect = flashcards.filter((f) => {
      const progress = JSON.parse(localStorage.getItem('progress') || '[]');
      const lastAttempt = progress.find((p) => p.flashcardId === f.id && p.userId === user.id && !p.correct);
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

    // Save progress of the current quiz
    try {
      await saveProgress({
        flashcardId: currentFlashcard.id,
        userId: user.id,
        correct: isCorrect,
        timestamp: new Date().toISOString(),
      });

      // Check for badge
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

  if (!currentFlashcard) {
    return <p className="text-center text-gray-600 dark:text-gray-300">No flashcards available</p>;
  }

  if (isComplete) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">Quiz Complete!</h2>
        <p className="text-lg mb-4 dark:text-gray-200">
          Your score: {score} / {flashcards.length}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary text-white p-2 rounded hover:bg-indigo-700 transition"
          aria-label="Restart quiz"
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">{category} Quiz</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg w-full max-w-md">
        <p className="text-lg mb-4 dark:text-gray-200">{currentFlashcard.question}</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer"
            className="w-full p-2 border rounded mb-4 dark:bg-gray-600 dark:text-gray-100"
            aria-label="Quiz answer"
          />
          <button
            type="submit"
            className="bg-secondary text-white p-2 rounded hover:bg-emerald-600 transition"
            aria-label="Submit answer"
          >
            Submit
          </button>
        </form>
      </div>
      <p className="mt-4 dark:text-gray-300">
        Question {currentIndex + 1} of {flashcards.length}
      </p>
    </div>
  );
}

export default QuizMode;