import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // 🔹 Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`${API_URL}/api/cart/items`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        setCartItems(Array.isArray(data.cart) ? data.cart : []);
      } catch (error) {
        console.error("Failed to load cart", error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [API_URL]);

  // 🔹 Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      await fetch(`${API_URL}/api/cart/remove/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      setCartItems((prev) =>
        prev.filter((item) => item.product._id !== productId)
      );
    } catch (error) {
      console.error("Remove from cart failed", error);
    }
  };

  // 🔹 Add one more quantity
  const addToCart = async (productId) => {
    try {
      await fetch(`${API_URL}/api/cart/add/${productId}`, {
        method: "POST",
        credentials: "include",
      });

      setCartItems((prev) =>
        prev.map((item) =>
          item.product._id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } catch (error) {
      console.error("Add to cart failed", error);
    }
  };

  // 🔹 Total price
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (loading) {
    return <p className="p-6 text-gray-500">Loading cart...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">My Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <>
          {/* CART ITEMS */}
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex gap-4 border rounded-lg p-4 bg-white shadow-sm"
              >
                {/* IMAGE */}
                <img
                  src={item.product.images?.[0] || "/placeholder.png"}
                  alt={item.product.name}
                  className="w-28 h-28 object-cover rounded cursor-pointer"
                  onClick={() =>
                    navigate(`/product/${item.product._id}`)
                  }
                />

                {/* DETAILS */}
                <div className="flex-1">
                  <h2
                    className="font-semibold text-lg cursor-pointer"
                    onClick={() =>
                      navigate(`/product/${item.product._id}`)
                    }
                  >
                    {item.product.name}
                  </h2>

                  <p className="text-sm text-gray-600">
                    {item.product.description}
                  </p>

                  <p className="text-sm mt-2">
                    Quantity:{" "}
                    <span className="font-medium">
                      {item.quantity}
                    </span>
                  </p>

                  <p className="text-lg font-bold text-orange-600 mt-1">
                    ₹{item.product.price * item.quantity}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col gap-2 self-start">
                  <button
                    onClick={() =>
                      removeFromCart(item.product._id)
                    }
                    className="text-red-600 text-sm hover:underline"
                  >
                    Remove
                  </button>

                  <button
                    onClick={() =>
                      addToCart(item.product._id)
                    }
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="mt-8 flex justify-between items-center border-t pt-4">
            <h2 className="text-xl font-semibold">
              Total: ₹{totalPrice}
            </h2>

            <button
              onClick={() => navigate("/checkout")}
              className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MyCart;
