import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
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
        <Helmet>
          <title>Your Profile - Flashcards</title>
          <meta name="description" content="Manage your account and preferences on Flashcards." />
          <link rel="canonical" href="https://flashcards-app-steel.vercel.app/profile" />
        </Helmet>
        <h1 className="text-4xl font-bold mb-8 dark:text-gray-100 text-center">
          Your FlashCards Profile
        </h1>
        <Profile />
      </motion.div>
    </div>
  );
}

export default ProfilePage;