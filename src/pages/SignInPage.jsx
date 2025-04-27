import { motion } from 'framer-motion';
import SignIn from '../components/SignIn';
import { Helmet } from 'react-helmet-async';

// Sign-in page with hero section
function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-16 bg-gradient-to-r from-primary to-secondary text-white"
      >
        <Helmet>
          <title>Sign In - Flashcards</title>
          <meta name="description" content="Access your Flashcards account to start studying." />
          <link rel="canonical" href="https://flashcards-app-steel.vercel.app/signin" />
        </Helmet>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome Back to FlashCards</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Sign in to access your flashcards, track your progress, and master your learning goals.
          </p>
        </div>
      </motion.section>
      <div className="container mx-auto px-4 py-12">
        <SignIn />
      </div>
    </div>
  );
}

export default SignInPage;