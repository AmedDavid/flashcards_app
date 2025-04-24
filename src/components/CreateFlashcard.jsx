import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, createFlashcard } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Form to create a new flashcard
function CreateFlashcard() {
  const { user } = useAuth();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories for the logged-in user
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



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim() || !category) {
      setError('All fields are required');
      return;
    }

    try {
      await createFlashcard({ question, answer, category, userId: user.id, difficulty: 1 });
      navigate('/home');
    } catch {
      setError('Failed to create flashcard');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">Create Flashcard</h2>
      {/* display form errors */}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium dark:text-gray-200">Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-600 dark:text-gray-100"
            aria-label="Flashcard question"
          />
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-gray-200">Answer</label>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-600 dark:text-gray-100"
            aria-label="Flashcard answer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-gray-200">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-600 dark:text-gray-100"
            aria-label="Flashcard category"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded hover:bg-indigo-700 transition"
          aria-label="Create flashcard"
        >
          Create
        </button>
      </form>
    </div>
  );
}

export default CreateFlashcard;