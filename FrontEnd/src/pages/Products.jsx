import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_URL}/api/products?search=${encodeURIComponent(searchQuery || "")}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, API_URL]);

  return (
    <div className="p-6">
      {/* PAGE TITLE */}
      <h1 className="text-xl font-semibold mb-4">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="border rounded-lg p-4 hover:shadow-md transition"
          >
            <h2 className="font-medium text-lg mb-1">
              {product.name}
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              {product.description?.slice(0, 60)}...
            </p>
            <p className="font-semibold text-black">
              ₹{product.price}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Products;
