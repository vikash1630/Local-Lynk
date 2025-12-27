import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

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
    e.stopPropagation(); // prevent card click
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
    e.stopPropagation(); // prevent card click
    navigate(`/buy-now/${productId}`);
  };

  return (
    <div className="px-6 py-8">
      {/* PAGE TITLE */}
      <h1 className="text-2xl font-bold mb-6">
        {searchQuery ? `Results for "${searchQuery}"` : "All Products"}
      </h1>

      {/* LOADING */}
      {loading && (
        <p className="text-gray-500">Loading products...</p>
      )}

      {/* NO PRODUCTS */}
      {!loading && products.length === 0 && (
        <p className="text-gray-500">No products found</p>
      )}

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => navigate(`/product/${product._id}`)}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white cursor-pointer"
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
              {product.description?.slice(0, 60)}
            </p>

            <p className="text-lg font-bold text-orange-600 mt-2">
              ₹{product.price}
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={(e) => addToCart(e, product._id)}
                disabled={addedToCart[product._id]}
                className={`flex-1 py-2 rounded text-sm font-medium transition
                  ${
                    addedToCart[product._id]
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-yellow-400 hover:bg-yellow-500"
                  }`}
              >
                {addedToCart[product._id]
                  ? "Added to Cart"
                  : "Add to Cart"}
              </button>

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

export default Products;
