import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import UserNavBar from "../components/UserNavBar";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cartItems, setCartItems] = useState([]);
  const [cartProductIds, setCartProductIds] = useState(new Set());
  const [error, setError] = useState("");

  const [myProductIds, setMyProductIds] = useState(new Set());

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  /* ---------------- FETCH PRODUCTS ---------------- */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_URL}/api/products?search=${encodeURIComponent(
            searchQuery || ""
          )}`,
          {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, API_URL]);

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
      const cartArray = Array.isArray(data.cart) ? data.cart : [];

      setCartItems(cartArray);

      setCartProductIds(
        new Set(
          cartArray.map((item) =>
            typeof item.product === "object"
              ? item.product._id
              : item.product
          )
        )
      );
    } catch {
      setError("Failed to load cart");
    }
  };

  useEffect(() => {
    fetchCart();
  }, [API_URL]);

  /* ---------------- FETCH MY PRODUCTS ---------------- */
  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/MyProducts`, {
          credentials: "include",
        });

        if (!res.ok) return;

        const data = await res.json();
        if (Array.isArray(data.products)) {
          setMyProductIds(new Set(data.products.map((p) => p._id)));
        }
      } catch {}
    };

    fetchMyProducts();
  }, [API_URL]);

  /* ---------------- ADD TO CART ---------------- */
  const addToCart = async (e, productId) => {
    e.stopPropagation();

    try {
      const res = await fetch(`${API_URL}/api/cart/add/${productId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) return;

      setCartProductIds((prev) => new Set(prev).add(productId));
    } catch {}
  };

  /* ---------------- BUY NOW ---------------- */
  const buyNow = (e, productId) => {
    e.stopPropagation();
    navigate(`/buy-now/${productId}`);
  };

  return (
    <div className="relative min-h-screen bg-[#0b0f1a] overflow-hidden">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b0f1a] via-[#11162a] to-[#1a1033]" />

      <div className="relative z-10">
        <UserNavBar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* TITLE */}
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-violet-200">
            {searchQuery ? `Results for "${searchQuery}"` : "All Products"}
          </h1>

          {error && <p className="text-rose-400 mb-4">{error}</p>}
          {loading && <p className="text-slate-400">Loading products...</p>}

          {!loading && products.length === 0 && (
            <p className="text-slate-400">No products found</p>
          )}

          {/* PRODUCTS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products
              .filter((product) => !myProductIds.has(product._id))
              .map((product) => {
                const isInCart = cartProductIds.has(product._id);

                return (
                  <div
                    key={product._id}
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="
                      flex flex-col rounded-xl bg-white/5 border border-violet-400/20 p-4 cursor-pointer
                      transition
                      md:hover:scale-[1.03]
                      md:hover:shadow-xl
                    "
                  >
                    {/* IMAGE */}
                    <img
                      src={product.images?.[0] || "/placeholder.png"}
                      alt={product.name}
                      className="h-40 w-full object-cover rounded-lg"
                    />

                    {/* CONTENT */}
                    <div className="flex flex-col flex-1 mt-3">
                      <h3 className="text-lg font-semibold text-violet-100 line-clamp-1">
                        {product.name}
                      </h3>

                      <p className="text-sm text-violet-300/70 mt-1 line-clamp-2">
                        {product.description}
                      </p>

                      <p className="text-lg font-bold text-pink-300 mt-2">
                        ₹{product.price}
                      </p>

                      {/* ACTIONS */}
                      <div className="flex gap-3 mt-auto pt-4">
                        <button
                          onClick={(e) => addToCart(e, product._id)}
                          disabled={isInCart}
                          className={`flex-1 py-2 rounded text-sm font-medium ${
                            isInCart
                              ? "bg-slate-600 text-slate-300 cursor-not-allowed"
                              : "bg-violet-600 text-white md:hover:bg-violet-700"
                          }`}
                        >
                          {isInCart ? "Already In Cart" : "Add to Cart"}
                        </button>

                        <button
                          onClick={(e) => buyNow(e, product._id)}
                          className="flex-1 py-2 rounded text-sm font-medium bg-pink-600 text-white md:hover:bg-pink-700"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
