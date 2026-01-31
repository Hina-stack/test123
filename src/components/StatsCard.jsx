import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  subtitle = "", 
  percentage, 
  trend = "neutral",
  darkMode 
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case "positive":
        return <TrendingUp size={16} className="text-emerald-500" />;
      case "negative":
        return <TrendingDown size={16} className="text-red-500" />;
      default:
        return <Minus size={16} className="text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "positive":
        return darkMode ? "text-emerald-400" : "text-emerald-600";
      case "negative":
        return darkMode ? "text-red-400" : "text-red-600";
      default:
        return darkMode ? "text-gray-400" : "text-gray-600";
    }
  };

  return (
    <div className={`
      rounded-xl p-5 transition-all duration-300
      ${darkMode 
        ? 'bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50' 
        : 'bg-white hover:bg-gray-50/80 border border-gray-200'
      }
      shadow-lg hover:shadow-xl
      transform hover:-translate-y-0.5
    `}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {value}
            </span>
            {subtitle && (
              <span className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {subtitle}
              </span>
            )}
          </div>
        </div>
        
        <div className={`
          p-3 rounded-lg
          ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}
        `}>
          <Icon size={24} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
        </div>
      </div>

      {(percentage !== undefined || trend !== "neutral") && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-700/30">
          {getTrendIcon()}
          {percentage !== undefined && (
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {percentage}%
            </span>
          )}
          <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
            {trend === "positive" && "Increase"}
            {trend === "negative" && "Decrease"}
            {trend === "neutral" && "No change"}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;