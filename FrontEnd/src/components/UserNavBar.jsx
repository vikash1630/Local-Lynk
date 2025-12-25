import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const UserNavBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate(); // ✅ FIX

  useEffect(() => {

    const timer = setTimeout(async () => {
      console.log("Typing:", query);
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
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch suggestions");
        }

        const data = await res.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching search suggestions:", error);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, API_URL]);

  const handleSuggestionClick = (productId) => {
    setSuggestions([]);
    setQuery("");
    navigate(`/product/${productId}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim()) {
      setSuggestions([]);
      navigate(`/products?search=${encodeURIComponent(query)}`);
    }
  };


  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">

      {/* LEFT LINKS */}
      <div className="flex items-center gap-6">
        <Link to="/profile" className="text-gray-700 font-medium hover:text-blue-600">
          Profile
        </Link>
        <Link to="/settings" className="text-gray-700 font-medium hover:text-blue-600">
          Settings
        </Link>
      </div>

      {/* SEARCH BAR */}
      <div className="relative w-72">
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-black"
        />

        {suggestions.length > 0 && (
          <ul className="absolute top-11 left-0 w-full bg-white border border-gray-200 rounded-md shadow-md z-20">
            {suggestions.map((item) => (
              <li
                key={item._id}
                onClick={() => handleSuggestionClick(item._id)}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* RIGHT LINK */}
      <Link to="/logout" className="text-red-600 font-medium hover:text-red-700">
        Logout
      </Link>
    </nav>
  );
};

export default UserNavBar;
