import ProgressChart from '../components/ProgressChart';
import { Helmet } from 'react-helmet-async';
import { Trophy } from 'lucide-react';

// Page to view progress and badges
function Progress() {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Track Your Progress - Flashcards</title>
        <meta name="description" content="Monitor your learning journey with detailed stats and badges on FLashCards." />
        <link rel="canonical" href="https://flashcards-app-steel.vercel.app/progress" />
      </Helmet>
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold dark:text-gray-100">Your Learning Journey</h1>
      </div>
      <ProgressChart />
    </div>
  );
}

export default Progress;