import React from "react";
import { Link } from "react-router-dom";
import {
  RiUserFill,
  RiMailFill,
  RiBuildingFill,
  RiPhoneFill,
} from "react-icons/ri"; // Added RiPhoneFill icon

function UserCard({ user }) {
  // Removed userNumber prop
  return (
    <Link to={`/user/${user.id}`} className="block">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 transform hover:scale-102 h-full flex flex-col justify-between">
        {/* User Name */}
        <div className="mb-3">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
            <RiUserFill className="mr-2 text-blue-500" /> {user.name}
          </h3>
        </div>

        {/* Email */}
        <div className="text-gray-600 dark:text-gray-300">
          <p className="flex items-center mb-1">
            <RiMailFill className="mr-2 text-gray-400" /> {user.email}
          </p>

          {/* PHONE NUMBER - CORRECTLY ADDED */}
          <p className="flex items-center mb-1">
            <RiPhoneFill className="mr-2 text-gray-400" /> {user.phone}
          </p>

          {/* Company Name */}
          {user.company?.name && (
            <p className="flex items-center">
              <RiBuildingFill className="mr-2 text-gray-400" />{" "}
              {user.company.name}
            </p>
          )}
        </div>

        {/* View Details Link */}
        <div className="mt-4 text-sm text-blue-600 dark:text-blue-400 font-medium">
          View Details
        </div>
      </div>
    </Link>
  );
}

export default UserCard;
