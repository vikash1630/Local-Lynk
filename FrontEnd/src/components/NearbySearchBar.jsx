import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NearbyProductsPage = () => {
  const [distance, setDistance] = useState("");
  const [loading, setLoading] = useState(false);
  const [nearbyProducts, setNearbyProducts] = useState([]);
  const [addedToCart, setAddedToCart] = useState({});

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  /* ---------------- FETCH CART ---------------- */
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`${API_URL}/api/cart/items`, {
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
  }, [API_URL]);

  /* ---------------- NEARBY SEARCH ---------------- */
  const handleSearch = () => {
    if (!distance) return alert("Select distance");
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

      setAddedToCart((prev) => ({ ...prev, [productId]: true }));
    } catch {}
  };

  const buyNow = (e, productId) => {
    e.stopPropagation();
    navigate(`/buy-now/${productId}`);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0b1020] via-[#0f172a] to-[#1e1b4b] overflow-hidden">
      {/* 🌙 Moonlight glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(167,139,250,0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.12),transparent_55%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">

        {/* SEARCH CARD */}
        <div className="rounded-3xl bg-[#020617]/70 backdrop-blur-xl
          border border-indigo-900/30 p-6 shadow-[0_0_60px_rgba(167,139,250,0.15)] mb-10">

          <h2 className="text-2xl font-bold
            bg-gradient-to-r from-indigo-300 to-pink-300
            text-transparent bg-clip-text mb-4">
            Find Nearby Products
          </h2>

          <div className="flex flex-wrap gap-4">
            <select
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="bg-[#020617]/80 border border-indigo-900/40
                text-indigo-100 rounded px-3 py-2"
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
              className="px-6 py-2 rounded
                bg-gradient-to-r from-indigo-500 to-violet-500
                text-white font-semibold transition
                hover:opacity-90"
            >
              {loading ? "Searching..." : "Find Nearby"}
            </button>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {nearbyProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => navigate(`/product/${product._id}`)}
              className="group rounded-2xl bg-[#020617]/70 backdrop-blur-xl
                border border-indigo-900/30 p-4 cursor-pointer
                shadow-lg transition
                hover:scale-[1.03]
                hover:shadow-[0_30px_80px_rgba(167,139,250,0.22)]"
            >
              <img
                src={product.images?.[0] || "/placeholder.png"}
                alt={product.name}
                className="h-40 w-full object-cover rounded-xl"
              />

              <h3 className="mt-3 text-lg font-semibold text-indigo-100">
                {product.name}
              </h3>

              <p className="text-sm text-indigo-200/60 line-clamp-2">
                {product.description}
              </p>

              <p className="text-xl font-bold text-pink-300 mt-2">
                ₹{product.price}
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={(e) => addToCart(e, product._id)}
                  disabled={addedToCart[product._id]}
                  className={`flex-1 py-2 rounded text-sm font-medium transition ${
                    addedToCart[product._id]
                      ? "bg-indigo-900/50 cursor-not-allowed text-indigo-200"
                      : "bg-indigo-500 hover:bg-indigo-600 text-white"
                  }`}
                >
                  {addedToCart[product._id] ? "Added" : "Add to Cart"}
                </button>

                <button
                  onClick={(e) => buyNow(e, product._id)}
                  className="flex-1 py-2 rounded
                    bg-pink-500 text-white
                    hover:bg-pink-600 transition"
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

export default NearbyProductsPage;
