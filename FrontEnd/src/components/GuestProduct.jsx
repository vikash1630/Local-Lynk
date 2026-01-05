import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import IndexNavBar from "../components/IndexNavBar";

const API_URL = import.meta.env.VITE_API_URL;

const GuestProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    let ignore = false;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/product/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Product not found");
        if (!ignore) setProduct(data);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchProduct();
    return () => (ignore = true);
  }, [id]);

  /* ================= UI STATES ================= */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b1020] text-slate-400">
        Loading product…
      </div>
    );

  if (error || !product)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b1020] text-violet-400">
        {error || "Product not available"}
      </div>
    );

  const outOfStock = product.status === "sold" || product.quantity === 0;

  /* ================= UI ================= */
  return (
    <div className="relative min-h-screen bg-[#020617]">
      {/* NAVBAR */}
      <IndexNavBar />

      {/* 👇 OFFSET FOR FIXED NAVBAR */}
      <div className="pt-16 lg:pt-20">
        <div className="min-h-screen bg-gradient-to-br from-[#0b1020] via-[#111827] to-[#1e1b4b] relative overflow-hidden">

          {/* BACKGROUND GLOWS */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(167,139,250,0.18),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(45,212,191,0.18),transparent_55%)]" />

          {/* CONTENT */}
          <div className="relative max-w-6xl mx-auto px-4 py-12">
            <div className="grid lg:grid-cols-2 gap-10">

              {/* IMAGE */}
              <div className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                <img
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.name}
                  className="w-full h-[320px] lg:h-[420px] object-cover"
                />
              </div>

              {/* DETAILS */}
              <div className="rounded-3xl bg-[#020617]/70 backdrop-blur-xl border border-violet-900/30 p-8 text-zinc-200 space-y-6 shadow-2xl">
                <h1 className="text-3xl font-semibold text-violet-300">
                  {product.name}
                </h1>

                <p className="text-2xl font-bold text-teal-300">
                  ₹{product.price}
                </p>

                {/* STOCK */}
                <div>
                  <span
                    className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold
                      ${
                        outOfStock
                          ? "bg-violet-500/20 text-violet-300"
                          : product.quantity <= 3
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-teal-500/20 text-teal-300"
                      }`}
                  >
                    {outOfStock ? "Out of Stock" : `${product.quantity} left`}
                  </span>
                </div>

                <p className="text-sm text-zinc-400 leading-relaxed">
                  {product.description}
                </p>

                {/* SELLER INFO */}
                <div className="border-t border-white/10 pt-4 text-sm">
                  <p>
                    <span className="text-zinc-400">Seller:</span>{" "}
                    {product.owner?.name || "—"}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={() => setShowAuthPopup(true)}
                    disabled={outOfStock}
                    className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition disabled:opacity-50"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => setShowAuthPopup(true)}
                    disabled={outOfStock}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 hover:scale-[1.03] transition disabled:opacity-50"
                  >
                    Buy Now
                  </button>
                </div>

                <button
                  onClick={() => setShowAuthPopup(true)}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:opacity-90 transition"
                >
                  Contact Seller
                </button>
              </div>
            </div>
          </div>

          {/* AUTH POPUP */}
          {showAuthPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur">
              <div className="w-[90%] max-w-md rounded-2xl bg-[#020617] border border-violet-900/40 p-6 shadow-2xl">
                <h2 className="text-xl font-bold text-violet-300 mb-4">
                  Login Required
                </h2>

                <p className="text-slate-400 mb-6">
                  Please login or sign up to continue.
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowAuthPopup(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => navigate("/login")}
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-semibold hover:opacity-90"
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default GuestProduct;
