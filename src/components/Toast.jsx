import React, { useEffect } from "react";
import { RiCheckFill, RiErrorWarningLine, RiCloseLine } from "react-icons/ri";

function Toast({ type, message, onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const backgroundColor = type === "success" ? "bg-green-500" : "bg-red-500";
  const Icon = type === "success" ? RiCheckFill : RiErrorWarningLine;

  return (
    <div className="fixed top-4 right-4 z-[1000] flex items-center space-x-3 p-4 rounded-lg shadow-lg text-white max-w-xs transition-all duration-300 ease-out transform translate-x-0 opacity-100">
      <div
        className={`flex items-center justify-center p-2 rounded-full ${backgroundColor}`}
      >
        <Icon size={20} />
      </div>
      <p className="flex-grow text-gray-800 dark:text-white">{message}</p>
      <button
        onClick={onClose}
        className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
      >
        <RiCloseLine size={20} />
      </button>
    </div>
  );
}

export default Toast;
