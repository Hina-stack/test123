import { useState } from "react";
import { 
  Edit2, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  Mail, 
  BookOpen,
  ThumbsUp,
  MoreVertical,
  Filter
} from "lucide-react";

const FeedbackList = ({ 
  feedbacks, 
  onEdit, 
  onDelete, 
  emojis, 
  theme, 
  themes, 
  darkMode,
  emptyMessage 
}) => {
  const [expandedId, setExpandedId] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedId, setSelectedId] = useState(null);

  const sortedFeedbacks = [...feedbacks].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date);
      case "oldest":
        return new Date(a.timestamp || a.date) - new Date(b.timestamp || b.date);
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this feedback? This action cannot be undone.")) {
      onDelete(index);
      setSelectedId(null);
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "bg-emerald-500";
    if (rating >= 3) return "bg-blue-500";
    if (rating >= 2) return "bg-yellow-500";
    return "bg-red-500";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const T = themes[theme] || themes.indigo;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Student Feedback
          </h2>
          <p className={`text-sm mt-1 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {feedbacks.length} review{feedbacks.length !== 1 ? 's' : ''} from our students
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-3">
          <Filter size={18} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`
              px-4 py-2 rounded-lg border transition-colors appearance-none
              ${darkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
              }
              focus:outline-none focus:ring-2 focus:ring-opacity-50
              ${darkMode ? 'focus:ring-gray-600' : 'focus:ring-gray-400'}
            `}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>
      </div>

      {/* Empty State */}
      {feedbacks.length === 0 && emptyMessage}

      {/* Feedback Cards */}
      <div className="space-y-4">
        {sortedFeedbacks.map((feedback, index) => (
          <div
            key={feedback.id || index}
            className={`
              rounded-xl overflow-hidden transition-all duration-300
              ${darkMode 
                ? 'bg-gray-800/50 hover:bg-gray-800/70' 
                : 'bg-white hover:bg-gray-50/80'
              }
              border ${darkMode ? 'border-gray-700/50' : 'border-gray-200'}
              shadow-lg hover:shadow-xl
              transform hover:-translate-y-0.5
            `}
          >
            {/* Card Header */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-xl
                    ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}
                  `}>
                    {feedback.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className={`font-bold ${
                      darkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {feedback.name}
                    </h3>
                    <p className={`text-sm flex items-center gap-1 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <Mail size={12} />
                      {feedback.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Rating Badge */}
                  <div className={`
                    px-3 py-1.5 rounded-full text-white font-bold text-sm
                    ${getRatingColor(feedback.rating)}
                    flex items-center gap-1
                  `}>
                    <span>{feedback.rating}</span>
                    <span className="text-xs">/5</span>
                  </div>

                  {/* More Actions */}
                  <div className="relative">
                    <button
                      onClick={() => setSelectedId(selectedId === feedback.id ? null : feedback.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        darkMode 
                          ? 'hover:bg-gray-700' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <MoreVertical size={18} />
                    </button>

                    {selectedId === feedback.id && (
                      <div className={`
                        absolute right-0 top-full mt-1 py-2 rounded-lg shadow-xl z-10 min-w-[160px]
                        ${darkMode ? 'bg-gray-700' : 'bg-white'}
                        border ${darkMode ? 'border-gray-600' : 'border-gray-200'}
                      `}>
                        <button
                          onClick={() => {
                            onEdit(feedback.originalIndex);
                            setSelectedId(null);
                          }}
                          className={`
                            w-full px-4 py-2 text-left flex items-center gap-2 transition-colors
                            ${darkMode 
                              ? 'hover:bg-gray-600 text-gray-300' 
                              : 'hover:bg-gray-100 text-gray-700'
                            }
                          `}
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(feedback.originalIndex)}
                          className={`
                            w-full px-4 py-2 text-left flex items-center gap-2 transition-colors
                            ${darkMode 
                              ? 'hover:bg-gray-600 text-red-400' 
                              : 'hover:bg-gray-100 text-red-600'
                            }
                          `}
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Course and Date */}
              <div className="flex flex-wrap gap-4 mb-4">
                <div className={`flex items-center gap-2 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <BookOpen size={14} />
                  <span className="text-sm font-medium">{feedback.course}</span>
                </div>
                <div className={`flex items-center gap-2 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <Calendar size={14} />
                  <span className="text-sm">{formatDate(feedback.date)}</span>
                </div>
              </div>

              {/* Rating Emoji and Summary */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">
                    {emojis[feedback.rating]}
                  </span>
                  <div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full ${
                            i < feedback.rating
                              ? getRatingColor(feedback.rating)
                              : darkMode
                              ? 'bg-gray-700'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-sm mt-1 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {feedback.rating >= 4 ? 'Excellent!' : 
                       feedback.rating >= 3 ? 'Good' : 
                       feedback.rating >= 2 ? 'Average' : 'Needs Improvement'}
                    </p>
                  </div>
                </div>

                {feedback.rating >= 4 && (
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                    darkMode 
                      ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-800/50' 
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    <ThumbsUp size={14} />
                    <span className="text-sm font-medium">Positive</span>
                  </div>
                )}
              </div>

              {/* Feedback Content */}
              <div>
                <p className={`
                  ${darkMode ? 'text-gray-300' : 'text-gray-700'}
                  line-clamp-3 transition-all duration-300
                  ${expandedId === feedback.id ? 'line-clamp-none' : ''}
                `}>
                  {feedback.feedback}
                </p>
                {feedback.feedback.length > 200 && (
                  <button
                    onClick={() => toggleExpand(feedback.id)}
                    className={`mt-2 flex items-center gap-1 text-sm font-medium transition-colors ${
                      darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    {expandedId === feedback.id ? (
                      <>
                        Show Less <ChevronUp size={16} />
                      </>
                    ) : (
                      <>
                        Read More <ChevronDown size={16} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Card Footer */}
            <div className={`
              px-6 py-4 border-t
              ${darkMode ? 'border-gray-700/50 bg-gray-900/30' : 'border-gray-200 bg-gray-50/50'}
            `}>
              <div className="flex justify-between items-center">
                <span className={`text-xs ${
                  darkMode ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  Feedback ID: {feedback.id?.toString().slice(-8) || `F${index.toString().padStart(4, '0')}`}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(feedback.originalIndex)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                      darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(feedback.originalIndex)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                      darkMode 
                        ? 'bg-red-900/30 hover:bg-red-800/30 text-red-400' 
                        : 'bg-red-50 hover:bg-red-100 text-red-600'
                    }`}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackList;