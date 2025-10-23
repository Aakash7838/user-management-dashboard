import React from "react";
import { useTheme } from "../context/ThemeContext"; // Import the custom hook

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:hover:bg-gray-600"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        // Sun icon for light mode
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 00-.707-.293H14a1 1 0 000 2h1.036l.707-.707a1 1 0 00-.707-1.707zM17 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zm-8 4a1 1 0 01-1 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.95-.464a1 1 0 00-.707-.293H3a1 1 0 100 2h1.036l.707-.707a1 1 0 00-.707-1.707zm-2.12-10.607a1 1 0 010-1.414l.707-.707a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414L3.536 4.343zM3 10a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1z" />
        </svg>
      ) : (
        // Moon icon for dark mode
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
}

export default ThemeToggle;
