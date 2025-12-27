import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NearbyProductsPage = () => {
  const [distance, setDistance] = useState("");
  const [loading, setLoading] = useState(false);
  const [nearbyProducts, setNearbyProducts] = useState([]);
  const [addedToCart, setAddedToCart] = useState({});

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  /* ---------------- FETCH CART (PERMANENT DISABLE) ---------------- */
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`${API_URL}/api/cart/items`, {
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
  }, [API_URL]);

  /* ---------------- NEARBY SEARCH ---------------- */
  const handleSearch = () => {
    if (!distance) return alert("Please select distance");
    if (!navigator.geolocation) return alert("Geolocation not supported");

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `${API_URL}/api/product/nearbyProducts/${coords.latitude}/${coords.longitude}/${distance}`
          );
          const data = await res.json();
          setNearbyProducts(Array.isArray(data) ? data : []);
        } catch {
          setNearbyProducts([]);
        } finally {
          setLoading(false);
        }
      },
      () => {
        alert("Location permission denied");
        setLoading(false);
      }
    );
  };

  /* ---------------- ADD TO CART ---------------- */
  const addToCart = async (e, productId) => {
    e.stopPropagation();

    if (addedToCart[productId]) return;

    try {
      await fetch(`${API_URL}/api/cart/add/${productId}`, {
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
    <div className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* SEARCH BAR */}
        <div className="bg-white p-5 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Find Nearby Products
          </h2>

          <div className="flex gap-4 items-center">
            <select
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="">Select distance</option>
              <option value="1000">1 km</option>
              <option value="3000">3 km</option>
              <option value="5000">5 km</option>
              <option value="10000">10 km</option>
              <option value="20000">20 km</option>
            </select>

            <button
              onClick={handleSearch}
              disabled={loading}
              className={`px-5 py-2 rounded text-sm text-white
                ${
                  loading
                    ? "bg-gray-400"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {loading ? "Searching..." : "Find Nearby"}
            </button>
          </div>
        </div>

        {/* RESULTS */}
        {nearbyProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Nearby Products
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {nearbyProducts.map((product) => (
                <div
                  key={product._id}
                  onClick={() =>
                    navigate(`/product/${product._id}`)
                  }
                  className="border rounded-lg p-4 bg-white cursor-pointer hover:shadow-md"
                >
                  <img
                    src={product.images?.[0] || "/placeholder.png"}
                    alt={product.name}
                    className="h-40 w-full object-cover rounded"
                  />

                  <h3 className="mt-3 font-semibold text-lg">
                    {product.name}
                  </h3>

                  <p className="text-gray-600 text-sm">
                    {product.description}
                  </p>

                  <p className="text-lg font-bold text-orange-600 mt-2">
                    ₹{product.price}
                  </p>

                  <div className="flex gap-3 mt-4">
                    {/* PERMANENTLY DISABLED IF IN CART */}
                    <button
                      onClick={(e) =>
                        addToCart(e, product._id)
                      }
                      disabled={addedToCart[product._id]}
                      className={`flex-1 py-2 rounded text-sm font-medium
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
                      onClick={(e) =>
                        buyNow(e, product._id)
                      }
                      className="flex-1 py-2 rounded text-sm bg-orange-500 text-white hover:bg-orange-600"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyProductsPage;
