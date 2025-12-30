import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavBar from "../components/UserNavBar";

const Sellproducts = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Location state
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [locationAllowed, setLocationAllowed] = useState(true);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ---------------- AUTO LOCATION ---------------- */
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationAllowed(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        setLocationAllowed(true);
      },
      () => {
        // User denied location
        setLocationAllowed(false);
      }
    );
  }, []);

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload = {
        name,
        description,
        price: Number(price),
        quantity: Number(quantity),
        lat: Number(lat),
        lng: Number(lng),
      };

      const res = await fetch(`${API_URL}/api/product/add-product`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // ✅ SUCCESS MESSAGE
      setSuccess("Product added successfully 🎉");

      // ✅ RESET FORM FIELDS
      setName("");
      setDescription("");
      setPrice("");
      setQuantity(1);

      // 🔁 Reset location ONLY if user entered manually
      if (!locationAllowed) {
        setLat("");
        setLng("");
      }

    } catch (err) {
      setError(err.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#1e293b,#020617_70%)]">
      <UserNavBar />

      <div className="max-w-3xl mx-auto px-5 py-12">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 
    text-transparent bg-clip-text 
    bg-gradient-to-r from-rose-400 via-pink-500 to-indigo-400 
    drop-shadow-[0_0_25px_rgba(244,63,94,0.35)]">
          Sell a Product
        </h1>

        {/* ERROR */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 
      bg-red-950/40 backdrop-blur-md 
      px-4 py-3 text-red-300 shadow-lg">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="mb-5 rounded-xl border border-emerald-500/30 
      bg-emerald-950/40 backdrop-blur-md 
      px-4 py-3 text-emerald-300 shadow-lg">
            {success}
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl 
      bg-slate-900/80 backdrop-blur-xl 
      border border-slate-700/60 
      p-6 sm:p-8 
      shadow-[0_25px_80px_rgba(0,0,0,0.75)]"
        >

          {/* INPUT GROUP */}
          {[
            ["Product Name", "text", name, setName],
          ].map(([label, type, value, setter]) => (
            <div key={label}>
              <label className="block text-xs uppercase tracking-wide text-slate-400">
                {label}
              </label>
              <input
                type={type}
                required
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="mt-2 w-full rounded-xl 
            bg-slate-950/70 text-slate-200 
            border border-slate-700 
            px-4 py-3 outline-none 
            focus:border-rose-500/60 
            focus:ring-2 focus:ring-rose-500/30 
            transition"
              />
            </div>
          ))}

          {/* DESCRIPTION */}
          <div>
            <label className="block text-xs uppercase tracking-wide text-slate-400">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 w-full rounded-xl 
          bg-slate-950/70 text-slate-200 
          border border-slate-700 
          px-4 py-3 outline-none 
          focus:border-indigo-500/60 
          focus:ring-2 focus:ring-indigo-500/30 
          transition"
            />
          </div>

          {/* PRICE + QUANTITY */}
          <div className="grid grid-cols-2 gap-5">
            {[
              ["Price (₹)", price, setPrice],
              ["Quantity", quantity, setQuantity],
            ].map(([label, value, setter]) => (
              <div key={label}>
                <label className="block text-xs uppercase tracking-wide text-slate-400">
                  {label}
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="mt-2 w-full rounded-xl 
              bg-slate-950/70 text-slate-200 
              border border-slate-700 
              px-4 py-3 outline-none 
              focus:border-pink-500/60 
              focus:ring-2 focus:ring-pink-500/30 
              transition"
                />
              </div>
            ))}
          </div>

          {/* LOCATION */}
          <div className="grid grid-cols-2 gap-5">
            {[
              ["Latitude", lat, setLat],
              ["Longitude", lng, setLng],
            ].map(([label, value, setter]) => (
              <div key={label}>
                <label className="block text-xs uppercase tracking-wide text-slate-400">
                  {label}
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  disabled={locationAllowed}
                  className={`mt-2 w-full rounded-xl px-4 py-3 
              text-slate-200 border 
              ${locationAllowed
                      ? "bg-slate-800/40 border-slate-700 cursor-not-allowed"
                      : "bg-slate-950/70 border-slate-700"
                    }`}
                />
              </div>
            ))}
          </div>

          {!locationAllowed && (
            <p className="text-xs text-amber-400">
              Location access denied. Enter coordinates manually.
            </p>
          )}

          {/* SUBMIT */}
          <button
            disabled={loading}
            className="w-full py-3 rounded-2xl 
        bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 
        text-white font-semibold tracking-wide 
        shadow-[0_0_40px_rgba(244,63,94,0.4)] 
        hover:scale-[1.02] 
        hover:shadow-[0_0_60px_rgba(244,63,94,0.6)] 
        transition-all duration-300 
        active:scale-95 
        disabled:opacity-60"
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>

  );
};

export default Sellproducts;
