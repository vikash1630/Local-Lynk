import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavBar from "../components/UserNavBar";

const MyCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  /* ---------------- FETCH CART ---------------- */
  const fetchCart = async () => {
    try {
      const res = await fetch(`${API_URL}/api/cart/items`, {
        credentials: "include",
      });

      if (res.status === 401) {
        setError("Please login to view your cart");
        navigate("/login");
        return;
      }

      const data = await res.json();
      setCartItems(Array.isArray(data.cart) ? data.cart : []);
    } catch {
      setError("Failed to load cart. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [API_URL]);

  /* ---------------- REMOVE ---------------- */
  const removeFromCart = async (productId) => {
    setError("");
    setActionLoading(productId);

    try {
      const res = await fetch(
        `${API_URL}/api/cart/remove/${productId}`,
        { method: "DELETE", credentials: "include" }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setCartItems((prev) =>
        prev.filter((item) => item.product._id !== productId)
      );
    } catch (err) {
      setError(err.message || "Failed to remove item");
    } finally {
      setActionLoading(null);
    }
  };

  /* ---------------- ADD ---------------- */
  const addToCart = async (productId) => {
    setError("");
    setActionLoading(productId);

    try {
      const res = await fetch(
        `${API_URL}/api/cart/add/${productId}`,
        { method: "POST", credentials: "include" }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      await fetchCart();
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setActionLoading(null);
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 animate-pulse bg-slate-900">
        Loading cart…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* 🌫️ HASHIRA MIST */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.25),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(251,146,60,0.18),transparent_60%)]" />

      <div className="relative z-10">
        <UserNavBar />

        <div className="max-w-6xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-slate-100 mb-8">
            🛒 Cart Inventory
          </h1>

          {/* ERROR */}
          {error && (
            <div className="mb-6 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-rose-300">
              {error}
            </div>
          )}

          {/* EMPTY CART */}
          {cartItems.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-slate-400 text-lg mb-6">
                Your cart is empty
              </p>
              <button
                onClick={() => navigate("/home")}
                className="px-8 py-3 rounded-xl bg-cyan-500 text-slate-900 font-semibold hover:bg-cyan-400 transition"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <>
              {/* ITEMS */}
              <div className="space-y-6">
                {cartItems.map((item) => {
                  const maxReached =
                    item.quantity >= item.product.quantity;
                  const outOfStock =
                    item.product.quantity === 0 ||
                    item.product.status === "sold";

                  return (
                    <div
                      key={item._id}
                      className="flex flex-col sm:flex-row gap-5 rounded-2xl border border-slate-700 bg-slate-800/70 backdrop-blur-xl p-5 shadow-lg hover:shadow-xl transition"
                    >
                      {/* IMAGE */}
                      <img
                        src={
                          item.product.images?.[0] ||
                          "/placeholder.png"
                        }
                        alt={item.product.name}
                        className="w-full sm:w-28 h-28 object-cover rounded-xl cursor-pointer"
                        onClick={() =>
                          navigate(`/product/${item.product._id}`)
                        }
                      />

                      {/* DETAILS */}
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-slate-100">
                          {item.product.name}
                        </h2>

                        <p className="text-sm text-slate-400 mt-1">
                          {item.product.description}
                        </p>

                        <div className="mt-3 flex items-center gap-3">
                          <span className="text-sm text-slate-400">
                            Quantity
                          </span>
                          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-sm font-semibold">
                            {item.quantity}
                          </span>
                        </div>

                        {outOfStock && (
                          <p className="mt-1 text-xs text-rose-400">
                            Out of stock
                          </p>
                        )}

                        {maxReached && !outOfStock && (
                          <p className="mt-1 text-xs text-amber-400">
                            Maximum quantity reached
                          </p>
                        )}

                        <p className="mt-3 text-xl font-bold text-amber-400">
                          ₹{item.product.price * item.quantity}
                        </p>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex sm:flex-col gap-4 sm:items-end">
                        <button
                          disabled={
                            actionLoading === item.product._id
                          }
                          onClick={() =>
                            removeFromCart(item.product._id)
                          }
                          className="text-sm text-rose-400 hover:text-rose-300 transition disabled:opacity-50"
                        >
                          {actionLoading === item.product._id
                            ? "Removing…"
                            : "Remove"}
                        </button>

                        <button
                          disabled={
                            outOfStock ||
                            maxReached ||
                            actionLoading ===
                              item.product._id
                          }
                          onClick={() =>
                            addToCart(item.product._id)
                          }
                          className={`text-sm transition ${
                            outOfStock || maxReached
                              ? "text-slate-500 cursor-not-allowed"
                              : "text-cyan-300 hover:text-cyan-200"
                          }`}
                        >
                          {actionLoading === item.product._id
                            ? "Adding…"
                            : "Add more"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* SUMMARY */}
              <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-slate-700 pt-6">
                <h2 className="text-2xl font-semibold text-slate-100">
                  Total: ₹{totalPrice}
                </h2>

                <button
                  onClick={() => navigate("/checkout")}
                  className="px-10 py-3 rounded-xl bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400 transition shadow-lg"
                >
                  Proceed to Checkout →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCart;
