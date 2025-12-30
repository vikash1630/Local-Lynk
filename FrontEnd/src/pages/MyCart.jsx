import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    } catch (err) {
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
        {
          method: "DELETE",
          credentials: "include",
        }
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
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      await fetchCart(); // keep populated cart
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setActionLoading(null);
    }
  };

  /* ---------------- TOTAL ---------------- */
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500 animate-pulse">
        Loading your cart...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">🛒 My Cart</h1>

      {/* ERROR */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-100 border border-red-300 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {/* EMPTY CART */}
      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-4">
            Your cart is empty 😔
          </p>
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <>
          {/* CART ITEMS */}
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
                  className="flex gap-5 border rounded-xl p-5 bg-white shadow hover:shadow-lg transition"
                >
                  {/* IMAGE */}
                  <img
                    src={
                      item.product.images?.[0] ||
                      "/placeholder.png"
                    }
                    alt={item.product.name}
                    className="w-28 h-28 object-cover rounded-lg cursor-pointer"
                    onClick={() =>
                      navigate(`/product/${item.product._id}`)
                    }
                  />

                  {/* DETAILS */}
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">
                      {item.product.name}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      {item.product.description}
                    </p>

                    {/* QUANTITY BADGE */}
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-sm text-gray-600">
                        Quantity
                      </span>
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-semibold text-blue-700">
                        {item.quantity}
                      </span>
                    </div>

                    {/* STOCK WARNINGS */}
                    {outOfStock && (
                      <p className="mt-1 text-xs font-medium text-red-600">
                        Out of stock
                      </p>
                    )}

                    {maxReached && !outOfStock && (
                      <p className="mt-1 text-xs font-medium text-orange-600">
                        Maximum quantity reached
                      </p>
                    )}

                    {/* PRICE */}
                    <p className="mt-3 text-xl font-bold text-orange-600">
                      ₹{item.product.price * item.quantity}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-col gap-3">
                    <button
                      disabled={actionLoading === item.product._id}
                      onClick={() =>
                        removeFromCart(item.product._id)
                      }
                      className="text-sm text-red-600 hover:underline disabled:opacity-50"
                    >
                      {actionLoading === item.product._id
                        ? "Removing..."
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
                      className={`text-sm ${
                        outOfStock || maxReached
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-blue-600 hover:underline"
                      }`}
                    >
                      {actionLoading === item.product._id
                        ? "Adding..."
                        : "Add more"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SUMMARY */}
          <div className="mt-10 flex justify-between items-center border-t pt-6">
            <h2 className="text-2xl font-semibold">
              Total: ₹{totalPrice}
            </h2>

            <button
              onClick={() => navigate("/checkout")}
              className="px-8 py-3 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 transition"
            >
              Proceed to Checkout →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MyCart;
