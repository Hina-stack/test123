import { useState } from "react";
import { Palette, Check, ChevronDown } from "lucide-react";

const ThemeSelector = ({ themes, currentTheme, onThemeChange, darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const themesArray = Object.entries(themes).map(([key, value]) => ({
    id: key,
    name: value.name,
    color: key
  }));

  const currentThemeData = themes[currentTheme];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all
          ${darkMode 
            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }
          border ${darkMode ? 'border-gray-700' : 'border-gray-300'}
        `}
      >
        <Palette size={18} />
        <span className="hidden sm:inline">{currentThemeData?.name || "Theme"}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className={`
            absolute top-full mt-2 right-0 z-50 py-2 rounded-xl shadow-2xl
            min-w-[220px]
            ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}
            animate-fadeIn
          `}>
            <div className="px-4 py-2 border-b border-gray-700/50">
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Select Theme
              </p>
            </div>
            
            <div className="py-2">
              {themesArray.map((theme) => {
                const themeData = themes[theme.id];
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      onThemeChange(theme.id);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full px-4 py-3 text-left transition-all duration-200
                      flex items-center justify-between gap-3
                      ${darkMode 
                        ? 'hover:bg-gray-700/50 text-gray-300' 
                        : 'hover:bg-gray-50 text-gray-700'
                      }
                      ${currentTheme === theme.id 
                        ? darkMode 
                          ? 'bg-gray-700/50' 
                          : 'bg-gray-100'
                        : ''
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-6 h-6 rounded-full ${themeData.accent.split(' ')[0]}
                        border-2 ${darkMode ? 'border-gray-600' : 'border-gray-200'}
                      `} />
                      <span className="font-medium">{theme.name}</span>
                    </div>
                    
                    {currentTheme === theme.id && (
                      <Check size={18} className={`
                        ${darkMode ? 'text-blue-400' : 'text-blue-600'}
                      `} />
                    )}
                  </button>
                );
              })}
            </div>

            <div className={`
              px-4 py-3 border-t
              ${darkMode ? 'border-gray-700/50' : 'border-gray-200'}
            `}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${currentThemeData.accent.split(' ')[0]}`} />
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Current: {currentThemeData.name}
                </span>
              </div>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                Changes apply instantly to your experience
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;