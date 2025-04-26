import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCategories, createCategory } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

// Component to select or create categories with card-based design
function CategorySelector({ onSelect }) {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        const data = await getCategories(user.id);
        setCategories(data);
      } catch {
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchCategorias();
  }, [user]);

  // Handle category creation
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

  // Handle category selection
  const handleSelect = (category) => {
    onSelect(category);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 dark:text-gray-100">Your Categories</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-primary mx-auto"></div>
        </div>
      ) : categories.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300 text-center">
          No categories yet. Create one below!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => handleSelect(category.name)}
              role="button"
              tabIndex={0}
              aria-label={`Select ${category.name} category`}
              onKeyDown={(e) => e.key === 'Enter' && handleSelect(category.name)}
            >
              <h3 className="text-lg font-semibold dark:text-gray-100">{category.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">Study now</p>
            </motion.div>
          ))}
        </div>
      )}
      <form onSubmit={handleCreate} className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          className="flex-1 p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-primary"
          aria-label="New category name"
        />
        <Button
          type="submit"
          className="bg-accent text-white hover:bg-amber-600"
          ariaLabel="Create category"
        >
          Add Category
        </Button>
      </form>
    </div>
  );
}

export default CategorySelector;