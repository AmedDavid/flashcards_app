import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getProgress, getBadges } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Chart to visualize progress and display badges
function ProgressChart() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [badges, setBadges] = useState([]);
  const [error, setError] = useState('');

  

  useEffect(() => {
    // Fetch progress and badges for the logged-in user
    const fetchData = async () => {
      try {
        const progress = await getProgress(user.id);
        const badgesData = await getBadges(user.id);

        // Aggregate progress by category
        const categories = [...new Set(progress.map((p) => p.category))];
        const chartData = categories.map((cat) => {
          const catProgress = progress.filter((p) => p.category === cat);
          return {
            category: cat,
            correct: catProgress.filter((p) => p.correct).length,
            incorrect: catProgress.filter((p) => !p.correct).length,
          };
        });

        setData(chartData);
        setBadges(badgesData.filter((b) => b.earned));
      } catch {
        setError('Failed to load progress data');
      }
    };
    if (user) fetchData();
  }, [user]);

  return (

    <div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">Your Progress</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="correct" fill="#10B981" />
          <Bar dataKey="incorrect" fill="#EF4444" />
        </BarChart>
      </ResponsiveContainer>
      <h3 className="text-xl font-semibold mt-6 mb-2 dark:text-gray-100">Badges Earned</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {badges.length > 0 ? (
          badges.map((badge) => (
            <div key={badge.id} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
              <p className="font-semibold dark:text-gray-100">{badge.name}</p>
              <p className="text-gray-600 dark:text-gray-300">{badge.description}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-300">No badges earned yet.</p>
        )}
      </div>
    </div>
  );

}

export default ProgressChart;


