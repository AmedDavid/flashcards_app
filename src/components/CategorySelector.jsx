import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import { MoreVertical } from 'lucide-react';

// Component to select, create, edit, and delete categories with card-based design
function CategorySelector({ onSelect }) {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const menuRef = useRef(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
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
    if (user) fetchCategories();
  }, [user]);

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

  // Handle category creation
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      setError('Category name cannot be empty');
      return;
    }
    if (categories.some((c) => c.name.toLowerCase() === newCategory.trim().toLowerCase())) {
      setError('Category already exists');
      return;
    }
    try {
      const category = await createCategory({ name: newCategory.trim(), userId: user.id });
      setCategories([...categories, category]);
      setNewCategory('');
      setError('');
      setSuccess('Category created successfully');
    } catch {
      setError('Failed to create category');
    }
  };

  // Handle start editing
  const handleEdit = (category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setOpenMenuId(null);
    setError('');
    setSuccess('');
  };

  // Handle save edit
  const handleSaveEdit = async (id) => {
    if (!editName.trim()) {
      setError('Category name cannot be empty');
      return;
    }
    if (categories.some((c) => c.id !== id && c.name.toLowerCase() === editName.trim().toLowerCase())) {
      setError('Category name already exists');
      return;
    }
    try {
      const updatedCategory = await updateCategory(id, editName.trim(), user.id);
      setCategories(categories.map((c) => (c.id === id ? updatedCategory : c)));
      setEditingId(null);
      setEditName('');
      setError('');
      setSuccess('Category updated successfully');
    } catch {
      setError('Failed to update category');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (deleteConfirmId !== id) {
      setDeleteConfirmId(id);
      setOpenMenuId(null);
      return;
    }
    try {
      await deleteCategory(id, user.id);
      setCategories(categories.filter((c) => c.id !== id));
      setDeleteConfirmId(null);
      setError('');
      setSuccess('Category and associated data deleted successfully');
    } catch {
      setError('Failed to delete category');
    }
  };

  // Handle category selection
  const handleSelect = (category) => {
    if (editingId || deleteConfirmId || openMenuId) return; // Prevent selection during edit/delete/menu
    onSelect(category);
  };

  // Toggle menu
  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
    setDeleteConfirmId(null); // Reset delete confirmation when opening menu
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 dark:text-gray-100">Your Categories</h2>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-red-500 mb-4 text-center"
            aria-live="assertive"
          >
            {error}
          </motion.p>
        )}
        {success && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-green-500 mb-4 text-center"
            aria-live="polite"
          >
            {success}
          </motion.p>
        )}
      </AnimatePresence>
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
              whileHover={{ scale: editingId === category.id ? 1 : 1.05 }}
              className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-shadow relative ${
                editingId === category.id || deleteConfirmId === category.id ? '' : 'cursor-pointer hover:shadow-xl'
              }`}
              onClick={() => handleSelect(category.name)}
              role="button"
              tabIndex={editingId || deleteConfirmId ? -1 : 0}
              aria-label={`Select ${category.name} category`}
              onKeyDown={(e) => e.key === 'Enter' && handleSelect(category.name)}
            >
              {editingId === category.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                    aria-label={`Edit category ${category.name}`}
                    autoFocus
                  />
                  <div className="flex gap-4">
                    <Button
                      onClick={() => handleSaveEdit(category.id)}
                      className="bg-secondary text-white hover:bg-emerald-600"
                      ariaLabel={`Save changes for category ${category.name}`}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-300 text-gray-700 hover:bg-gray-400"
                      ariaLabel={`Cancel editing category ${category.name}`}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold dark:text-gray-100">{category.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300">Study now</p>
                  </div>
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu(category.id);
                      }}
                      className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-2 focus:ring-primary"
                      aria-label={`More options for ${category.name} category`}
                      aria-expanded={openMenuId === category.id}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleMenu(category.id);
                        }
                      }}
                    >
                      <MoreVertical size={20} />
                    </button>
                    <AnimatePresence>
                      {openMenuId === category.id && (
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
                                  handleEdit(category);
                                }}
                                className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600"
                                aria-label={`Edit category ${category.name}`}
                              >
                                Edit
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(category.id);
                                }}
                                className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                                aria-label={`Delete category ${category.name}`}
                              >
                                Delete
                              </button>
                            </li>
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
              {deleteConfirmId === category.id && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-red-500 dark:text-red-300">
                    Are you sure? This will delete all associated flashcards and progress.
                  </p>
                  <div className="flex gap-4 mt-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(category.id);
                      }}
                      className="bg-red-500 text-white hover:bg-red-600"
                      ariaLabel={`Confirm deletion of category ${category.name}`}
                    >
                      Confirm
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(null);
                      }}
                      className="bg-gray-300 text-gray-700 hover:bg-gray-400"
                      ariaLabel={`Cancel deletion of category ${category.name}`}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
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
          className="flex-1 p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent"
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