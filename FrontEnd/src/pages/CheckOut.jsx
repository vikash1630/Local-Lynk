import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavBar from "../components/UserNavBar";

const CheckOut = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  /* ---------------- FETCH CART ---------------- */
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`${API_URL}/api/cart/items`, {
          credentials: "include",
        });

        if (res.status === 401) {
          navigate("/login");
          return;
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setCart(Array.isArray(data.cart) ? data.cart : []);
      } catch (err) {
        setError(err.message || "Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [API_URL, navigate]);

  /* ---------------- TOTAL PRICE ---------------- */
  const totalAmount = cart.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + item.product.price * item.quantity;
  }, 0);

  /* ---------------- PLACE ORDER ---------------- */
  const placeOrder = async () => {
    setError("");
    setPlacingOrder(true);

    try {
      const res = await fetch(`${API_URL}/api/checkOut/buy-cart`, {
        method: "POST",
        credentials: "include",
      });

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
      // 🔥 Remove checkout from browser history
      window.history.replaceState(null, "", "/MyOrders");
    }
  }, [orderSuccess]);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-cyan-400 animate-pulse">
        Loading cart…
      </div>
    );
  }

  /* ---------------- EMPTY CART ---------------- */
  if (!cart.length) {
    return (
      <div className="min-h-screen bg-slate-950">
        <UserNavBar />
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <h1 className="text-3xl font-bold text-slate-200 mb-4">
            🛒 Your cart is empty
          </h1>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-8 py-3 rounded-xl bg-cyan-500 text-slate-900 font-semibold hover:bg-cyan-400 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- SUCCESS ---------------- */
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-slate-950">
        <UserNavBar />

        <div className="flex items-center justify-center min-h-[80vh] text-center px-4">
          <div className="rounded-2xl border border-cyan-400/40 bg-cyan-400/10 px-10 py-12 shadow-2xl">
            <h1 className="text-3xl font-extrabold text-cyan-400 mb-4">
              ☯ ORDER Placed SuccessFully
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.35),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(217,70,239,0.35),transparent_60%)]" />

      <div className="relative z-10">
        <UserNavBar />

        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-extrabold text-cyan-400 mb-8 tracking-wide">
            🧾 CHECKOUT
          </h1>

          {/* ERROR */}
          {error && (
            <div className="mb-6 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-rose-300">
              {error}
            </div>
          )}

          {/* CART ITEMS */}
          <div className="space-y-6">
            {cart.map((item) => {
              const product = item.product;
              if (!product) return null;

              return (
                <div
                  key={product._id}
                  className="flex flex-col md:flex-row gap-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 shadow-xl"
                >
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full md:w-40 h-40 object-cover rounded-xl"
                  />

                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-slate-100">
                      {product.name}
                    </h2>
                    <p className="text-slate-400 mt-1">
                      {product.description}
                    </p>

                    <p className="mt-3 text-cyan-400 font-bold">
                      ₹{product.price} × {item.quantity}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SUMMARY */}
          <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-6 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl">
            <div className="text-xl font-semibold text-slate-200">
              Total:
              <span className="ml-3 text-3xl font-extrabold text-fuchsia-500">
                ₹{totalAmount}
              </span>
            </div>

            <button
              disabled={placingOrder}
              onClick={placeOrder}
              className={`px-12 py-3 rounded-xl font-extrabold tracking-wide transition shadow-xl ${
                placingOrder
                  ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-slate-900 hover:opacity-90"
              }`}
            >
              {placingOrder ? "PLACING ORDER" : "PLACE ORDER"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
