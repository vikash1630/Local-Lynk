import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import UserNavBar from "../components/UserNavBar";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState({});

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_URL}/api/products?search=${encodeURIComponent(
            searchQuery || ""
          )}`,
          {
            method: "GET",
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

  const addToCart = async (e, productId) => {
    e.stopPropagation();
    try {
      await fetch(`${API_URL}/api/cart/dummy-add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
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
    <div className="relative min-h-screen bg-slate-900 overflow-hidden">
      {/* 🌈 MULTI-GRADIENT BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.35),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.35),transparent_55%)]" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-rose-900/30" />

      <div className="relative z-10">
        <UserNavBar />

        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* PAGE TITLE */}
          <h1 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-rose-400 via-pink-400 to-violet-400 text-transparent bg-clip-text">
            {searchQuery
              ? `Results for "${searchQuery}"`
              : "All Products"}
          </h1>

          {/* LOADING */}
          {loading && (
            <p className="text-slate-400">
              Loading products...
            </p>
          )}

          {/* NO PRODUCTS */}
          {!loading && products.length === 0 && (
            <p className="text-slate-400">
              No products found
            </p>
          )}

          {/* PRODUCT GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() =>
                  navigate(`/product/${product._id}`)
                }
                className="group rounded-2xl bg-slate-800/70 backdrop-blur-xl border border-slate-700 p-4 cursor-pointer shadow-lg transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_30px_80px_rgba(244,63,94,0.25)]"
              >
                {/* IMAGE */}
                <img
                  src={
                    product.images?.[0] || "/placeholder.png"
                  }
                  alt={product.name}
                  className="h-40 w-full object-cover rounded-xl"
                />

                {/* INFO */}
                <h3 className="mt-3 text-lg font-semibold text-slate-200">
                  {product.name}
                </h3>

                <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                  {product.description}
                </p>

                <p className="text-xl font-bold text-orange-400 mt-2">
                  ₹{product.price}
                </p>

                {/* ACTIONS */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={(e) =>
                      addToCart(e, product._id)
                    }
                    disabled={addedToCart[product._id]}
                    className={`flex-1 py-2 rounded text-sm font-medium transition ${
                      addedToCart[product._id]
                        ? "bg-slate-600 cursor-not-allowed text-slate-300"
                        : "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
                    }`}
                  >
                    {addedToCart[product._id]
                      ? "Added"
                      : "Add to Cart"}
                  </button>

                  <button
                    onClick={(e) =>
                      buyNow(e, product._id)
                    }
                    className="flex-1 py-2 rounded text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
