import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, createFlashcard } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

// Form to create a new flashcard, with compact mode for home page
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
    <div className={compact ? 'max-w-2xl mx-auto' : 'max-w-md mx-auto'}>
      {!compact && (
        <h2 className="text-2xl font-bold mb-6 dark:text-gray-100">Create Flashcard</h2>
      )}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium dark:text-gray-200">Question</label>
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
          <label className="block text-sm font-medium dark:text-gray-200">Answer</label>
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
          <label className="block text-sm font-medium dark:text-gray-200">Category</label>
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
    </div>
  );
}

export default CreateFlashcard;