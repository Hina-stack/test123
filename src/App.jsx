import { useState, useEffect, useCallback } from "react";
import { 
  Sun, 
  Moon, 
  Palette, 
  Filter, 
  MessageSquare, 
  Sparkles,
  TrendingUp,
  Zap
} from "lucide-react";
import FeedbackForm from "./components/FeedbackForm";
import FeedbackList from "./components/FeedbackList";
import ThemeSelector from "./components/ThemeSelector";
import StatsCard from "./components/StatsCard";

const ratingEmojis = {
  1: "😡",
  2: "😐",
  3: "🙂",
  4: "😃",
  5: "🤩",
};

const themes = {
  indigo: {
    name: "Ocean Blue",
    lightBg: "bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50",
    darkBg: "bg-gradient-to-br from-gray-900 via-indigo-900/20 to-blue-900/20",
    text: "text-indigo-600",
    textDark: "text-indigo-300",
    accent: "bg-gradient-to-r from-indigo-500 to-blue-500",
    accentHover: "hover:from-indigo-600 hover:to-blue-600",
    light: "bg-white/80 backdrop-blur-sm border-indigo-100",
    lightDark: "bg-gray-800/80 backdrop-blur-sm border-indigo-800/50",
    cardLight: "bg-gradient-to-br from-white to-indigo-50/50",
    cardDark: "bg-gradient-to-br from-gray-800 to-indigo-900/20",
  },
  emerald: {
    name: "Emerald",
    lightBg: "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50",
    darkBg: "bg-gradient-to-br from-gray-900 via-emerald-900/20 to-teal-900/20",
    text: "text-emerald-600",
    textDark: "text-emerald-300",
    accent: "bg-gradient-to-r from-emerald-500 to-green-500",
    accentHover: "hover:from-emerald-600 hover:to-green-600",
    light: "bg-white/80 backdrop-blur-sm border-emerald-100",
    lightDark: "bg-gray-800/80 backdrop-blur-sm border-emerald-800/50",
    cardLight: "bg-gradient-to-br from-white to-emerald-50/50",
    cardDark: "bg-gradient-to-br from-gray-800 to-emerald-900/20",
  },
  purple: {
    name: "Royal Purple",
    lightBg: "bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50",
    darkBg: "bg-gradient-to-br from-gray-900 via-purple-900/20 to-fuchsia-900/20",
    text: "text-purple-600",
    textDark: "text-purple-300",
    accent: "bg-gradient-to-r from-purple-500 to-fuchsia-500",
    accentHover: "hover:from-purple-600 hover:to-fuchsia-600",
    light: "bg-white/80 backdrop-blur-sm border-purple-100",
    lightDark: "bg-gray-800/80 backdrop-blur-sm border-purple-800/50",
    cardLight: "bg-gradient-to-br from-white to-purple-50/50",
    cardDark: "bg-gradient-to-br from-gray-800 to-purple-900/20",
  },
  sunset: {
    name: "Sunset",
    lightBg: "bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50",
    darkBg: "bg-gradient-to-br from-gray-900 via-orange-900/20 to-rose-900/20",
    text: "text-rose-600",
    textDark: "text-rose-300",
    accent: "bg-gradient-to-r from-orange-500 to-rose-500",
    accentHover: "hover:from-orange-600 hover:to-rose-600",
    light: "bg-white/80 backdrop-blur-sm border-rose-100",
    lightDark: "bg-gray-800/80 backdrop-blur-sm border-rose-800/50",
    cardLight: "bg-gradient-to-br from-white to-rose-50/50",
    cardDark: "bg-gradient-to-br from-gray-800 to-rose-900/20",
  },
};

function App() {
  const [feedbacks, setFeedbacks] = useState(() => {
    const saved = localStorage.getItem("feedbacks");
    return saved ? JSON.parse(saved) : [];
  });

  const [editIndex, setEditIndex] = useState(null);
  const [filter, setFilter] = useState("all");
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme && themes[savedTheme] ? savedTheme : "indigo";
  });
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [showStats, setShowStats] = useState(false);

  const calculateStats = useCallback(() => {
    const total = feedbacks.length;
    const averageRating = total > 0 
      ? (feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / total).toFixed(1)
      : 0;
    const positiveCount = feedbacks.filter(fb => fb.rating >= 4).length;
    const fiveStarCount = feedbacks.filter(fb => fb.rating === 5).length;
    
    return { total, averageRating, positiveCount, fiveStarCount };
  }, [feedbacks]);

  useEffect(() => {
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
  }, [feedbacks]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const saveFeedback = (data) => {
    if (editIndex !== null) {
      const updated = [...feedbacks];
      updated[editIndex] = data;
      setFeedbacks(updated);
      setEditIndex(null);
    } else {
      setFeedbacks(prev => [{ ...data, id: Date.now() }, ...prev]);
    }
  };

  const editFeedback = (index) => {
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteFeedback = (index) => {
    setFeedbacks(prev => prev.filter((_, i) => i !== index));
  };

  const filteredFeedbacks = feedbacks
    .map((fb, index) => ({ ...fb, originalIndex: index }))
    .filter((fb) => {
      if (filter === "4+") return fb.rating >= 4;
      if (filter === "5") return fb.rating === 5;
      return true;
    });

  const currentTheme = themes[theme] || themes.indigo;
  const stats = calculateStats();

  return (
    <div className={`
      min-h-screen transition-all duration-500
      ${darkMode ? currentTheme.darkBg : currentTheme.lightBg}
      relative overflow-hidden
    `}>
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full ${
          darkMode ? 'bg-indigo-500/10' : 'bg-indigo-200/40'
        } blur-3xl`} />
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full ${
          darkMode ? 'bg-blue-500/10' : 'bg-blue-200/40'
        } blur-3xl`} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`
          rounded-2xl p-6 transition-all duration-500
          ${darkMode 
            ? 'bg-gray-900/70 backdrop-blur-xl border border-gray-800/50' 
            : 'bg-white/80 backdrop-blur-xl border border-white/50'
          }
          shadow-2xl shadow-black/10
        `}>
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${currentTheme.accent}`}>
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h1 className={`text-3xl lg:text-4xl font-bold bg-gradient-to-r ${
                  darkMode ? currentTheme.textDark : currentTheme.text
                } bg-clip-text text-transparent`}>
                  Student Feedback Portal
                </h1>
                {feedbacks.length > 0 && (
                  <span className={`
                    px-3 py-1 rounded-full text-sm font-semibold
                    ${darkMode 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-emerald-100 text-emerald-700'
                    }
                  `}>
                    {feedbacks.length} feedback{feedbacks.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Share your thoughts, rate your experience, and help us improve
              </p>
            </div>

            {/* Theme and Mode Controls */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowStats(!showStats)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                  darkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <TrendingUp size={18} />
                Stats
              </button>

              <ThemeSelector
                themes={themes}
                currentTheme={theme}
                onThemeChange={setTheme}
                darkMode={darkMode}
              />

              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                  darkMode 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                {darkMode ? (
                  <>
                    <Sun size={18} />
                    Light
                  </>
                ) : (
                  <>
                    <Moon size={18} />
                    Dark
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Stats Panel */}
          {showStats && (
            <div className="mb-8 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatsCard
                  title="Total Feedback"
                  value={stats.total}
                  icon={MessageSquare}
                  trend={stats.total > 0 ? "positive" : "neutral"}
                  darkMode={darkMode}
                />
                <StatsCard
                  title="Average Rating"
                  value={stats.averageRating}
                  icon={Sparkles}
                  subtitle="/5.0"
                  trend="positive"
                  darkMode={darkMode}
                />
                <StatsCard
                  title="Positive (4+)"
                  value={stats.positiveCount}
                  icon={TrendingUp}
                  percentage={stats.total > 0 ? (stats.positiveCount / stats.total * 100).toFixed(0) : 0}
                  darkMode={darkMode}
                />
                <StatsCard
                  title="5-Star Ratings"
                  value={stats.fiveStarCount}
                  icon={Zap}
                  darkMode={darkMode}
                />
              </div>
            </div>
          )}

          {/* Filter Bar */}
          <div className={`
            rounded-xl p-5 mb-8 transition-all duration-300
            ${darkMode ? currentTheme.lightDark : currentTheme.light}
            border
          `}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Filter className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                <span className={`font-semibold ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Filter Feedback
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {['all', '4+', '5'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setFilter(option)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      filter === option
                        ? `${currentTheme.accent} text-white shadow-lg`
                        : darkMode
                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {option === 'all' && 'Show All'}
                    {option === '4+' && '⭐ 4+ Stars'}
                    {option === '5' && '🌟 5 Stars Only'}
                  </button>
                ))}
              </div>
            </div>
            {filter !== 'all' && (
              <div className="mt-4 text-sm text-gray-500">
                Showing {filteredFeedbacks.length} of {feedbacks.length} feedbacks
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className={`
                  rounded-2xl p-6 mb-6
                  ${darkMode ? currentTheme.cardDark : currentTheme.cardLight}
                  border
                  shadow-lg
                `}>
                  <h2 className={`text-xl font-bold mb-4 ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    {editIndex !== null ? '✏️ Edit Feedback' : '💬 New Feedback'}
                  </h2>
                  <FeedbackForm
                    onSave={saveFeedback}
                    editData={editIndex !== null ? feedbacks[editIndex] : null}
                    theme={theme}
                    darkMode={darkMode}
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className={`
                rounded-2xl p-1
                ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}
              `}>
                <FeedbackList
                  feedbacks={filteredFeedbacks}
                  onEdit={editFeedback}
                  onDelete={deleteFeedback}
                  emojis={ratingEmojis}
                  theme={theme}
                  themes={themes}
                  darkMode={darkMode}
                  emptyMessage={
                    <div className="text-center py-12">
                      <div className={`text-6xl mb-4 ${
                        darkMode ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                        💭
                      </div>
                      <h3 className={`text-xl font-semibold mb-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        No feedback yet
                      </h3>
                      <p className={`${
                        darkMode ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        Be the first to share your thoughts!
                      </p>
                    </div>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;