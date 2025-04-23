import { Link } from 'react-router-dom';
import { BookOpen, Award, Users } from 'lucide-react';

// Landing page to introduce FlashCards
function Landing() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6 dark:text-gray-100">Welcome to FlashCards</h1>
      <p className="text-lg mb-8 max-w-2xl mx-auto dark:text-gray-200">
        Master your studies with interactive flashcards, quizzes, and progress tracking. Join thousands of learners and spark your knowledge today!
      </p>
      <div className="flex justify-center gap-4 mb-12">
        <Link
          to="/signup"
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          aria-label="Get started"
        >
          Get Started
        </Link>
        <Link
          to="/signin"
          className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition"
          aria-label="Sign in"
        >
          Sign In
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">Create Flashcards</h3>
          <p className="text-gray-600 dark:text-gray-300">Easily create and organize flashcards for any subject.</p>
        </div>
        {/* //Gamification (stretch functionality) */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
          <Award className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">Track Progress</h3>
          <p className="text-gray-600 dark:text-gray-300">Monitor your learning with detailed stats and badges.</p>
        </div>
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
          <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">Learn Smarter</h3>
          <p className="text-gray-600 dark:text-gray-300">Use spaced repetition to master tough concepts.</p>
        </div>
      </div>
    </div>
  );
}



export default Landing;