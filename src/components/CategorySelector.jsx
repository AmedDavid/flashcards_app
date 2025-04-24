import { useState, useEffect } from 'react';
import { getCategories, createCategory } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Component to select or create categories
function CategorySelector({ onSelect }) {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch categories for the logged-in user
    const fetchCategories = async () => {
      try {
        const data = await getCategories(user.id);
        setCategories(data);
      } catch {
        setError('Failed to load categories');
      }
    };
    if (user) fetchCategories();
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      setError('Category name cannot be empty');
      return;
    }
    try {
      const category = await createCategory({ name: newCategory, userId: user.id });
      setCategories([...categories, category]);
      setNewCategory('');
      setError('');
    } catch {
      setError('Failed to create category');
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2 dark:text-gray-100">Categories</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.name)}
            className="bg-secondary text-white p-4 rounded-lg hover:bg-emerald-600 transition"
            aria-label={`Select ${category.name} category`}
          >
            {category.name}
          </button>
        ))}
      </div>
      <form onSubmit={handleCreate} className="flex gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          className="flex-1 p-2 border rounded dark:bg-gray-600 dark:text-gray-100"
          aria-label="New category name"
        />
        <button
          type="submit"
          className="bg-accent text-white p-2 rounded hover:bg-amber-600 transition"
          aria-label="Create category"
        >
          Add
        </button>
      </form>
    </div>
  );
}

export default CategorySelector;