import React from "react";
import { Link } from "react-router-dom";

const UserNavBar = () => {
  return (
    <nav className="flex items-center gap-6 px-6 py-3 bg-white border-b border-gray-200">
        
      <Link
        to="/profile"
        className="text-gray-700 font-medium hover:text-blue-600 transition"
      >
        Profile
      </Link>

      <Link
        to="/settings"
        className="text-gray-700 font-medium hover:text-blue-600 transition"
      >
        Settings
      </Link>

      <Link
        to="/logout"
        className="text-red-600 font-medium hover:text-red-700 transition"
      >
        Logout
      </Link>
    </nav>
  );
};

export default UserNavBar;
