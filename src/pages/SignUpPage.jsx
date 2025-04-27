import { motion } from 'framer-motion';
import SignUp from '../components/SignUp';
import { Helmet } from 'react-helmet-async';

// Sign-up page with hero section
function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-16 bg-gradient-to-r from-primary to-secondary text-white"
      >
        <Helmet><title>Sign Up - Flashcards</title>
          <meta name="description" content="Join Flashcards to create and study custom flashcards." />
          <link rel="canonical" href="https://flashcards-app-steel.vercel.app/signup" />
        </Helmet>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Join FlashCards Today</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Create an account to start building flashcards, taking quizzes, and tracking your learning
            journey.
          </p>
        </div>
      </motion.section>
      <div className="container mx-auto px-4 py-12">
        <SignUp />
      </div>
    </div>
  );
}

export default SignUpPage;