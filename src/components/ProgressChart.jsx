import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Award } from 'lucide-react';
import { getProgress, getBadges } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Custom tooltip for detailed progress info
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum, entry) => sum + entry.value, 0);
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <p className="font-semibold dark:text-gray-100">{label}</p>
        {payload.map((entry) => (
          <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value} ({((entry.value / total) * 100).toFixed(1)}%)
          </p>
        ))}
        <p className="text-sm text-gray-600 dark:text-gray-300">Total: {total}</p>
      </div>
    );
  }
  return null;
};

// Progress chart with streak indicator and enhanced features
function ProgressChart() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [badges, setBadges] = useState([]);
  const [unearnedBadges, setUnearnedBadges] = useState([]);
  const [streak, setStreak] = useState(0);
  const [error, setError] = useState('');
  const [view, setView] = useState('category'); // 'category' or 'time'
  const [timeFilter, setTimeFilter] = useState('all'); // '7days', '30days', 'all'
  const [visibleSeries, setVisibleSeries] = useState({ correct: true, incorrect: true });

  useEffect(() => {
    // Fetch progress and badges for the logged-in user
    const fetchData = async () => {
      try {
        const progress = await getProgress(user.id);
        const badgesData = await getBadges(user.id);

        // Calculate streak (consecutive correct answers)
        let currentStreak = 0;
        for (let i = progress.length - 1; i >= 0; i--) {
          if (progress[i].correct) currentStreak++;
          else break;
        }
        setStreak(currentStreak);

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

        // Aggregate progress by date
        const filteredProgress = progress.filter((p) => {
          const date = new Date(p.timestamp);
          const now = new Date();
          if (timeFilter === '7days') {
            return date >= new Date(now.setDate(now.getDate() - 7));
          } else if (timeFilter === '30days') {
            return date >= new Date(now.setDate(now.getDate() - 30));
          }
          return true;
        });

        const dates = [...new Set(filteredProgress.map((p) => p.timestamp.split('T')[0]))].sort();
        const timeChartData = dates.map((date) => {
          const dateProgress = filteredProgress.filter((p) => p.timestamp.startsWith(date));
          return {
            date,
            correct: dateProgress.filter((p) => p.correct).length,
            incorrect: dateProgress.filter((p) => !p.correct).length,
          };
        });

        setData(chartData);
        setTimeData(timeChartData);
        setBadges(badgesData.filter((b) => b.earned));
        setUnearnedBadges(badgesData.filter((b) => !b.earned));
      } catch {
        setError('Failed to load progress data');
      }
    };
    if (user) fetchData();
  }, [user, timeFilter]);

  // Toggle visibility of data series
  const handleLegendClick = (dataKey) => {
    setVisibleSeries((prev) => ({ ...prev, [dataKey]: !prev[dataKey] }));
  };

  // Export progress as CSV
  const handleExport = () => {
    const headers = ['Category,Correct,Incorrect'];
    const rows = data.map((d) => `${d.category},${d.correct},${d.incorrect}`);
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sparkvibe_progress.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Calculate badge progress (e.g., for Quiz Master: 10 correct answers)
  const getBadgeProgress = (badge) => {
    if (badge.name === 'Quiz Master') {
      const correctCount = data.reduce((sum, d) => sum + d.correct, 0);
      return { current: correctCount, target: 10 };
    }
    return { current: 0, target: 1 };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
    >
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold dark:text-gray-100">Your Progress</h2>
        <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
          <select
            value={view}
            onChange={(e) => setView(e.target.value)}
            className="p-2 border rounded dark:bg-gray-700 dark:text-gray-100"
            aria-label="Select progress view"
          >
            <option value="category">By Category</option>
            <option value="time">Over Time</option>
          </select>
          {view === 'time' && (
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700 dark:text-gray-100"
              aria-label="Select time period"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          )}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-accent text-white p-2 rounded hover:bg-amber-600 transition"
            aria-label="Export progress as CSV"
          >
            <Download size={20} />
            Export
          </button>
        </div>
      </div>

      {/* Streak Indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-6 bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-lg flex items-center gap-3"
        role="alert"
        aria-label={`Current streak: ${streak} correct answers in a row`}
      >
        <Award className="w-8 h-8" />
        <div>
          <p className="font-semibold">Current Streak</p>
          <p>{streak} Correct Answer{streak !== 1 ? 's' : ''} in a Row</p>
        </div>
      </motion.div>

      {/* Chart */}
      <div className="mb-8">
        <ResponsiveContainer width="100%" height={400}>
          {view === 'category' ? (
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="category" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip content={<CustomTooltip />} />
              <Legend onClick={(e) => handleLegendClick(e.dataKey)} />
              {visibleSeries.correct && (
                <Bar dataKey="correct" fill="#10B981" name="Correct" radius={[4, 4, 0, 0]} />
              )}
              {visibleSeries.incorrect && (
                <Bar dataKey="incorrect" fill="#EF4444" name="Incorrect" radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          ) : (
            <LineChart data={timeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip content={<CustomTooltip />} />
              <Legend onClick={(e) => handleLegendClick(e.dataKey)} />
              {visibleSeries.correct && (
                <Line
                  type="monotone"
                  dataKey="correct"
                  stroke="#10B981"
                  name="Correct"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              )}
              {visibleSeries.incorrect && (
                <Line
                  type="monotone"
                  dataKey="incorrect"
                  stroke="#EF4444"
                  name="Incorrect"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              )}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Badges Section */}
      <h3 className="text-xl font-semibold mb-4 dark:text-gray-100">Badges Earned</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <AnimatePresence>
          {badges.length > 0 ? (
            badges.map((badge) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 p-4 rounded-lg shadow hover:shadow-md transition"
              >
                <p className="font-semibold dark:text-gray-100">{badge.name}</p>
                <p className="text-gray-600 dark:text-gray-300">{badge.description}</p>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-300 col-span-full">No badges earned yet.</p>
          )}
        </AnimatePresence>
      </div>

      {/* Unearned Badges Progress */}
      {unearnedBadges.length > 0 && (
        <>
          <h3 className="text-xl font-semibold mb-4 dark:text-gray-100">Badge Progress</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {unearnedBadges.map((badge) => {
              const { current, target } = getBadgeProgress(badge);
              const progress = (current / target) * 100;
              return (
                <div
                  key={badge.id}
                  className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow"
                >
                  <p className="font-semibold dark:text-gray-100">{badge.name}</p>
                  <p className="text-gray-600 dark:text-gray-300">{badge.description}</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                      <div
                        className="bg-secondary h-2.5 rounded-full"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {current}/{target} completed
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </motion.div>
  );
}

export default ProgressChart;