import ProgressChart from '../components/ProgressChart';
import { Trophy } from 'lucide-react';

// Page to view progress and badges
function Progress() {
  return (
    <div className="min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold dark:text-gray-100">Your Learning Journey</h1>
      </div>
      <ProgressChart />
    </div>
  );
}

export default Progress;