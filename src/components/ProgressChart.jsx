import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Award } from 'lucide-react';
import { getProgress, getBadges } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from './Card';
import Button from './Button';

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

// Progress chart with enhanced design and features
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

  // Calculate total stats
  const totalCorrect = data.reduce((sum, d) => sum + d.correct, 0);
  const totalIncorrect = data.reduce((sum, d) => sum + d.incorrect, 0);
  const totalAnswers = totalCorrect + totalIncorrect;
  const accuracy = totalAnswers > 0 ? ((totalCorrect / totalAnswers) * 100).toFixed(1) : 0;

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
    a.download = 'flashcards_progress.csv';
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
    <Card className="space-y-6">
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-t-xl">
        <h2 className="text-2xl font-bold text-center">Your Learning Progress</h2>
        <p className="text-center text-sm mt-1">
          Track your quiz performance across categories and over time.
        </p>
      </div>
      <div className="px-6">
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-center mb-4"
          >
            {error}
          </motion.p>
        )}
        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
            <p className="text-lg font-semibold dark:text-gray-100">{totalCorrect}</p>
            <p className="text-gray-600 dark:text-gray-300">Correct Answers</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
            <p className="text-lg font-semibold dark:text-gray-100">{totalIncorrect}</p>
            <p className="text-gray-600 dark:text-gray-300">Incorrect Answers</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
            <p className="text-lg font-semibold dark:text-gray-100">{accuracy}%</p>
            <p className="text-gray-600 dark:text-gray-300">Accuracy</p>
          </div>
        </motion.div>
        {/* View Toggles */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          {['category', 'time'].map((v) => (
            <Button
              key={v}
              onClick={() => setView(v)}
              className={`flex-1 py-2 ${
                view === v
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'
              }`}
              ariaLabel={`View progress by ${v}`}
            >
              {v === 'category' ? 'By Category' : 'Over Time'}
            </Button>
          ))}
          {view === 'time' && (
            <div className="flex gap-2 mt-2 sm:mt-0">
              {['7days', '30days', 'all'].map((filter) => (
                <Button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`flex-1 py-2 ${
                    timeFilter === filter
                      ? 'bg-secondary text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'
                  }`}
                  ariaLabel={`Filter progress by ${filter}`}
                >
                  {filter === '7days' ? '7 Days' : filter === '30days' ? '30 Days' : 'All Time'}
                </Button>
              ))}
            </div>
          )}
        </div>
        {/* Streak Indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-6 bg-gradient-to-r from-accent to-yellow-400 text-white p-4 rounded-lg flex items-center gap-3"
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
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
        </motion.div>
        {/* Badges Section */}
        <h3 className="text-xl font-semibold mb-4 dark:text-gray-100">Badges Earned</h3>
        <AnimatePresence>
          {badges.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {badges.map((badge) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow hover:shadow-md transition"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-6 h-6 text-accent" />
                    <p className="font-semibold dark:text-gray-100">{badge.name}</p>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{badge.description}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-600 dark:text-gray-300 col-span-full mb-8"
            >
              No badges earned yet. Keep quizzing to earn some!
            </motion.p>
          )}
        </AnimatePresence>
        {/* Unearned Badges Progress */}
        {unearnedBadges.length > 0 && (
          <>
            <h3 className="text-xl font-semibold mb-4 dark:text-gray-100">Badge Progress</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {unearnedBadges.map((badge) => {
                const { current, target } = getBadgeProgress(badge);
                const progress = (current / target) * 100;
                return (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-6 h-6 text-gray-400" />
                      <p className="font-semibold dark:text-gray-100">{badge.name}</p>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">{badge.description}</p>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                      <motion.div
                        className="bg-secondary h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        transition={{ duration: 0.5 }}
                      ></motion.div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {current}/{target} completed
                      {current < target ? ` - ${target - current} more to go!` : ''}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
        {/* Export Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6 text-center"
        >
          <Button
            onClick={handleExport}
            className="bg-accent text-white hover:bg-amber-600 flex items-center gap-2 mx-auto px-6 py-3"
            ariaLabel="Export progress as CSV"
          >
            <Download size={20} />
            Export Progress
          </Button>
        </motion.div>
      </div>
    </Card>
  );
}

export default ProgressChart;