import { useState } from 'react';
import { updateFlashcard, deleteFlashcard } from '../services/api';
import { useAuth } from '../context/AuthContext';

// List of flashcards with edit and delete options restricted to the creator
function FlashcardList({ flashcards, onUpdate }) {
  const { user } = useAuth();
  const [editingId, setEditingId] = useState(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [error, setError] = useState('');

  const handleEdit = (flashcard) => {
    setEditingId(flashcard.id);
    setEditQuestion(flashcard.question);
    setEditAnswer(flashcard.answer);
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
    } catch (err) {
      setError(err.message || 'Failed to update flashcard');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFlashcard(id);
      onUpdate();
    } catch (err) {
      setError(err.message || 'Failed to delete flashcard');
    }
  };

  return (
    <div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <ul className="space-y-4">
        {flashcards.map((flashcard) => (
          <li key={flashcard.id} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
            {editingId === flashcard.id ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={editQuestion}
                  onChange={(e) => setEditQuestion(e.target.value)}
                  className="p-2 border rounded dark:bg-gray-600 dark:text-gray-100"
                  aria-label="Edit question"
                />
                <input
                  type="text"
                  value={editAnswer}
                  onChange={(e) => setEditAnswer(e.target.value)}
                  className="p-2 border rounded dark:bg-gray-600 dark:text-gray-100"
                  aria-label="Edit answer"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(flashcard.id)}
                    className="bg-secondary text-white p-2 rounded hover:bg-emerald-600 transition"
                    aria-label="Save changes"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 transition"
                    aria-label="Cancel edit"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold dark:text-gray-100">{flashcard.question}</p>
                  <p className="text-gray-600 dark:text-gray-300">{flashcard.answer}</p>
                </div>
                {flashcard.userId === user.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(flashcard)}
                      className="bg-accent text-white p-2 rounded hover:bg-amber-600 transition"
                      aria-label={`Edit flashcard ${flashcard.question}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(flashcard.id)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
                      aria-label={`Delete flashcard ${flashcard.question}`}
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">Created by another user</p>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FlashcardList;