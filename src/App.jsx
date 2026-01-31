import { useState, useEffect } from "react";
import FeedbackForm from "./components/FeedbackForm";
import FeedbackList from "./components/FeedbackList";

const ratingEmojis = {
  1: "😡",
  2: "😐",
  3: "🙂",
  4: "😃",
  5: "🤩",
};

const themes = {
  indigo: {
    lightBg: "bg-gradient-to-br from-indigo-50 to-blue-100",
    darkBg: "bg-gradient-to-br from-indigo-900 to-blue-800",
    text: "text-indigo-700",
    textDark: "text-indigo-300",
    btn: "bg-indigo-600 hover:bg-indigo-700",
    light: "bg-indigo-50 border-indigo-200",
    lightDark: "bg-indigo-900/30 border-indigo-700",
  },
  green: {
    lightBg: "bg-gradient-to-br from-green-50 to-emerald-100",
    darkBg: "bg-gradient-to-br from-green-900 to-emerald-800",
    text: "text-green-700",
    textDark: "text-green-300",
    btn: "bg-green-600 hover:bg-green-700",
    light: "bg-green-50 border-green-200",
    lightDark: "bg-green-900/30 border-green-700",
  },
  purple: {
    lightBg: "bg-gradient-to-br from-purple-50 to-fuchsia-100",
    darkBg: "bg-gradient-to-br from-purple-900 to-fuchsia-800",
    text: "text-purple-700",
    textDark: "text-purple-300",
    btn: "bg-purple-600 hover:bg-purple-700",
    light: "bg-purple-50 border-purple-200",
    lightDark: "bg-purple-900/30 border-purple-700",
  },
  rose: {
    lightBg: "bg-gradient-to-br from-rose-50 to-pink-100",
    darkBg: "bg-gradient-to-br from-rose-900 to-pink-800",
    text: "text-rose-700",
    textDark: "text-rose-300",
    btn: "bg-rose-600 hover:bg-rose-700",
    light: "bg-rose-50 border-rose-200",
    lightDark: "bg-rose-900/30 border-rose-700",
  },
};

function App() {
  // Load feedbacks from localStorage on mount
  const [feedbacks, setFeedbacks] = useState(() => {
    const saved = localStorage.getItem("feedbacks");
    return saved ? JSON.parse(saved) : [];
  });

  const [editIndex, setEditIndex] = useState(null);
  const [filter, setFilter] = useState("all");

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "indigo"
  );
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  // Save feedbacks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
  }, [feedbacks]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const saveFeedback = (data) => {
    if (editIndex !== null) {
      const updated = [...feedbacks];
      updated[editIndex] = data;
      setFeedbacks(updated);
      setEditIndex(null);
    } else {
      setFeedbacks((prev) => [...prev, data]);
    }
  };

  const editFeedback = (originalIndex) => {
    setEditIndex(originalIndex);
  };

  const deleteFeedback = (originalIndex) => {
    if (window.confirm("Delete this feedback?")) {
      setFeedbacks(feedbacks.filter((_, i) => i !== originalIndex));
    }
  };

  const filteredFeedbacks = feedbacks
    .map((fb, index) => ({ ...fb, originalIndex: index }))
    .filter((fb) => {
      if (filter === "4+") return fb.rating >= 4;
      if (filter === "5") return fb.rating === 5;
      return true;
    });

  const T = themes[theme];

  return (
    <div
      className={`
        min-h-screen py-8 px-4 transition-all duration-300
        ${darkMode ? T.darkBg : T.lightBg}
      `}
    >
      <div
        className={`
          max-w-4xl mx-auto shadow-lg rounded-xl p-6 transition
          ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}
        `}
      >
        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h1
            className={`text-2xl md:text-3xl font-bold ${
              darkMode ? T.textDark : T.text
            }`}
          >
            🎓 Student Feedback Portal
          </h1>

          <div
            className={`px-4 py-2 rounded-lg border ${
              darkMode ? T.lightDark : T.light
            }`}
          >
            <span className="font-semibold">
              Total Feedback: {feedbacks.length}
            </span>
          </div>
        </div>

        {/* DARK MODE TOGGLE */}
        <div className="mb-4 flex items-center gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-1 rounded bg-gray-700 text-white hover:bg-gray-800"
          >
            {darkMode ? "🌙 Dark Mode ON" : "☀️ Light Mode"}
          </button>
        </div>

        {/* THEME SWITCH */}
        <div className="mb-4 flex gap-3 flex-wrap">
          {Object.keys(themes).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-3 py-1 rounded text-white ${themes[t].btn}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* FILTER BAR */}
        <div
          className={`p-4 rounded-lg mb-6 border ${
            darkMode ? T.lightDark : T.light
          }`}
        >
          <label className="block font-semibold mb-2">
            Filter Feedback:
          </label>
          <select
            className="border p-2 rounded w-full md:w-1/3 text-black"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Show All</option>
            <option value="4+">⭐ 4 Star & Above</option>
            <option value="5">🌟 5 Star Only</option>
          </select>
        </div>

        <FeedbackForm
          onSave={saveFeedback}
          editData={editIndex !== null ? feedbacks[editIndex] : null}
        />

        <hr className="my-6 border-gray-600" />

        <FeedbackList
          feedbacks={filteredFeedbacks}
          onEdit={editFeedback}
          onDelete={deleteFeedback}
          emojis={ratingEmojis}
          theme={theme}
          themes={themes}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
}

export default App;
