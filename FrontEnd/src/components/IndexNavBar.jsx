import { Link } from "react-router-dom";

const IndexNavBar = () => {
  return (
    <header className="w-full bg-white border-b shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <h1 className="text-xl font-semibold tracking-wide text-gray-800">
          Local<span className="text-blue-600">Lynk</span>
        </h1>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-600 hover:text-blue-600 font-medium transition"
          >
            Home
          </Link>

          <Link
            to="/about"
            className="text-gray-600 hover:text-blue-600 font-medium transition"
          >
            About
          </Link>

          <Link
            to="/contact"
            className="text-gray-600 hover:text-blue-600 font-medium transition"
          >
            Contact
          </Link>

          <Link
            to="/login"
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Login
          </Link>

          <Link
            to="/signUp"
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default IndexNavBar;
