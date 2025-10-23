import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { RiSunLine, RiMoonFill } from "react-icons/ri";

function Header({ setShowAddUserModal }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-gray-800 dark:text-white"
        >
          User Dashboard
        </Link>
        <nav className="flex items-center space-x-4">
          <button
            onClick={() => setShowAddUserModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm md:text-base"
          >
            Add User
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <RiMoonFill size={20} />
            ) : (
              <RiSunLine size={20} />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
