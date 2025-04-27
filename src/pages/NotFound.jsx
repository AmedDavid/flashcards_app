import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import Button from '../components/Button';
import logo from '../assets/logo.svg';

// 404 Page for invalid routes
function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12"
      role="main"
      aria-label="Page not found"
    >
      <Helmet>
        <title>404 - Page Not Found - Flashcards</title>
        <meta
          name="description"
          content="The page you’re looking for doesn’t exist on Flashcards. Return to our homepage to start learning."
        />
        <meta name="robots" content="noindex" />
        <link rel="canonical" href="https://flashcards-app-steel.vercel.app/404" />
      </Helmet>
      <Card className="max-w-lg text-center space-y-6">
        <img
          src={logo}
          alt="Flashcards Logo"
          className="w-24 h-24 mx-auto mb-4"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none'; // Hide broken image
            e.target.nextSibling.textContent = 'Logo unavailable';
          }}
        />
        <span className="hidden" aria-hidden="true"></span>
        <h1 className="text-4xl font-bold dark:text-gray-100">404 - Page Not Found</h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Oops! Looks like this page wandered off to study somewhere else.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            as={Link}
            to="/"
            className="bg-primary text-white hover:bg-indigo-700"
            ariaLabel="Go to homepage"
          >
            Back to Home
          </Button>
          <Button
            as={Link}
            to="/signin"
            className="bg-gray-300 text-gray-700 hover:bg-gray-400"
            ariaLabel="Sign in to Flashcards"
          >
            Sign In
          </Button>
          <Button
            as={Link}
            to="/signup"
            className="bg-secondary text-white hover:bg-emerald-600"
            ariaLabel="Sign up for Flashcards"
          >
            Sign Up
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

export default NotFound;