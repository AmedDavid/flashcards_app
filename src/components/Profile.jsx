import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { updateUser as updateUserApi, getFlashcards, getProgress, getBadges, deleteUser } from '../services/api';
import Button from './Button';
import Card from './Card';
import { User, Award, Trash2 } from 'lucide-react';

// Profile component with stats, badges, and settings
function Profile() {
  const { user, updateUser: updateUserContext, logout } = useAuth();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ flashcards: 0, quizzes: 0 });
  const [badges, setBadges] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Fetch user stats and badges
  useEffect(() => {
    const fetchData = async () => {
      try {
        const flashcards = await getFlashcards(user.id);
        const progress = await getProgress(user.id);
        const badgesData = await getBadges(user.id);
        setStats({
          flashcards: flashcards.length,
          quizzes: new Set(progress.map((p) => p.category)).size,
        });
        setBadges(badgesData.filter((b) => b.earned));
      } catch {
        setError('Failed to load stats or badges');
      }
    };
    if (user) fetchData();
  }, [user]);

  // Handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required');
      return;
    }
    setLoading(true);
    try {
      const updatedUser = await updateUserApi(user.id, { name, email, avatar });
      updateUserContext(updatedUser);
      setSuccess('Profile updated successfully');
      setError('');
    } catch {
      setError('Failed to update profile');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    setLoading(true);
    try {
      await deleteUser(user.id);
      logout();
    } catch {
      setError('Failed to delete account');
    } finally {
      setLoading(false);
      setDeleteConfirm(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Tabs */}
      <div className="flex border-b dark:border-gray-700">
        {['profile', 'stats', 'settings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 capitalize ${
              activeTab === tab
                ? 'SPECIAL_CHARborder-b-2 border-primary text-primary dark:text-indigo-300'
                : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-indigo-300'
            }`}
            aria-label={`View ${tab} tab`}
          >
            {tab}
          </button>
        ))}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 text-center"
        >
          {error}
        </motion.p>
      )}
      {success && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-green-500 text-center"
        >
          {success}
        </motion.p>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Card className="space-y-6">
          <h2 className="text-2xl font-bold dark:text-gray-100">Profile Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={avatar || 'https://via.placeholder.com/100'}
                  alt="User avatar"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  aria-label="Upload avatar"
                  disabled={loading}
                />
              </div>
              <div>
                <p className="font-semibold dark:text-gray-100">{name}</p>
                <p className="text-gray-600 dark:text-gray-300">{email}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-gray-200 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-primary"
                aria-label="Full name"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-gray-200 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-primary"
                aria-label="Email address"
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary text-white hover:bg-indigo-700"
              ariaLabel="Update profile"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </Card>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <Card className="space-y-6">
          <h2 className="text-2xl font-bold dark:text-gray-100">Your Achievements</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <User className="w-8 h-8 text-primary" />
              <div>
                <p className="font-semibold dark:text-gray-100">
                  {stats.flashcards} Flashcards Created
                </p>
                <p className="text-gray-600 dark:text-gray-300">Your knowledge base</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Award className="w-8 h-8 text-secondary" />
              <div>
                <p className="font-semibold dark:text-gray-100">
                  {stats.quizzes} Quizzes Completed
                </p>
                <p className="text-gray-600 dark:text-gray-300">Categories mastered</p>
              </div>
            </div>
          </div>
          <h3 className="text-xl font-semibold dark:text-gray-100 mt-6">Badges</h3>
          {badges.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <Award className="w-6 h-6 text-accent" />
                  <span className="dark:text-gray-100">{badge.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">No badges earned yet.</p>
          )}
        </Card>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <Card className="space-y-6">
          <h2 className="text-2xl font-bold dark:text-gray-100">Account Settings</h2>
          <div>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Delete your account and all associated data.
            </p>
            <Button
              onClick={handleDeleteAccount}
              className="bg-red-500 text-white hover:bg-red-600"
              ariaLabel="Delete account"
              disabled={loading}
            >
              <Trash2 className="inline mr-2" size={20} />
              {deleteConfirm ? 'Confirm Delete' : 'Delete Account'}
            </Button>
            {deleteConfirm && (
              <p className="text-red-500 mt-2">This action is irreversible. Click again to confirm.</p>
            )}
          </div>
        </Card>
      )}
    </motion.div>
  );
}

export default Profile;