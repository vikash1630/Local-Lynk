import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserNavBar from "../components/UserNavBar";

const BuyNow = () => {
  const { id: productId } = useParams();
  console.log(productId)
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

        setProduct(data); // ✅ FIX
      } catch (err) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };


    fetchProduct();
  }, [API_URL, productId]);

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

      // ✅ SHOW SUCCESS SCREEN
      setOrderSuccess(true);

      // ✅ Replace history so BACK doesn't return here
      navigate("/MyOrders", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };



  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 animate-pulse bg-slate-900">
        Loading product…
      </div>
    );
  }

  /* ---------------- PRODUCT NOT FOUND ---------------- */
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-rose-400">
        Product not found
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-slate-900">
        <UserNavBar />

        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-8 py-10 shadow-xl">
            <h1 className="text-3xl font-bold text-emerald-400 mb-4">
              ✅ Order Placed Successfully
            </h1>

            <p className="text-slate-300 mb-8">
              Your order has been placed and is being processed.
            </p>

            <button
              onClick={() => navigate("/my-orders")}
              className="px-8 py-3 rounded-xl bg-emerald-500 text-slate-900 font-semibold hover:bg-emerald-400 transition"
            >
              View My Orders
            </button>
          </div>
        </div>
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

        <div className="max-w-5xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-slate-100 mb-8">
            🧾 Review & Place Order
          </h1>

          {/* ERROR */}
          {error && (
            <div className="mb-6 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-rose-300">
              {error}
            </div>
          )}

          {/* PRODUCT CARD */}
          <div className="flex flex-col md:flex-row gap-8 rounded-2xl border border-slate-700 bg-slate-800/70 backdrop-blur-xl p-6 shadow-xl">
            {/* IMAGE */}
            <img
              src={product.images?.[0] || "/placeholder.png"}
              alt={product.name}
              className="w-full md:w-64 h-64 object-cover rounded-xl"
            />

            {/* DETAILS */}
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-slate-100">
                {product.name}
              </h2>

              <p className="mt-2 text-slate-400">
                {product.description}
              </p>

              <p className="mt-4 text-3xl font-bold text-amber-400">
                ₹{product.price}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Available Quantity: {product.quantity}
              </p>

              {product.status === "sold" ||
                product.quantity === 0 ? (
                <p className="mt-2 text-sm text-rose-400">
                  Product is out of stock
                </p>
              ) : null}
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
              className={`px-10 py-3 rounded-xl font-semibold transition shadow-lg ${placingOrder ||
                product.quantity === 0 ||
                product.status === "sold"
                ? "bg-slate-600 text-slate-300 cursor-not-allowed"
                : "bg-amber-500 text-slate-900 hover:bg-amber-400"
                }`}
            >
              {placingOrder ? "Placing Order…" : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNow;
