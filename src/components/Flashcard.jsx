import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Single flashcard with flip animation (test)
function Flashcard({ flashcard, onNext, onPrev, isFirst, isLast }) {
  const [showAnswer, setShowAnswer] = useState(false);

  const handleFlip = () => {
    setShowAnswer(!showAnswer);
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="w-full max-w-md bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg cursor-pointer"
        onClick={handleFlip}
        animate={{ rotateY: showAnswer ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ perspective: 1000 }}
        role="button"
        aria-label={showAnswer ? 'Show question' : 'Show answer'}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={showAnswer ? 'answer' : 'question'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">
              {showAnswer ? 'Answer' : 'Question'}
            </h3>
            <p className="text-gray-700 dark:text-gray-200">
              {showAnswer ? flashcard.answer : flashcard.question}
            </p>
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <div className="flex gap-4 mt-4">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="bg-gray-300 text-gray-700 p-2 rounded disabled:opacity-50 hover:bg-gray-400 transition"
          aria-label="Previous flashcard"
        >
          Previous
        </button>
        
        <button
          onClick={onNext}
          disabled={isLast}
          className="bg-primary text-white p-2 rounded disabled:opacity-50 hover:bg-indigo-700 transition"
          aria-label="Next flashcard"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Flashcard;