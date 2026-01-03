import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import UserNavBar from "../components/UserNavBar";

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/MyProducts`, {
          method: "GET",
          credentials: "include",
        });

        if (res.status === 401) {
          navigate("/login");
          return;
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setProducts(Array.isArray(data.products) ? data.products : []);
      } catch (err) {
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchMyProducts();
  }, [API_URL, navigate]);

  const markAsSold = async (productId) => {
    const confirm = window.confirm(
      "Are you sure you want to mark this product as sold?"
    );
    if (!confirm) return;

    const prevProducts = [...products];
    setProducts((prev) =>
      prev.map((p) =>
        p._id === productId
          ? { ...p, status: "sold", quantity: 0 }
          : p
      )
    );

    try {
      const res = await fetch(
        `${API_URL}/api/products/mark-sold/${productId}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to update product");
    } catch {
      setProducts(prevProducts);
      alert("Failed to mark product as sold. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 bg-gradient-to-br from-slate-950 via-zinc-950 to-black">
        Loading your products…
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-950 via-zinc-950 to-black overflow-hidden">
      {/* 🎴 INFINITY CASTLE AURA */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(139,92,246,0.06),transparent_70%)]" />

      <div className="relative z-10">
        <UserNavBar />

        {/* HEADER */}
        <div className="sticky top-0 z-10 backdrop-blur bg-black/70 border-b border-slate-800">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold tracking-wide text-slate-200">
              My Products
            </h1>

            <Link
              to="/sell-products"
              className="inline-flex items-center gap-2 rounded-lg
              bg-slate-900 border border-slate-700
              px-4 py-2 text-sm font-medium text-slate-200
              hover:bg-slate-800 transition"
            >
              + Sell Product
            </Link>
          </div>
        </div>

        {/* CONTENT */}
        <div className="max-w-6xl mx-auto px-6 py-10">
          {error && (
            <div className="mb-6 rounded-lg border border-rose-900/60 bg-rose-950/40 px-4 py-3 text-rose-300">
              {error}
            </div>
          )}

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 text-5xl opacity-70">📦</div>
              <p className="text-slate-400 mb-6">
                You haven’t added any products yet.
              </p>
              <Link
                to="/sell-products"
                className="rounded-lg bg-slate-900 border border-slate-700 px-6 py-3 text-slate-200 font-medium hover:bg-slate-800 transition"
              >
                Add Your First Product
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="group relative cursor-pointer rounded-2xl
                  bg-black/80 border border-slate-800
                  backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.8)]
                  transition-all duration-300 hover:scale-[1.02]"
                >
                  {/* STATUS BADGE */}
                  <div className="absolute top-4 right-4 z-10">
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        product.status === "available" &&
                          markAsSold(product._id);
                      }}
                      className={`rounded-full px-3 py-1 text-xs font-medium tracking-wide
                      ${product.status === "available"
                          ? "bg-slate-800 text-slate-200 hover:bg-slate-700"
                          : "bg-slate-900 text-slate-500 cursor-not-allowed"
                        }`}
                    >
                      {product.status === "available" ? "AVAILABLE" : "SOLD"}
                    </span>
                  </div>

                  {/* IMAGE */}
                  <div className="overflow-hidden rounded-t-2xl">
                    <img
                      src={product.images?.[0] || "/placeholder.png"}
                      alt={product.name}
                      className="h-48 w-full object-cover
                      transition-transform duration-700
                      group-hover:scale-105"
                    />
                  </div>

                  {/* BODY */}
                  <div className="p-5">
                    <h2 className="text-lg font-medium text-slate-200 tracking-wide">
                      {product.name}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400 line-clamp-2">
                      {product.description || "No description"}
                    </p>

                    <div className="mt-4 flex justify-between items-end">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-slate-500">
                          Quantity
                        </p>
                        <p className="text-lg font-medium text-slate-300">
                          {product.quantity}
                        </p>
                      </div>

                      <p className="text-2xl font-semibold text-indigo-400">
                        ₹{product.price}
                      </p>
                    </div>

                    {product.status === "available" && (
                      <p className="mt-3 text-xs text-slate-500 italic">
                        Tap on <span className="relative font-semibold text-emerald-400">
                          "AVAILABLE"
                          <span className="absolute left-0 -bottom-0.5 h-[2px] w-full bg-emerald-400 opacity-70 animate-pulse"></span>
                        </span>
                        <span>    </span>
                        to mark as sold
                      </p>
                    )}
                  </div>

                  {/* NAKIME DEPTH OVERLAY */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl
                  bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_65%)]" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProducts;
