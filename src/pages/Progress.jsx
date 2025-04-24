import ProgressChart from '../components/ProgressChart';

// Our page to view progress and badges
function Progress() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 dark:text-gray-100">Your Progress</h1>
      <ProgressChart />
    </div>
  );
}

export default Progress;