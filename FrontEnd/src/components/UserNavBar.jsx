import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

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
          {
            method: "GET",
            credentials: "include",
          }
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
    <nav className="sticky top-0 z-50 bg-slate-900 border-b border-rose-900/40">
      <div className="max-w-[1400px] mx-auto px-3 py-2 flex items-center gap-3">

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-[5px] p-2 rounded-md hover:bg-slate-800 transition"
        >
          <span className="w-6 h-[2px] bg-slate-300" />
          <span className="w-6 h-[2px] bg-slate-300" />
          <span className="w-6 h-[2px] bg-slate-300" />
        </button>

        {/* APP LOGO */}
        <Link to="/home" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-500 to-fuchsia-500 flex items-center justify-center text-sm font-bold text-white">
            LL
          </div>
          <span className="text-base font-semibold text-rose-400">
            LocalLynk
          </span>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <div
          ref={navRef}
          className="hidden md:flex items-center gap-6 relative ml-8"
        >
          {navLinks.map(([label, path]) => (
            <Link
              key={path}
              to={path}
              data-path={path}
              className={`text-sm font-medium transition-colors ${
                location.pathname === path
                  ? "text-rose-400"
                  : "text-slate-300 hover:text-rose-400"
              }`}
            >
              {label}
            </Link>
          ))}

          <span
            className="absolute -bottom-1 h-[2px] bg-rose-500 rounded-full transition-all duration-300 ease-in-out"
            style={{
              width: indicatorStyle.width,
              left: indicatorStyle.left,
            }}
          />
        </div>

        {/* SEARCH BAR */}
        <div className="relative ml-auto w-full md:w-[320px] max-w-[260px]">
          <div className="flex rounded-md overflow-hidden border border-slate-600 focus-within:border-rose-500 transition">
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-2 py-2 text-sm bg-slate-800 text-slate-200 placeholder-slate-400 outline-none"
            />
            <button
              onClick={handleSearch}
              className="px-3 bg-rose-600 text-white text-sm hover:bg-rose-700 transition"
            >
              Search
            </button>
          </div>

          {suggestions.length > 0 && (
            <ul className="absolute mt-1 w-full bg-slate-800 border border-slate-700 rounded shadow z-50">
              {suggestions.map((item) => (
                <li
                  key={item._id}
                  onClick={() => handleSuggestionClick(item._id)}
                  className="px-3 py-2 text-sm cursor-pointer text-slate-200 hover:bg-rose-900/30 hover:text-rose-400 transition"
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
          className="hidden md:block ml-6 text-sm font-medium text-rose-400 hover:text-rose-500 transition"
        >
          Logout
        </Link>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-4 space-y-4 transition-all duration-200">
          {navLinks.map(([label, path]) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={`block text-sm font-medium py-2 ${
                location.pathname === path
                  ? "text-rose-400 underline"
                  : "text-slate-300 hover:text-rose-400"
              }`}
            >
              {label}
            </Link>
          ))}

          <Link
            to="/logout"
            onClick={() => setMobileOpen(false)}
            className="block text-sm font-medium text-rose-500 pt-3"
          >
            Logout
          </Link>
        </div>
      )}
    </nav>
  );
};

export default UserNavBar;
