import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavBar from "../components/UserNavBar";

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/api/orders/my-orders`, {
          credentials: "include",
        });

        if (res.status === 401) {
          navigate("/login");
          return;
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } catch (err) {
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [API_URL, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center
        bg-gradient-to-br from-[#0b0f1a] via-[#05070d] to-black
        text-slate-400 animate-pulse">
        Loading orders…
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden
      bg-gradient-to-br from-[#0b0f1a] via-[#05070d] to-black">

      {/* 🌙 SHARED NIGHT — YOU + KANAE */}
      <div className="absolute inset-0
        bg-[radial-gradient(circle_at_top,rgba(244,114,182,0.16),transparent_60%)]" />
      <div className="absolute inset-0
        bg-[radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.14),transparent_65%)]" />
      <div className="absolute inset-0
        bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.10),transparent_70%)]" />

      <div className="relative z-10">
        <UserNavBar />

        <div className="max-w-6xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-semibold tracking-wide
            text-slate-200 mb-10">
            📦 My Orders
          </h1>

          {error && (
            <div className="mb-8 rounded-xl
              border border-rose-900/40
              bg-slate-900/60 px-4 py-3
              text-rose-300">
              {error}
            </div>
          )}

          {orders.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-slate-300 text-lg mb-6">
                You haven’t placed any orders yet
              </p>
              <button
                onClick={() => navigate("/home")}
                className="px-8 py-3 rounded-xl
                  bg-gradient-to-r from-slate-200 to-rose-300
                  text-[#05070d] font-semibold shadow-lg
                  hover:opacity-90 transition"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2">
              {orders.map((order) => {
                const product = order.item;

                return (
                  <div
                    key={order._id}
                    className="relative rounded-3xl
                      bg-slate-900/60 border border-slate-800
                      backdrop-blur-xl
                      shadow-[0_10px_40px_rgba(139,92,246,0.18)]
                      p-6 transition
                      hover:shadow-[0_15px_55px_rgba(244,114,182,0.28)]"
                  >
                    {/* STATUS */}
                    <div className="absolute top-5 right-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium
                          ${
                            order.status === "completed"
                              ? "bg-emerald-900/40 text-emerald-300"
                              : order.status === "cancelled"
                              ? "bg-rose-900/40 text-rose-300"
                              : "bg-amber-900/40 text-amber-300"
                          }`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </div>

                    {/* PRODUCT */}
                    <div
                      className="flex gap-5 cursor-pointer"
                      onClick={() =>
                        product && navigate(`/product/${product._id}`)
                      }
                    >
                      <img
                        src={product?.images?.[0] || "/placeholder.png"}
                        alt={product?.name}
                        className="w-24 h-24 object-cover rounded-2xl
                          border border-slate-700 shadow-md"
                      />

                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-slate-200">
                          {product?.name || "Product unavailable"}
                        </h2>

                        <p className="mt-1 text-sm text-slate-400 line-clamp-2">
                          {product?.description}
                        </p>

                        <p className="mt-2 text-sm text-slate-400">
                          Quantity Ordered:{" "}
                          <span className="font-medium text-slate-200">
                            {order.quantity}
                          </span>
                        </p>

                        <p className="mt-2 text-xs text-slate-500">
                          Ordered on{" "}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* PRICE INFO */}
                    <div className="mt-6 flex justify-between items-end
                      border-t border-slate-800 pt-4">
                      <div className="text-sm text-slate-400">
                        Price per item
                        <div className="text-lg font-semibold text-slate-200">
                          ₹{order.price}
                        </div>
                      </div>

                      <div className="text-right text-sm text-slate-400">
                        Total
                        <div className="text-xl font-bold text-rose-300">
                          ₹{order.price * order.quantity}
                        </div>
                      </div>
                    </div>

                    {/* 🌸 KANAE TOUCH (VERY SOFT) */}
                    <div className="pointer-events-none absolute inset-0 rounded-3xl
                      bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.14),transparent_65%)]" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrder;
