import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/LLLogo.jpeg";

const UserNavBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    left: 0,
  });

  const navRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();

  /* ---------------- SEARCH SUGGESTIONS ---------------- */
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(
          `${API_URL}/api/product/search?q=${encodeURIComponent(query)}`,
          { credentials: "include" }
        );
        const data = await res.json();
        setSuggestions(Array.isArray(data) ? data : []);
      } catch {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, API_URL]);

  /* ---------------- SLIDING UNDERLINE ---------------- */
  useEffect(() => {
    if (!navRef.current) return;

    const activeLink = navRef.current.querySelector(
      `[data-path="${location.pathname}"]`
    );

    if (activeLink) {
      setIndicatorStyle({
        left: activeLink.offsetLeft,
        width: activeLink.offsetWidth,
      });
    }
  }, [location.pathname]);

  /* ---------------- RESIZE FIX ---------------- */
  useEffect(() => {
    const handleResize = () => {
      if (!navRef.current) return;

      const activeLink = navRef.current.querySelector(
        `[data-path="${location.pathname}"]`
      );

      if (activeLink) {
        setIndicatorStyle({
          left: activeLink.offsetLeft,
          width: activeLink.offsetWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [location.pathname]);

  /* ---------------- HANDLERS ---------------- */
  const handleSearch = () => {
    if (!query.trim()) return;
    setSuggestions([]);
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSuggestionClick = (id) => {
    setSuggestions([]);
    setQuery("");
    navigate(`/product/${id}`);
  };

  const navLinks = [
    ["Profile", "/profile"],
    ["Home", "/home"],
    ["Products", "/products"],
    ["Community", "/community"],
    ["My Cart", "/my-cart"],
    ["My Products", "/myproducts"],
    ["My Orders", "/MyOrders"],
  ];

  return (
    <nav className="sticky top-4 z-50 bg-[#0a0a0a]/90
  backdrop-blur-md
  border border-red-900/40
  mx-3 md:mx-6
  rounded-2xl shadow-lg">


      <div className="max-w-[1400px] mx-auto
        px-3 py-2 md:px-4 md:py-3
        flex flex-wrap md:flex-nowrap
        items-center gap-3 md:gap-4">

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-[5px]
            p-2 rounded-lg
            hover:bg-red-950/40 transition"
        >
          <span className="w-6 h-[2px] bg-zinc-300" />
          <span className="w-6 h-[2px] bg-zinc-300" />
          <span className="w-6 h-[2px] bg-zinc-300" />
        </button>

        {/* LOGO */}
        <Link to="/home" className="flex items-center gap-3 shrink-0">
          <img
            src={logo}
            alt="LocalLynk Logo"
            className="h-9 w-9 md:h-10 md:w-10
              rounded-xl object-cover
              border border-red-900/40 bg-black"
          />
          <span className="text-base md:text-lg
            font-semibold text-red-500">
            LocalLynk
          </span>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <div
          ref={navRef}
          className="hidden md:flex items-center
            gap-6 relative ml-10"
        >
          {navLinks.map(([label, path]) => (
            <Link
              key={path}
              to={path}
              data-path={path}
              className={`px-3 py-1 rounded-full
                text-base font-medium
                transition-all duration-300
                ${location.pathname === path
                  ? "text-red-500 bg-red-950/40"
                  : "text-zinc-400 hover:text-red-500 hover:bg-red-950/30"
                }`}
            >
              {label}
            </Link>
          ))}

          {/* SLIDING INDICATOR */}
          <span
            className="absolute -bottom-1.5 h-[3px]
              bg-gradient-to-r from-red-700 to-red-500
              rounded-full transition-all duration-300"
            style={{
              width: indicatorStyle.width,
              left: indicatorStyle.left,
            }}
          />
        </div>

        {/* SEARCH BAR */}
        <div className="relative w-full
          mt-2 md:mt-0
          md:ml-auto md:max-w-[300px]">

          <div className="flex rounded-xl overflow-hidden
            border border-zinc-700
            focus-within:border-red-700 transition">
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-3 py-2 md:py-3
                bg-[#0f0f0f] text-zinc-200
                placeholder-zinc-500 outline-none"
            />
            <button
              onClick={handleSearch}
              className="px-4 bg-red-700
                text-zinc-100
                rounded-r-xl
                hover:bg-red-800 transition"
            >
              Search
            </button>
          </div>

          {suggestions.length > 0 && (
            <ul className="absolute mt-2 w-full
              bg-[#0f0f0f]
              border border-zinc-700
              rounded-xl shadow-lg z-50">
              {suggestions.map((item) => (
                <li
                  key={item._id}
                  onClick={() => handleSuggestionClick(item._id)}
                  className="px-4 py-3
                    text-sm cursor-pointer
                    text-zinc-200
                    hover:bg-red-950/40 hover:text-red-400
                    transition"
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* LOGOUT DESKTOP */}
        <Link
          to="/logout"
          className="hidden md:block ml-8
            px-4 py-1.5 rounded-full
            text-base font-medium
            text-red-500
            hover:bg-red-950/40 transition"
        >
          Logout
        </Link>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden
          bg-[#0a0a0a]
          border-t border-zinc-800
          rounded-b-2xl
          px-4 py-4 space-y-3">
          {navLinks.map(([label, path]) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-lg
                text-sm font-medium
                ${location.pathname === path
                  ? "text-red-500 bg-red-950/40"
                  : "text-zinc-400 hover:text-red-500 hover:bg-red-950/30"
                }`}
            >
              {label}
            </Link>
          ))}

          <Link
            to="/logout"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-lg
              text-sm font-medium text-red-600
              hover:bg-red-950/40"
          >
            Logout
          </Link>
        </div>
      )}
    </nav>
  );
};

export default UserNavBar;
