import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateFlashcard, deleteFlashcard } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import Card from './Card';
import { MoreVertical } from 'lucide-react';

// List of flashcards with edit, delete, and toggleable answers
function FlashcardList({ flashcards, onUpdate }) {
  const { user } = useAuth();
  const [editingId, setEditingId] = useState(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [error, setError] = useState('');
  const [showAnswers, setShowAnswers] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEdit = (flashcard) => {
    setEditingId(flashcard.id);
    setEditQuestion(flashcard.question);
    setEditAnswer(flashcard.answer);
    setOpenMenuId(null);
  };

  const handleSave = async (id) => {
    if (!editQuestion.trim() || !editAnswer.trim()) {
      setError('Fields cannot be empty');
      return;
    }
    try {
      await updateFlashcard(id, { question: editQuestion, answer: editAnswer });
      onUpdate();
      setEditingId(null);
      setError('');
    } catch {
      setError('Failed to update flashcard');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFlashcard(id);
      onUpdate();
      setOpenMenuId(null);
    } catch {
      setError('Failed to delete flashcard');
    }
  };

  const toggleAnswers = () => {
    setShowAnswers((prev) => !prev);
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 mb-4 text-center"
          aria-live="assertive"
        >
          {error}
        </motion.p>
      )}
      <div className="flex justify-end mb-4">
        <Button
          onClick={toggleAnswers}
          className="bg-accent text-white hover:bg-amber-600 flex items-center gap-2"
          ariaLabel={showAnswers ? 'Hide flashcard answers' : 'Show flashcard answers'}
        >
          {showAnswers ? 'Hide Answers' : 'Show Answers'}
        </Button>
      </div>
      <div className="space-y-4">
        {flashcards.map((flashcard) => (
          <Card key={flashcard.id}>
            {editingId === flashcard.id ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editQuestion}
                  onChange={(e) => setEditQuestion(e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                  aria-label="Edit flashcard question"
                />
                <input
                  type="text"
                  value={editAnswer}
                  onChange={(e) => setEditAnswer(e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                  aria-label="Edit flashcard answer"
                />
                <div className="flex gap-4">
                  <Button
                    onClick={() => handleSave(flashcard.id)}
                    className="bg-secondary text-white hover:bg-emerald-600"
                    ariaLabel="Save flashcard changes"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-300 text-gray-700 hover:bg-gray-400"
                    ariaLabel="Cancel flashcard edit"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="w-full">
                  <p className="font-semibold dark:text-gray-100">{flashcard.question}</p>
                  <AnimatePresence>
                    {showAnswers && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-gray-600 dark:text-gray-300 mt-2"
                      >
                        {flashcard.answer}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                {flashcard.userId === user.id ? (
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu(flashcard.id);
                      }}
                      className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-2 focus:ring-primary"
                      aria-label={`More options for flashcard: ${flashcard.question}`}
                      aria-expanded={openMenuId === flashcard.id}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleMenu(flashcard.id);
                        }
                      }}
                    >
                      <MoreVertical size={20} />
                    </button>
                    <AnimatePresence>
                      {openMenuId === flashcard.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 rounded-lg shadow-xl z-10"
                        >
                          <ul className="py-1">
                            <li>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(flashcard);
                                }}
                                className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600"
                                aria-label={`Edit flashcard: ${flashcard.question}`}
                              >
                                Edit
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(flashcard.id);
                                }}
                                className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                                aria-label={`Delete flashcard: ${flashcard.question}`}
                              >
                                Delete
                              </button>
                            </li>
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    Created by another user
                  </p>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

export default FlashcardList;

