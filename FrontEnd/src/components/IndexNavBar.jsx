import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/LLLogo.jpeg";


const IndexNavBar = () => {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `relative font-medium transition-all duration-300
     ${isActive ? "text-red-400" : "text-gray-300 hover:text-red-400"}
     after:content-[''] after:absolute after:left-0 after:-bottom-1
     after:h-[2px] after:bg-gradient-to-r after:from-red-500 after:to-purple-500
     after:transition-all after:duration-300
     ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}`;

  return (
    <header className="w-full bg-black/90 backdrop-blur border-b border-red-900 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

        {/* 🔥 LOGO */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <img
            src={logo}
            alt="LocalLynk Logo"
            className="
      h-8 w-8 sm:h-10 sm:w-10
      object-cover
      rounded-md
      border border-red-900/40
      bg-black
    "
          />
          <span
            className="text-xl sm:text-2xl font-extrabold tracking-wide
      text-transparent bg-clip-text
      bg-gradient-to-r from-red-500 via-orange-400 to-purple-500"
          >
            Local<span className="text-white">Lynk</span>
          </span>
        </div>

        {/* 👉 RIGHT SIDE (MOBILE): LOGIN + MENU */}
        <div className="flex items-center gap-3 sm:hidden">
          {/* LOGIN (MOBILE) */}
          <NavLink
            to="/login"
            className="px-3 py-1.5 rounded-md border border-red-500/40
              text-red-300 text-sm hover:bg-red-500/10 transition"
          >
            Login
          </NavLink>

          {/* ☰ MENU */}
          <button
            onClick={() => setOpen(!open)}
            className="flex flex-col gap-[5px] p-2 rounded-md
              hover:bg-white/10 transition"
          >
            <span className="w-6 h-[2px] bg-red-400" />
            <span className="w-6 h-[2px] bg-red-400" />
            <span className="w-6 h-[2px] bg-red-400" />
          </button>
        </div>

        {/* 🖥️ DESKTOP LINKS (UNCHANGED) */}
        <div className="hidden sm:flex items-center gap-8 text-sm sm:text-base">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>

          <NavLink
            to="/login"
            className="px-4 py-2 rounded-md border border-red-500/40
              text-red-300 hover:bg-red-500/10 hover:text-red-400 transition"
          >
            Login
          </NavLink>

          <NavLink
            to="/signUp"
            className="px-4 py-2 rounded-md bg-gradient-to-r
              from-red-600 to-purple-600
              text-white font-semibold shadow-md hover:scale-105 transition"
          >
            Sign Up
          </NavLink>
        </div>
      </nav>

      {/* 📱 MOBILE MENU (VERTICAL LINKS) */}
      {open && (
        <div className="sm:hidden px-6 py-4 space-y-4
          bg-black/95 border-t border-red-900">

          <NavLink onClick={() => setOpen(false)} to="/" className="block text-gray-300 hover:text-red-400">
            Home
          </NavLink>

          <NavLink onClick={() => setOpen(false)} to="/about" className="block text-gray-300 hover:text-red-400">
            About
          </NavLink>

          <NavLink onClick={() => setOpen(false)} to="/contact" className="block text-gray-300 hover:text-red-400">
            Contact
          </NavLink>

          <NavLink
            onClick={() => setOpen(false)}
            to="/signUp"
            className="block text-center mt-4 px-4 py-2 rounded-md
              bg-gradient-to-r from-red-600 to-purple-600
              text-white font-semibold"
          >
            Sign Up
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default IndexNavBar;
