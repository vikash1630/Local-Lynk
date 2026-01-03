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
    }, [API_URL]);

    /* ---------------- LOADING ---------------- */
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-400 animate-pulse">
                Loading orders…
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
                        📦 My Orders
                    </h1>

                    {/* ERROR */}
                    {error && (
                        <div className="mb-6 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-rose-300">
                            {error}
                        </div>
                    )}

                    {/* EMPTY */}
                    {orders.length === 0 ? (
                        <div className="text-center py-24">
                            <p className="text-slate-400 text-lg mb-6">
                                You haven’t placed any orders yet
                            </p>
                            <button
                                onClick={() => navigate("/home")}
                                className="px-8 py-3 rounded-xl bg-cyan-500 text-slate-900 font-semibold hover:bg-cyan-400 transition"
                            >
                                Browse Products
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => {
                                const product = order.item;
                                console.log("Product ID:", product?._id);
                                return (
                                    <div
                                        key={order._id}
                                        className="flex flex-col md:flex-row gap-6 rounded-2xl border border-slate-700 bg-slate-800/70 backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition"
                                    >
                                        {/* IMAGE */}
                                        <img
                                            src={
                                                product?.images?.[0] || "/placeholder.png"
                                            }
                                            alt={product?.name}
                                            className="w-full md:w-28 h-28 object-cover rounded-xl cursor-pointer"
                                            onClick={() =>
                                                product &&
                                                navigate(`/product/${product._id}`)
                                            }
                                        />

                                        {/* DETAILS */}
                                        <div className="flex-1 hover:cursor-pointer" onClick={() =>
                                                product &&
                                                navigate(`/product/${product._id}`)
                                            }>
                                            <h2 className="text-lg font-semibold text-slate-100">
                                                {product?.name || "Product unavailable"}
                                            </h2>

                                            <p className="text-sm text-slate-400 mt-1">
                                                {product?.description}
                                            </p>

                                            <p className="mt-3 text-sm text-slate-400">
                                                Ordered on{" "}
                                                <span className="text-slate-200">
                                                    {new Date(
                                                        order.createdAt
                                                    ).toLocaleDateString()}
                                                </span>
                                            </p>
                                        </div>

                                        {/* META */}
                                        <div className="flex flex-col items-end justify-between">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === "completed"
                                                        ? "bg-green-500/20 text-green-400"
                                                        : order.status === "cancelled"
                                                            ? "bg-rose-500/20 text-rose-400"
                                                            : "bg-amber-500/20 text-amber-400"
                                                    }`}
                                            >
                                                {order.status.toUpperCase()}
                                            </span>

                                            <p className="text-xl font-bold text-amber-400">
                                                ₹{order.price}
                                            </p>
                                        </div>
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
