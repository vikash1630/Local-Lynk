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
      <div className="min-h-screen flex items-center justify-center text-slate-400 bg-gradient-to-br from-slate-900 to-zinc-900">
        Loading your products…
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-950 overflow-hidden">
      {/* RADIAL DEMON AURA */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.12),transparent_60%)]" />

      <div className="relative z-10">
        <UserNavBar />

        {/* HEADER */}
        <div className="sticky top-0 z-10 backdrop-blur bg-slate-900/80 border-b border-slate-800">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              My Products
            </h1>

            <Link
              to="/sell-products"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
            >
              + Sell Product
            </Link>
          </div>
        </div>

        {/* CONTENT */}
        <div className="max-w-6xl mx-auto px-6 py-10">
          {error && (
            <div className="mb-6 rounded-lg border border-red-800 bg-red-950/60 px-4 py-3 text-red-300">
              {error}
            </div>
          )}

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 text-5xl">📦</div>
              <p className="text-slate-400 mb-6">
                You haven’t added any products yet.
              </p>
              <Link
                to="/sell-products"
                className="rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-white font-semibold hover:opacity-90 transition"
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
      bg-gradient-to-br from-[#1a102a]/90 via-[#22143a]/85 to-[#1a102a]/90
      border border-violet-900/60 backdrop-blur-xl
      shadow-lg hover:shadow-[0_0_40px_rgba(168,85,247,0.35)]
      transition-all duration-300 hover:scale-[1.025]"
                >
                  {/* STATUS BADGE */}
                  <div className="absolute top-4 right-4 z-10">
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        product.status === "available" && markAsSold(product._id);
                      }}
                      className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide
          ${product.status === "available"
                          ? "bg-emerald-900/70 text-emerald-300 hover:bg-emerald-800/70"
                          : "bg-rose-900/70 text-rose-300 cursor-not-allowed"
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
          group-hover:scale-110"
                    />
                  </div>

                  {/* BODY */}
                  <div className="p-5">
                    <h2 className="text-lg font-semibold text-violet-300 tracking-wide">
                      {product.name}
                    </h2>

                    <p className="mt-1 text-sm text-violet-200/70 line-clamp-2">
                      {product.description || "No description"}
                    </p>

                    <div className="mt-4 flex justify-between items-end">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-violet-400/60">
                          Quantity
                        </p>
                        <p className="text-lg font-semibold text-violet-200">
                          {product.quantity}
                        </p>
                      </div>

                      <p className="text-2xl font-bold text-fuchsia-400">
                        ₹{product.price}
                      </p>
                    </div>

                    {product.status === "available" && (
                      <p className="mt-3 text-xs text-violet-400 italic">
                        Tap On "Available" Button to mark as sold
                      </p>
                    )}
                  </div>

                  {/* SHINOBU POISON AURA */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl
      bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_60%)]" />
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
