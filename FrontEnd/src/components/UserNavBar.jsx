import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const UserNavBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();

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
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await res.json();
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, API_URL]);

  const handleSearch = () => {
    if (!query.trim()) return;
    setSuggestions([]);
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  const handleSuggestionClick = (productId) => {
    setSuggestions([]);
    setQuery("");
    navigate(`/product/${productId}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const navLinks = [
    ["Profile", "/profile"],
    ["Home", "/home"],
    ["Products", "/products"],
    ["Community", "/community"],
    ["My Cart", "/my-cart"],
    ["My Products", "/myproducts"],
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-800 border-b border-rose-900/40">
      <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">

        {/* LEFT LINKS (DESKTOP) */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(([label, path]) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`relative text-sm font-medium transition ${
                  isActive
                    ? "text-rose-400"
                    : "text-slate-300 hover:text-rose-400"
                }`}
              >
                {label}
                {isActive && (
                  <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-rose-500" />
                )}
              </Link>
            );
          })}
        </div>

        {/* MOBILE MENU BUTTON (≡) */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-[5px] p-2"
        >
          <span className="w-6 h-[2px] bg-slate-300" />
          <span className="w-6 h-[2px] bg-slate-300" />
          <span className="w-6 h-[2px] bg-slate-300" />
        </button>

        {/* SEARCH BAR (ALWAYS VISIBLE) */}
        <div className="relative w-[320px] mx-4">
          <div className="flex rounded-md overflow-hidden border border-slate-600 focus-within:border-rose-500 transition">
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-3 py-2 text-sm bg-slate-700 text-slate-200 placeholder-slate-400 outline-none"
            />
            <button
              onClick={handleSearch}
              className="px-4 bg-rose-600 text-white text-sm hover:bg-rose-700 transition"
            >
              Search
            </button>
          </div>

          {suggestions.length > 0 && (
            <ul className="absolute mt-1 w-full bg-slate-700 border border-slate-600 rounded shadow z-50">
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
          className="hidden md:block text-sm font-medium text-rose-400 hover:text-rose-500 transition"
        >
          Logout
        </Link>
      </div>

      {/* MOBILE MENU (LINKS ONLY) */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700 px-4 py-4 space-y-3">
          {navLinks.map(([label, path]) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileOpen(false)}
                className={`block text-sm font-medium ${
                  isActive
                    ? "text-rose-400 underline"
                    : "text-slate-300 hover:text-rose-400"
                }`}
              >
                {label}
              </Link>
            );
          })}

          <Link
            to="/logout"
            onClick={() => setMobileOpen(false)}
            className="block text-sm font-medium text-rose-500 pt-2"
          >
            Logout
          </Link>
        </div>
      )}
    </nav>
  );
};

export default UserNavBar;
