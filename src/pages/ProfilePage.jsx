import { motion } from 'framer-motion';
import Profile from '../components/Profile';

// Profile page with enhanced layout
function ProfilePage() {
  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4"
      >
        <h1 className="text-4xl font-bold mb-8 dark:text-gray-100 text-center">
          Your FlashCards Profile
        </h1>
        <Profile />
      </motion.div>
    </div>
  );
}

export default ProfilePage;