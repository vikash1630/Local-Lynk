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
    <nav className="sticky top-0 z-50 bg-[#0a0a0a] border-b border-red-900/40">
      <div className="max-w-[1400px] mx-auto px-3 py-2 md:px-4 md:py-3 flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-4">

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-[5px] p-2 rounded-md hover:bg-red-950/40 transition"
        >
          <span className="w-6 h-[2px] bg-zinc-300" />
          <span className="w-6 h-[2px] bg-zinc-300" />
          <span className="w-6 h-[2px] bg-zinc-300" />
        </button>

        {/* APP LOGO */}
        <Link to="/home" className="flex items-center gap-2 md:gap-3 shrink-0">
          <img
            src={logo}
            alt="LocalLynk Logo"
            className="
    h-8 w-8 md:h-10 md:w-10
    object-cover
    rounded-md
    border border-red-900/40
    bg-black
  "
          />

          <span className="text-base md:text-lg font-semibold text-red-500 leading-none">
            LocalLynk
          </span>
        </Link>


        {/* DESKTOP NAV LINKS */}
        <div
          ref={navRef}
          className="hidden md:flex items-center gap-8 relative ml-10"
        >
          {navLinks.map(([label, path]) => (
            <Link
              key={path}
              to={path}
              data-path={path}
              className={`text-base font-medium transition-colors ${location.pathname === path
                ? "text-red-500"
                : "text-zinc-400 hover:text-red-500"
                }`}
            >
              {label}
            </Link>
          ))}

          <span
            className="absolute -bottom-1.5 h-[3px]
              bg-gradient-to-r from-red-700 to-red-500
              rounded-full transition-all duration-300 ease-in-out"
            style={{
              width: indicatorStyle.width,
              left: indicatorStyle.left,
            }}
          />
        </div>

        {/* SEARCH BAR (FIXED) */}
        <div className="relative w-full mt-2 md:mt-0 md:ml-auto md:max-w-[300px]">
          <div className="flex rounded-md md:rounded-lg overflow-hidden
            border border-zinc-700 focus-within:border-red-700 transition">
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-3 py-2 md:px-3 md:py-3
                text-sm md:text-base
                bg-[#0f0f0f] text-zinc-200
                placeholder-zinc-500 outline-none"
            />
            <button
              onClick={handleSearch}
              className="px-4 bg-red-700 text-zinc-100
                text-sm md:text-base hover:bg-red-800 transition"
            >
              Search
            </button>
          </div>

          {suggestions.length > 0 && (
            <ul className="absolute mt-1 w-full bg-[#0f0f0f]
              border border-zinc-700 rounded shadow z-50">
              {suggestions.map((item) => (
                <li
                  key={item._id}
                  onClick={() => handleSuggestionClick(item._id)}
                  className="px-4 py-2 md:py-3
                    text-sm md:text-base cursor-pointer
                    text-zinc-200 hover:bg-red-950/40 hover:text-red-400 transition"
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* LOGOUT (DESKTOP) */}
        <Link
          to="/logout"
          className="hidden md:block ml-8 text-base font-medium text-red-500 hover:text-red-600 transition"
        >
          Logout
        </Link>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0a0a0a] border-t border-zinc-800 px-4 py-4 space-y-4">
          {navLinks.map(([label, path]) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={`block text-sm font-medium py-2 ${location.pathname === path
                ? "text-red-500"
                : "text-zinc-400 hover:text-red-500"
                }`}
            >
              {label}
            </Link>
          ))}

          <Link
            to="/logout"
            onClick={() => setMobileOpen(false)}
            className="block text-sm font-medium text-red-600 pt-3"
          >
            Logout
          </Link>
        </div>
      )}
    </nav>
  );
};

export default UserNavBar;
