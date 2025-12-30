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
        if (Array.isArray(data)) setProducts(data);
      } catch {}
    };
    fetchProducts();
  }, []);

  /* ---------------- FETCH CART ---------------- */
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`${API_URI}/api/cart/items`, {
          credentials: "include",
        });
        const data = await res.json();

        if (Array.isArray(data.cart)) {
          const map = {};
          data.cart.forEach((item) => {
            map[item.product._id] = true;
          });
          setAddedToCart(map);
        }
      } catch {}
    };
    fetchCart();
  }, []);

  const addToCart = async (e, productId) => {
    e.stopPropagation();
    if (addedToCart[productId]) return;

    try {
      await fetch(`${API_URI}/api/cart/add/${productId}`, {
        method: "POST",
        credentials: "include",
      });
      setAddedToCart((prev) => ({ ...prev, [productId]: true }));
    } catch {}
  };

  const buyNow = (e, productId) => {
    e.stopPropagation();
    navigate(`/buy-now/${productId}`);
  };

return (
  <div className="relative bg-transparent">
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold mb-10 bg-gradient-to-r from-amber-400 via-orange-400 to-indigo-400 text-transparent bg-clip-text">
        All Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => navigate(`/product/${product._id}`)}
            className="group rounded-2xl bg-slate-800/70 backdrop-blur-xl border border-slate-700 p-4 cursor-pointer shadow-lg transition hover:scale-[1.03]"
          >
            <img
              src={product.images?.[0] || "/placeholder.png"}
              className="h-40 w-full object-cover rounded-xl"
            />

            <h3 className="mt-3 text-lg font-semibold text-slate-200">
              {product.name}
            </h3>

            <p className="text-sm text-slate-400 line-clamp-2">
              {product.description}
            </p>

            <p className="text-xl font-bold text-amber-400 mt-2">
              ₹{product.price}
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={(e) => addToCart(e, product._id)}
                disabled={addedToCart[product._id]}
                className={`flex-1 py-2 rounded text-sm font-medium ${
                  addedToCart[product._id]
                    ? "bg-slate-600 cursor-not-allowed"
                    : "bg-amber-500 hover:bg-amber-600 text-slate-900"
                }`}
              >
                {addedToCart[product._id] ? "Added" : "Add to Cart"}
              </button>

              <button
                onClick={(e) => buyNow(e, product._id)}
                className="flex-1 py-2 rounded bg-rose-500 text-white hover:bg-rose-600"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);


};

export default Allproducts;
