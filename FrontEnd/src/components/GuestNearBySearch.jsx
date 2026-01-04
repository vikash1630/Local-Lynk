import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GuestNearbySearch = () => {
  const [distance, setDistance] = useState("");
  const [loading, setLoading] = useState(false);
  const [nearbyProducts, setNearbyProducts] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!distance) return alert("Select distance");
    if (!navigator.geolocation) return alert("Geolocation not supported");

    setHasSearched(true);
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `${API_URL}/api/product/nearbyProducts/${coords.latitude}/${coords.longitude}/${distance}`
          );
          const data = await res.json();
          setNearbyProducts(Array.isArray(data) ? data : []);
        } catch {
          setNearbyProducts([]);
        } finally {
          setLoading(false);
        }
      },
      () => {
        alert("Location permission denied");
        setLoading(false);
      }
    );
  };

  return (
    <div className="relative bg-[#0b1020] overflow-hidden">
      {/* 🌸 KANAO BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(236,72,153,0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(167,139,250,0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1020] via-[#111827] to-[#1e1b4b]/40" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* SEARCH CARD */}
        <div className="rounded-2xl sm:rounded-3xl bg-[#020617]/70 backdrop-blur-xl
          border border-violet-900/30 p-4 sm:p-6 shadow-xl mb-8 sm:mb-10">

          <h2 className="text-xl sm:text-2xl font-bold
            bg-gradient-to-r from-pink-300 to-violet-300
            text-transparent bg-clip-text mb-2">
            Discover Nearby Products
          </h2>

          <p className="text-slate-400 text-sm mb-4">
            Quietly explore what’s available around you
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="w-full sm:w-auto bg-[#020617]/70
                border border-slate-700 text-slate-200
                rounded px-3 py-2"
            >
              <option value="">Select distance</option>
              <option value="1000">1 km</option>
              <option value="3000">3 km</option>
              <option value="5000">5 km</option>
              <option value="10000">10 km</option>
              <option value="20000">20 km</option>
            </select>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2 rounded
                bg-gradient-to-r from-pink-500 to-violet-500
                text-white font-semibold transition hover:opacity-90"
            >
              {loading ? "Searching..." : "Find Nearby"}
            </button>
          </div>
        </div>

        {/* HEADING */}
        <h2 className="text-2xl font-bold text-slate-200 mb-6">
          Nearby Products
        </h2>

        {/* PRODUCTS GRID */}
        {nearbyProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {nearbyProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/GuestProduct/${product._id}`)}
                className="group rounded-2xl bg-[#020617]/70 backdrop-blur-xl
                  border border-slate-700 p-4 cursor-pointer shadow-lg transition
                  hover:scale-105 hover:shadow-[0_25px_70px_rgba(167,139,250,0.18)]"
              >
                <img
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.name}
                  className="h-40 w-full object-cover rounded-xl"
                />

                <h3 className="mt-3 text-lg font-semibold text-slate-200">
                  {product.name}
                </h3>

                <p className="text-sm text-slate-400 line-clamp-2">
                  {product.description}
                </p>

                <p className="text-xl font-bold text-pink-300 mt-2">
                  ₹{product.price}
                </p>

                <div className="mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/login");
                    }}
                    className="w-full py-2 rounded
                      bg-gradient-to-r from-pink-500 to-violet-500
                      text-white font-medium transition hover:opacity-90"
                  >
                    Login to Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {hasSearched && !loading && nearbyProducts.length === 0 && (
          <p className="text-slate-400 mt-6">
            No nearby products found.
          </p>
        )}
      </div>
    </div>
  );
};

export default GuestNearbySearch;
