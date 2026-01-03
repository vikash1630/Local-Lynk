import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserNavBar from "../components/UserNavBar";

const API_URL = import.meta.env.VITE_API_URL;

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  /* ================= PRODUCT ================= */
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartError, setCartError] = useState("");


  /* ================= USER / FRIEND STATE ================= */
  const [currentUserId, setCurrentUserId] = useState(null);
  const [friends, setFriends] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);

  /* ================= CART ================= */
  const [addedToCart, setAddedToCart] = useState({});

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    let ignore = false;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/product/${id}`);
        const data = await res.json();
        // console.log(data)
        if (!res.ok) throw new Error(data.message || "Failed to load product");
        if (!ignore) setProduct(data);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchProduct();
    return () => (ignore = true);
  }, [id]);

  /* ================= FETCH USER DATA ================= */
  useEffect(() => {
    const init = async () => {
      try {
        const profile = await fetch(`${API_URL}/api/profile`, {
          method: "POST",
          credentials: "include",
        }).then((r) => r.json());

        setCurrentUserId(profile._id);

        const [f, s, r, c] = await Promise.all([
          fetch(`${API_URL}/api/friends`, { credentials: "include" }).then(r => r.json()),
          fetch(`${API_URL}/api/user/requests/sent`, { credentials: "include" }).then(r => r.json()),
          fetch(`${API_URL}/api/user/requests/recieved`, { credentials: "include" }).then(r => r.json()),
          fetch(`${API_URL}/api/cart/items`, { credentials: "include" }).then(r => r.json()),
        ]);

        setFriends(f.friends || []);
        setSentRequests(s.requests || []);
        setReceivedRequests(r.requests || []);

        if (Array.isArray(c.cart)) {
          const map = {};
          c.cart.forEach(i => map[i.product._id] = true);
          setAddedToCart(map);
        }
      } catch { }
    };

    init();
  }, []);

  /* ================= HELPERS ================= */
  const isFriend = (id) => friends.some(f => f._id === id);
  const hasSent = (id) => sentRequests.some(r => r._id === id);
  const hasReceived = (id) => receivedRequests.some(r => r._id === id);

  /* ================= ACTIONS ================= */
  const sendRequest = async (user) => {
    if (!user?._id) return;
    setSentRequests(p => [...p, user]);
    try {
      await fetch(`${API_URL}/api/friend/send-friend-request/${user._id}`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      setSentRequests(p => p.filter(u => u._id !== user._id));
    }
  };

  const acceptRequest = async (user) => {
    await fetch(`${API_URL}/api/friend/accept-friend-request/${user._id}`, {
      method: "POST",
      credentials: "include",
    });
    setReceivedRequests(p => p.filter(r => r._id !== user._id));
    setFriends(p => [...p, user]);
  };

  const unfriend = async (user) => {
    await fetch(`${API_URL}/api/friend/unfriend/${user._id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setFriends(p => p.filter(f => f._id !== user._id));
  };

  const addToCart = async () => {
    if (!product?._id) return;

    setCartError("");

    try {
      const res = await fetch(`${API_URL}/api/cart/add/${product._id}`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add to cart");
      }

      setAddedToCart(p => ({ ...p, [product._id]: true }));
    } catch (err) {
      setCartError(err.message);
    }
  };


  const buyNow = () => navigate(`/buy-now/${product._id}`);

  /* ================= UI STATES ================= */
  if (loading)
    return <div className="min-h-screen flex items-center justify-center text-zinc-400">Loading…</div>;

  if (error)
    return <div className="min-h-screen flex items-center justify-center text-rose-500">{error}</div>;

  const owner = product.owner;
  const ownerId = owner?._id;
  const isSelf = ownerId === currentUserId;
  const outOfStock = product.status === "sold" || product.quantity === 0;



  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-zinc-900 to-rose-950">
      <UserNavBar />

      {/* RADIAL GLOWS */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.22),transparent_55%)]" />

      <div className="relative max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-10">

          {/* IMAGE */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="w-full h-[320px] lg:h-[420px] object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>

          {/* DETAILS */}
          <div className="rounded-3xl bg-black/35 backdrop-blur-xl border border-white/10 p-8 text-zinc-200 space-y-6 shadow-2xl">

            <h1 className="text-3xl font-semibold text-rose-400 tracking-tight">
              {product.name}
            </h1>

            <p className="text-2xl font-bold text-emerald-400">
              ₹{product.price}
            </p>

            {/* AVAILABLE QUANTITY */}
            <div className="flex items-center gap-3">
              <span className="text-xs tracking-widest text-zinc-400 uppercase">
                Stock
              </span>

              <span
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border backdrop-blur-md shadow-md
      ${outOfStock
                    ? "bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-rose-500/30"
                    : product.quantity <= 3
                      ? "bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-amber-500/30"
                      : "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-emerald-500/30"
                  }`}
              >
                {outOfStock
                  ? "Out of Stock ☠️"
                  : `${product.quantity} left ⚔️`}
              </span>
            </div>


            <p className="text-sm text-zinc-400 leading-relaxed">
              {product.description}
            </p>

            {/* SELLER */}
            <div className="border-t border-white/10 pt-4 text-sm">
              <p><span className="text-zinc-400">Seller:</span> {owner?.name || "—"}</p>
              <p><span className="text-zinc-400">Email:</span> {owner?.email || "—"}</p>
            </div>

            {/* BUY / CART */}
            {!isSelf && (
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={addToCart}
                  disabled={addedToCart[product._id] || outOfStock}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300
    ${addedToCart[product._id] || outOfStock
                      ? "bg-white/10 text-zinc-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:scale-[1.03] hover:shadow-lg hover:shadow-emerald-500/30"
                    }`}
                >
                  {outOfStock
                    ? "Out of Stock"
                    : addedToCart[product._id]
                      ? "Added to Cart"
                      : "Add to Cart"}
                </button>

                {cartError && (
                  <div className="rounded-xl bg-rose-500/15 border border-rose-500/30 px-4 py-2 text-sm text-rose-300">
                    {cartError}
                  </div>
                )}


                <button
                  onClick={buyNow}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:scale-[1.03] hover:shadow-lg hover:shadow-rose-500/30 transition-all duration-300"
                >
                  Buy Now
                </button>
              </div>
            )}

            {/* FRIEND ACTIONS */}
            <div className="pt-2 space-y-3">
              {isSelf && (
                <button disabled className="w-full py-2 rounded-xl bg-white/10 text-zinc-400">
                  Sold by You
                </button>
              )}

              {!isSelf && ownerId && isFriend(ownerId) && (
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate("/chat")}
                    className="flex-1 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 transition"
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => unfriend(owner)}
                    className="flex-1 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 transition"
                  >
                    Unfriend
                  </button>
                </div>
              )}

              {!isSelf && ownerId && hasReceived(ownerId) && (
                <button
                  onClick={() => acceptRequest(owner)}
                  className="w-full py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 transition"
                >
                  Accept Friend Request
                </button>
              )}

              {!isSelf && ownerId && hasSent(ownerId) && (
                <button disabled className="w-full py-2 rounded-xl bg-white/10 text-zinc-400">
                  Waiting for seller
                </button>
              )}

              {!isSelf && ownerId && !isFriend(ownerId) && !hasSent(ownerId) && !hasReceived(ownerId) && (
                <button
                  onClick={() => sendRequest(owner)}
                  className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition"
                >
                  Contact Seller
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
