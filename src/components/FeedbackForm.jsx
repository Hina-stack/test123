import { useState, useEffect } from "react";
import { Send, Edit2, X, Star, Loader2 } from "lucide-react";

const FeedbackForm = ({ onSave, editData, theme, darkMode }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
    rating: 5,
    feedback: "",
    date: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        date: editData.date || new Date().toISOString().split('T')[0]
      });
    } else {
      resetForm();
    }
  }, [editData]);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      course: "",
      rating: 5,
      feedback: "",
      date: new Date().toISOString().split('T')[0]
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.course.trim()) {
      newErrors.course = "Course is required";
    }

    if (!formData.feedback.trim()) {
      newErrors.feedback = "Feedback is required";
    } else if (formData.feedback.trim().length < 10) {
      newErrors.feedback = "Feedback must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onSave({
      ...formData,
      id: editData?.id || Date.now(),
      timestamp: new Date().toISOString()
    });
    
    if (!editData) {
      resetForm();
    }
    
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const themes = {
    indigo: { bg: "bg-indigo-500", hover: "hover:bg-indigo-600" },
    emerald: { bg: "bg-emerald-500", hover: "hover:bg-emerald-600" },
    purple: { bg: "bg-purple-500", hover: "hover:bg-purple-600" },
    sunset: { bg: "bg-orange-500", hover: "hover:bg-orange-600" }
  };

  const themeColors = themes[theme] || themes.indigo;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className={`text-lg font-semibold ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {editData ? 'Edit Your Feedback' : 'Share Your Experience'}
        </h3>
        {editData && (
          <button
            type="button"
            onClick={resetForm}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Rating Selector */}
      <div className="space-y-3">
        <label className={`block text-sm font-medium ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          How would you rate your experience? *
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingClick(star)}
              className={`
                p-2 rounded-lg transition-all duration-300 transform hover:scale-110
                ${formData.rating >= star 
                  ? `${themeColors.bg} text-white shadow-lg` 
                  : darkMode 
                    ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' 
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }
              `}
            >
              <Star size={24} fill={formData.rating >= star ? "currentColor" : "none"} />
            </button>
          ))}
          <span className={`ml-3 text-lg font-bold ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {formData.rating}/5
          </span>
        </div>
      </div>

      {/* Name and Email */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
              errors.name 
                ? 'border-red-500 focus:border-red-500' 
                : darkMode 
                  ? 'border-gray-700 bg-gray-800/50 focus:border-gray-600 focus:bg-gray-800' 
                  : 'border-gray-300 bg-white focus:border-gray-400 focus:bg-gray-50'
            } ${darkMode ? 'text-white' : 'text-gray-900'}`}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className={`block text-sm font-medium ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
              errors.email 
                ? 'border-red-500 focus:border-red-500' 
                : darkMode 
                  ? 'border-gray-700 bg-gray-800/50 focus:border-gray-600 focus:bg-gray-800' 
                  : 'border-gray-300 bg-white focus:border-gray-400 focus:bg-gray-50'
            } ${darkMode ? 'text-white' : 'text-gray-900'}`}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Course */}
      <div className="space-y-2">
        <label className={`block text-sm font-medium ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Course/Subject *
        </label>
        <input
          type="text"
          name="course"
          value={formData.course}
          onChange={handleChange}
          placeholder="e.g., Advanced React Development"
          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
            errors.course 
              ? 'border-red-500 focus:border-red-500' 
              : darkMode 
                ? 'border-gray-700 bg-gray-800/50 focus:border-gray-600 focus:bg-gray-800' 
                : 'border-gray-300 bg-white focus:border-gray-400 focus:bg-gray-50'
          } ${darkMode ? 'text-white' : 'text-gray-900'}`}
        />
        {errors.course && (
          <p className="text-sm text-red-500">{errors.course}</p>
        )}
      </div>

      {/* Feedback Text */}
      <div className="space-y-2">
        <label className={`block text-sm font-medium ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Your Feedback *
        </label>
        <textarea
          name="feedback"
          value={formData.feedback}
          onChange={handleChange}
          rows="4"
          placeholder="Share your thoughts about the course, instructor, materials, etc..."
          className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
            errors.feedback 
              ? 'border-red-500 focus:border-red-500' 
              : darkMode 
                ? 'border-gray-700 bg-gray-800/50 focus:border-gray-600 focus:bg-gray-800' 
                : 'border-gray-300 bg-white focus:border-gray-400 focus:bg-gray-50'
          } ${darkMode ? 'text-white' : 'text-gray-900'}`}
        />
        <div className="flex justify-between items-center">
          {errors.feedback ? (
            <p className="text-sm text-red-500">{errors.feedback}</p>
          ) : (
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              Minimum 10 characters
            </p>
          )}
          <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
            {formData.feedback.length}/500
          </span>
        </div>
      </div>

      {/* Date */}
      <div className="space-y-2">
        <label className={`block text-sm font-medium ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Date of Experience
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
            darkMode 
              ? 'border-gray-700 bg-gray-800/50 focus:border-gray-600 focus:bg-gray-800' 
              : 'border-gray-300 bg-white focus:border-gray-400 focus:bg-gray-50'
          } ${darkMode ? 'text-white' : 'text-gray-900'}`}
        />
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            w-full px-6 py-3 rounded-lg font-medium transition-all duration-300
            flex items-center justify-center gap-2
            ${isSubmitting 
              ? 'opacity-75 cursor-not-allowed' 
              : 'hover:scale-[1.02] active:scale-[0.98]'
            }
            ${editData 
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
              : `${themeColors.bg} ${themeColors.hover} text-white`
            }
            shadow-lg hover:shadow-xl
          `}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              {editData ? 'Updating...' : 'Submitting...'}
            </>
          ) : (
            <>
              {editData ? <Edit2 size={20} /> : <Send size={20} />}
              {editData ? 'Update Feedback' : 'Submit Feedback'}
            </>
          )}
        </button>
      </div>

      <p className={`text-xs text-center pt-2 ${
        darkMode ? 'text-gray-500' : 'text-gray-600'
      }`}>
        Your feedback helps us improve the learning experience for everyone.
      </p>
    </form>
  );
};

export default FeedbackForm;