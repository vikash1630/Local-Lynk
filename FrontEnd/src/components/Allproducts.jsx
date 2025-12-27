import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URI = import.meta.env.VITE_API_URL;

const Allproducts = () => {
  const [products, setProducts] = useState([]);
  const [addedToCart, setAddedToCart] = useState({});
  const navigate = useNavigate();

  /* ---------------- FETCH ALL PRODUCTS ---------------- */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URI}/api/products`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Unexpected API response:", data);
        }
      } catch (error) {
        console.error("Failed to load products", error);
      }
    };

    fetchProducts();
  }, []);

  /* ---------------- FETCH CART (PERMANENT DISABLE) ---------------- */
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`${API_URI}/api/cart/items`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (Array.isArray(data.cart)) {
          const cartMap = {};
          data.cart.forEach((item) => {
            cartMap[item.product._id] = true;
          });
          setAddedToCart(cartMap);
        }
      } catch (error) {
        console.error("Failed to sync cart", error);
      }
    };

    fetchCart();
  }, []);

  /* ---------------- ADD TO CART ---------------- */
  const addToCart = async (e, productId) => {
    e.stopPropagation();

    if (addedToCart[productId]) return;

    try {
      await fetch(`${API_URI}/api/cart/add/${productId}`, {
        method: "POST",
        credentials: "include",
      });

      setAddedToCart((prev) => ({
        ...prev,
        [productId]: true,
      }));
    } catch (error) {
      console.error("Add to cart failed", error);
    }
  };

  const buyNow = (e, productId) => {
    e.stopPropagation();
    navigate(`/buy-now/${productId}`);
  };

  return (
    <div className="px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">All Products</h1>

      {products.length === 0 && (
        <p className="text-gray-500">No products available</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => navigate(`/product/${product._id}`)}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer bg-white"
          >
            <img
              src={product.images?.[0] || "/placeholder.png"}
              alt={product.name}
              className="h-40 w-full object-cover rounded"
            />

            <h3 className="mt-3 font-semibold text-lg">
              {product.name}
            </h3>

            <p className="text-gray-600 text-sm mt-1">
              {product.description}
            </p>

            <p className="text-lg font-bold text-orange-600 mt-2">
              ₹{product.price}
            </p>

            <div className="flex gap-3 mt-4">
              {/* PERMANENTLY DISABLED IF IN CART */}
              <button
                onClick={(e) => addToCart(e, product._id)}
                disabled={addedToCart[product._id]}
                className={`flex-1 py-2 rounded text-sm font-medium transition
                  ${
                    addedToCart[product._id]
                      ? "bg-gray-300 cursor-not-allowed text-gray-700"
                      : "bg-yellow-400 hover:bg-yellow-500"
                  }`}
              >
                {addedToCart[product._id]
                  ? "Added to Cart"
                  : "Add to Cart"}
              </button>

              {/* BUY NOW */}
              <button
                onClick={(e) => buyNow(e, product._id)}
                className="flex-1 py-2 rounded text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Allproducts;
