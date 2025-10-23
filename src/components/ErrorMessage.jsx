import React from "react";
import { RiErrorWarningLine } from "react-icons/ri";

function ErrorMessage({ message }) {
  return (
    <div
      className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative flex items-center space-x-2"
      role="alert"
    >
      <RiErrorWarningLine className="flex-shrink-0" size={20} />
      <span className="block sm:inline">{message}</span>
    </div>
  );
}

export default ErrorMessage;
