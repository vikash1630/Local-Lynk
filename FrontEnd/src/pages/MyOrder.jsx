import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavBar from "../components/UserNavBar";

const MyOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    /* ---------------- FETCH MY ORDERS ---------------- */
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

    /* ---------------- LOADING ---------------- */
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-rose-950 text-rose-300 animate-pulse">
                Loading orders…
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-950 via-slate-950 to-black relative overflow-hidden">
            {/* 🌸 TAMAYO AURA */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,114,182,0.12),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(168,85,247,0.10),transparent_65%)]" />

            <div className="relative z-10">
                <UserNavBar />

                <div className="max-w-6xl mx-auto px-4 py-10">
                    <h1 className="text-3xl font-semibold tracking-wide text-rose-200 mb-10">
                        📦 My Orders
                    </h1>

                    {/* ERROR */}
                    {error && (
                        <div className="mb-8 rounded-xl border border-rose-800/60 bg-rose-900/40 px-4 py-3 text-rose-300">
                            {error}
                        </div>
                    )}

                    {/* EMPTY */}
                    {orders.length === 0 ? (
                        <div className="text-center py-24">
                            <p className="text-rose-300 text-lg mb-6">
                                You haven’t placed any orders yet
                            </p>
                            <button
                                onClick={() => navigate("/home")}
                                className="px-8 py-3 rounded-xl bg-rose-400 text-rose-950 font-semibold hover:bg-rose-300 transition"
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
                                        bg-rose-900/30 border border-rose-800/40
                                        backdrop-blur-xl shadow-[0_0_30px_rgba(244,114,182,0.15)]
                                        p-6 transition hover:shadow-[0_0_40px_rgba(244,114,182,0.25)]"
                                    >
                                        {/* STATUS */}
                                        <div className="absolute top-5 right-5">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide
                                                ${
                                                    order.status === "completed"
                                                        ? "bg-emerald-900/40 text-emerald-300"
                                                        : order.status === "cancelled"
                                                            ? "bg-rose-900/60 text-rose-300"
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
                                                product &&
                                                navigate(`/product/${product._id}`)
                                            }
                                        >
                                            <img
                                                src={product?.images?.[0] || "/placeholder.png"}
                                                alt={product?.name}
                                                className="w-24 h-24 object-cover rounded-2xl border border-rose-800/40"
                                            />

                                            <div className="flex-1">
                                                <h2 className="text-lg font-semibold text-rose-200">
                                                    {product?.name || "Product unavailable"}
                                                </h2>

                                                <p className="mt-1 text-sm text-rose-300/80 line-clamp-2">
                                                    {product?.description}
                                                </p>

                                                <p className="mt-2 text-sm text-rose-300">
                                                    Quantity Ordered:{" "}
                                                    <span className="font-medium text-rose-200">
                                                        {order.quantity}
                                                    </span>
                                                </p>

                                                <p className="mt-2 text-xs text-rose-400/70">
                                                    Ordered on{" "}
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        {/* PRICE INFO */}
                                        <div className="mt-6 flex justify-between items-end border-t border-rose-800/40 pt-4">
                                            <div className="text-sm text-rose-300">
                                                Price per item
                                                <div className="text-lg font-semibold text-rose-200">
                                                    ₹{order.price}
                                                </div>
                                            </div>

                                            <div className="text-right text-sm text-rose-300">
                                                Total
                                                <div className="text-xl font-bold text-violet-300">
                                                    ₹{order.price * order.quantity}
                                                </div>
                                            </div>
                                        </div>

                                        {/* TAMAYO SOFT OVERLAY */}
                                        <div className="pointer-events-none absolute inset-0 rounded-3xl
                                        bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.10),transparent_65%)]" />
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
