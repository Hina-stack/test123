import { useState, useEffect } from "react";

function FeedbackList({ feedbacks, onEdit, onDelete, emojis, theme }) {
  const [likes, setLikes] = useState({});

  useEffect(() => {
    // initialize likes for new items
    const initial = {};
    feedbacks.forEach(fb => {
      if (!(fb.id in likes)) initial[fb.id] = 0;
    });
    setLikes(prev => ({ ...initial, ...prev }));
  }, [feedbacks]);

  if (feedbacks.length === 0) {
    return (
      <div className="text-center text-gray-500 py-6">
        No feedback yet. Be the first to submit!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {feedbacks.map((fb) => (
        <div
          key={fb.id}
          className={`
            border p-4 rounded-xl shadow-sm bg-white
            transform transition-all duration-300
            animate-fadeIn
            hover:scale-[1.03] hover:shadow-lg
            hover:border-${theme}-300
          `}
        >
          {/* HEADER */}
          <div className="flex justify-between items-start">
            <div>
              <p className={`font-semibold text-${theme}-700`}>
                {fb.name}
              </p>
              <p className="text-sm text-gray-600">{fb.email}</p>
            </div>

            {/* ⭐ STAR ANIMATION */}
            <span
              className="text-2xl transition-transform duration-300 hover:rotate-12 hover:scale-125"
            >
              {emojis[fb.rating]}
            </span>
          </div>

          <div className="mt-3">
            <p className="text-gray-700 italic">"{fb.comment}"</p>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <span
              className={`bg-${theme}-50 text-${theme}-700 px-3 py-1 rounded-full text-sm`}
            >
              ⭐ {fb.rating} / 5
            </span>

            <div className="flex items-center gap-3">
              {/* ❤️ LIKE BUTTON */}
              <button
                onClick={() =>
                  setLikes(prev => ({
                    ...prev,
                    [fb.id]: (prev[fb.id] || 0) + 1
                  }))
                }
                className="text-rose-600 hover:text-rose-700"
              >
                ❤️ {likes[fb.id] || 0}
              </button>

              <button
                onClick={() => onEdit(fb.originalIndex)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(fb.originalIndex)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FeedbackList;
