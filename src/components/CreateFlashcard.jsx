import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCategories, createFlashcard } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import Card from './Card';

// Form to create a new flashcard with preview and tips
function CreateFlashcard({ compact = false }) {
  const { user } = useAuth();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories(user.id);
        setCategories(data);
        if (data.length > 0) setCategory(data[0].name);
      } catch {
        setError('Failed to load categories');
      }
    };
    if (user) fetchCategories();
  }, [user]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim() || !category) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    try {
      await createFlashcard({ question, answer, category, userId: user.id, difficulty: 1 });
      setQuestion('');
      setAnswer('');
      setError('');
      if (!compact) navigate('/home');
    } catch {
      setError('Failed to create flashcard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={compact ? 'max-w-2xl mx-auto' : 'max-w-4xl mx-auto'}
    >
      {!compact && (
        <h2 className="text-3xl font-bold mb-8 dark:text-gray-100 text-center">
          Create a New Flashcard
        </h2>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <Card className="space-y-6">
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500"
            >
              {error}
            </motion.p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium dark:text-gray-200 mb-1">
                Question
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your question"
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-primary"
                aria-label="Flashcard question"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-gray-200 mb-1">
                Answer
              </label>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter the answer"
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-primary"
                aria-label="Flashcard answer"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-gray-200 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-primary"
                aria-label="Flashcard category"
                disabled={loading}
              >
                {categories.length === 0 ? (
                  <option value="">No categories available</option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <Button
              type="submit"
              className="w-full bg-primary text-white hover:bg-indigo-700"
              ariaLabel="Create flashcard"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Flashcard'}
            </Button>
          </form>
        </Card>

        {/* Preview and Tips */}
        {!compact && (
          <div className="space-y-6">
            <Card ariaLabel="Flashcard preview">
              <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Preview</h3>
              {question || answer ? (
                <div className="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg">
                  <p className="font-semibold dark:text-gray-100">
                    Q: {question || 'Your question'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    A: {answer || 'Your answer'}
                  </p>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">
                  Enter details to see a preview
                </p>
              )}
            </Card>
            <Card ariaLabel="Flashcard creation tips">
              <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">
                Tips for Effective Flashcards
              </h3>
              <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-2">
                <li>Keep questions concise and focused.</li>
                <li>Use clear, memorable answers.</li>
                <li>Group related flashcards into categories.</li>
                <li>Review regularly to reinforce learning.</li>
              </ul>
            </Card>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default CreateFlashcard;