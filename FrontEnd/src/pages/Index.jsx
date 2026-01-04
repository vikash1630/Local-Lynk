import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import IndexNavBar from "../components/IndexNavBar";
import GuestNearbySearch from "../components/GuestNearBySearch";

const Index = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  /* ---------------- FETCH PRODUCTS (GUEST) ---------------- */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_URL}/api/products?search=${encodeURIComponent(
            searchQuery || ""
          )}`
        );

        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, API_URL]);

  return (
    <div className="relative min-h-screen bg-[#0b1020] overflow-hidden">
      {/* 🌙 HARMONY BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.20),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(167,139,250,0.20),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(45,212,191,0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1020] via-[#111827] to-[#1e1b4b]/40" />

      <div className="relative z-10">
        <IndexNavBar />

        <GuestNearbySearch />

        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* TITLE */}
          <h1 className="text-3xl font-extrabold mb-8
            bg-gradient-to-r from-pink-300 via-violet-300 to-rose-300
            text-transparent bg-clip-text">
            {searchQuery ? `Results for "${searchQuery}"` : "All Products"}
          </h1>

          {/* LOADING */}
          {loading && (
            <p className="text-slate-400">Loading products...</p>
          )}

          {/* EMPTY */}
          {!loading && products.length === 0 && (
            <p className="text-slate-400">No products found</p>
          )}

          {/* PRODUCTS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/GuestProduct/${product._id}`)}
                className="group flex flex-col rounded-2xl
                  bg-[#020617]/70 backdrop-blur-xl
                  border border-violet-900/30
                  p-4 cursor-pointer shadow-lg
                  transition-all duration-300
                  hover:scale-[1.03]
                  hover:shadow-[0_30px_80px_rgba(167,139,250,0.22)]"
              >
                {/* IMAGE */}
                <img
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.name}
                  className="h-40 w-full object-cover rounded-xl"
                />

                {/* CONTENT */}
                <div className="flex flex-col flex-1 mt-3">
                  <h3 className="text-lg font-semibold text-slate-200 line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                    {product.description}
                  </p>

                  <p className="text-xl font-bold text-pink-300 mt-2">
                    ₹{product.price}
                  </p>

                  {/* ACTION */}
                  <div className="mt-auto pt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAuthPopup(true);
                      }}
                      className="w-full py-2 rounded text-sm font-medium
                        bg-gradient-to-r from-pink-500 via-violet-500 to-rose-500
                        text-white transition hover:opacity-90"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AUTH POPUP */}
      {showAuthPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur">
          <div className="w-[90%] max-w-md rounded-2xl
            bg-[#020617] border border-violet-900/40
            p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-violet-300 mb-4">
              Login Required
            </h2>

            <p className="text-slate-400 mb-6">
              Please login or sign up to continue with purchase.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAuthPopup(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                No
              </button>

              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 rounded-lg
                  bg-gradient-to-r from-pink-500 to-violet-500
                  text-white font-semibold hover:opacity-90"
              >
                Yes, Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
