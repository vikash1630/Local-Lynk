import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserNavBar from "../components/UserNavBar";

const BuyNow = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  /* ---------------- FETCH PRODUCT ---------------- */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/product/${productId}`,
          { credentials: "include" }
        );

        if (res.status === 401) {
          navigate("/login");
          return;
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setProduct(data);
      } catch (err) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [API_URL, productId, navigate]);

  /* ---------------- PLACE ORDER ---------------- */
  const placeOrder = async () => {
    setError("");
    setPlacingOrder(true);

    try {
      const res = await fetch(
        `${API_URL}/api/orders/buy-now/${productId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setOrderSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  /* ---------------- HISTORY CONTROL ---------------- */
  useEffect(() => {
    if (orderSuccess) {
      window.history.replaceState(null, "", "/home");
    }
  }, [orderSuccess]);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-cyan-400 animate-pulse">
        Loading product…
      </div>
    );
  }

  /* ---------------- PRODUCT NOT FOUND ---------------- */
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-rose-400">
        Product not found
      </div>
    );
  }

  /* ---------------- SUCCESS SCREEN ---------------- */
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-slate-950">
        <UserNavBar />

        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
          <div className="rounded-2xl border border-cyan-400/40 bg-cyan-400/10 px-10 py-12 shadow-[0_0_40px_rgba(34,211,238,0.25)]">
            <h1 className="text-3xl font-extrabold text-cyan-400 mb-4 tracking-wide">
              ☯ ORDER DOMINATED
            </h1>

            <p className="text-slate-300 mb-8">
              Your order has been accepted into the system.
            </p>

            <button
              onClick={() => navigate("/MyOrders")}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-slate-900 font-bold hover:opacity-90 transition"
            >
              View My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- MAIN UI ---------------- */
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* 🔮 AKAZA ENERGY */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.35),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(217,70,239,0.35),transparent_60%)]" />

      <div className="relative z-10">
        <UserNavBar />

        <div className="max-w-5xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-extrabold text-cyan-400 mb-8 tracking-wide">
            🧾 REVIEW & EXECUTE
          </h1>

          {/* ERROR */}
          {error && (
            <div className="mb-6 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-rose-300">
              {error}
            </div>
          )}

          {/* PRODUCT CARD */}
          <div className="flex flex-col md:flex-row gap-8 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 shadow-2xl">
            <img
              src={product.images?.[0] || "/placeholder.png"}
              alt={product.name}
              className="w-full md:w-64 h-64 object-cover rounded-xl"
            />

            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-slate-100">
                {product.name}
              </h2>

              <p className="mt-2 text-slate-400">
                {product.description}
              </p>

              <p className="mt-4 text-3xl font-extrabold text-fuchsia-500">
                ₹{product.price}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Available Quantity: {product.quantity}
              </p>

              {(product.status === "sold" || product.quantity === 0) && (
                <p className="mt-2 text-sm text-rose-400">
                  Product is out of stock
                </p>
              )}
            </div>
          </div>

          {/* ACTION */}
          <div className="mt-10 flex justify-end">
            <button
              disabled={
                placingOrder ||
                product.quantity === 0 ||
                product.status === "sold"
              }
              onClick={placeOrder}
              className={`px-12 py-3 rounded-xl font-extrabold tracking-wide transition shadow-xl ${
                placingOrder ||
                product.quantity === 0 ||
                product.status === "sold"
                  ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-slate-900 hover:opacity-90"
              }`}
            >
              {placingOrder ? "EXECUTING…" : "PLACE ORDER"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNow;
