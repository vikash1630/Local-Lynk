import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import UserNavBar from "../components/UserNavBar";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // CART STATE (BACKEND TRUTH)
  const [cartItems, setCartItems] = useState([]);
  const [cartProductIds, setCartProductIds] = useState(new Set());
  const [error, setError] = useState("");

  // MY PRODUCTS STATE
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
      } catch (error) {
        console.error("Error fetching products:", error);
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

      const ids = new Set(
        cartArray.map((item) =>
          typeof item.product === "object"
            ? item.product._id
            : item.product
        )
      );

      setCartProductIds(ids);
    } catch {
      setError("Failed to load cart. Please refresh.");
    }
  };

  /* ---------------- LOAD CART ---------------- */
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
          const ids = new Set(data.products.map((p) => p._id));
          setMyProductIds(ids);
        }
      } catch {
        // silent fail (not critical)
      }
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

      setCartProductIds((prev) => {
        const updated = new Set(prev);
        updated.add(productId);
        return updated;
      });
    } catch (error) {
      console.error("Add to cart failed", error);
    }
  };

  /* ---------------- BUY NOW ---------------- */
  const buyNow = (e, productId) => {
    e.stopPropagation();
    navigate(`/buy-now/${productId}`);
  };

  return (
    <div className="relative min-h-screen bg-slate-900 overflow-hidden">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.35),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.35),transparent_55%)]" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-rose-900/30" />

      <div className="relative z-10">
        <UserNavBar />

        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* TITLE */}
          <h1 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-rose-400 via-pink-400 to-violet-400 text-transparent bg-clip-text">
            {searchQuery ? `Results for "${searchQuery}"` : "All Products"}
          </h1>

          {/* ERROR */}
          {error && <p className="text-red-400 mb-4">{error}</p>}

          {/* LOADING */}
          {loading && <p className="text-slate-400">Loading products...</p>}

          {/* EMPTY */}
          {!loading && products.length === 0 && (
            <p className="text-slate-400">No products found</p>
          )}

          {/* PRODUCTS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products
              .filter((product) => !myProductIds.has(product._id)) // 🔥 HIDE MY PRODUCTS
              .map((product) => {
                const isInCart = cartProductIds.has(product._id);

                return (
                  <div
                    key={product._id}
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="group flex flex-col rounded-2xl bg-slate-800/70 backdrop-blur-xl border border-slate-700 p-4 cursor-pointer shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_30px_80px_rgba(244,63,94,0.25)]"
                  >
                    {/* IMAGE */}
                    <img
                      src={product.images?.[0] || "/placeholder.png"}
                      alt={product.name}
                      className="h-40 w-full object-cover rounded-xl"
                    />

                    {/* CONTENT */}
                    <div className="flex flex-col flex-1 mt-3">
                      <h3 className="text-lg font-semibold text-slate-200 line-clamp-1">
                        {product.name}
                      </h3>

                      <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                        {product.description}
                      </p>

                      <p className="text-xl font-bold text-orange-400 mt-2">
                        ₹{product.price}
                      </p>

                      {/* ACTIONS (PINNED TO BOTTOM) */}
                      <div className="flex gap-3 mt-auto pt-4">
                        <button
                          onClick={(e) => addToCart(e, product._id)}
                          disabled={isInCart}
                          className={`flex-1 py-2 rounded text-sm font-medium transition ${isInCart
                              ? "bg-slate-600 cursor-not-allowed text-slate-300"
                              : "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
                            }`}
                        >
                          {isInCart ? "Already In Cart" : "Add to Cart"}
                        </button>

                        <button
                          onClick={(e) => buyNow(e, product._id)}
                          className="flex-1 py-2 rounded text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition"
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
