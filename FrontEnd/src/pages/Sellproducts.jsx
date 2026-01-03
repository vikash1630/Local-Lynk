import { useEffect, useState } from "react";
import UserNavBar from "../components/UserNavBar";

const Sellproducts = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  /* ================= FORM STATE ================= */
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(1);

  /* ================= IMAGE ================= */
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  /* ================= LOCATION ================= */
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [locationAllowed, setLocationAllowed] = useState(true);

  /* ================= UI ================= */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ================= AUTO LOCATION ================= */
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationAllowed(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setLocationAllowed(true);
      },
      () => setLocationAllowed(false)
    );
  }, []);

  /* ================= IMAGE HANDLER ================= */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("quantity", quantity);
      formData.append("lat", lat);
      formData.append("lng", lng);

      if (image) {
        formData.append("images", image); // ✅ correct
      }

      const res = await fetch(`${API_URL}/api/product/add-product`, {
        method: "POST",
        credentials: "include",
        body: formData, // ❌ NO headers here
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess("Product added successfully 🎉");

      /* RESET */
      setName("");
      setDescription("");
      setPrice("");
      setQuantity(1);
      setImage(null);
      setPreview("");

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
        <h1 className="text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-500 to-indigo-400">
          Sell a Product
        </h1>

        {/* ERROR */}
        {error && (
          <div className="mb-5 rounded-xl bg-red-950/40 border border-red-500/40 px-4 py-3 text-red-300">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="mb-5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 px-4 py-3 text-emerald-300">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-700 p-8 shadow-2xl"
        >
          {/* IMAGE */}
          <div>
            <label className="block text-xs uppercase tracking-wide text-slate-400 mb-2">
              Product Image (Single)
            </label>

            <label className="cursor-pointer flex items-center justify-center h-48 rounded-xl border border-dashed border-slate-600 bg-slate-950/60 hover:border-rose-500 transition">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full object-cover rounded-xl"
                />
              ) : (
                <span className="text-slate-400 text-sm">
                  Click to upload image
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* NAME */}
          <input
            required
            placeholder="Product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-200"
          />

          {/* DESCRIPTION */}
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-200"
          />

          {/* PRICE + QUANTITY */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-200"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-200"
            />
          </div>

          {/* LOCATION */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={lat}
              disabled={locationAllowed}
              onChange={(e) => setLat(e.target.value)}
              placeholder="Latitude"
              className="rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-200 disabled:opacity-60"
            />
            <input
              type="number"
              value={lng}
              disabled={locationAllowed}
              onChange={(e) => setLng(e.target.value)}
              placeholder="Longitude"
              className="rounded-xl bg-slate-950/70 border border-slate-700 px-4 py-3 text-slate-200 disabled:opacity-60"
            />
          </div>

          {/* SUBMIT */}
          <button
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 text-white font-semibold hover:scale-[1.02] transition disabled:opacity-60"
          >
            {loading ? "Uploading..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Sellproducts;
