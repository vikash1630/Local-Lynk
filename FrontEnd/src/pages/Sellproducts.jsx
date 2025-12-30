import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Sell a Product</h1>

      {/* ALERTS */}
      {error && (
        <div className="mb-4 rounded bg-red-100 px-4 py-2 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded bg-green-100 px-4 py-2 text-green-700">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white p-6 rounded-xl shadow"
      >
        {/* NAME */}
        <div>
          <label className="block text-sm font-medium">Product Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </div>

        {/* PRICE + QUANTITY */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Price (₹)</label>
            <input
              type="number"
              required
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Quantity</label>
            <input
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>
        </div>

        {/* LOCATION */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Latitude</label>
            <input
              type="number"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              disabled={locationAllowed}
              className={`mt-1 w-full rounded border px-3 py-2 ${
                locationAllowed ? "bg-gray-100" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Longitude</label>
            <input
              type="number"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              disabled={locationAllowed}
              className={`mt-1 w-full rounded border px-3 py-2 ${
                locationAllowed ? "bg-gray-100" : ""
              }`}
            />
          </div>
        </div>

        {!locationAllowed && (
          <p className="text-xs text-orange-600">
            Location access denied. Please enter latitude and longitude manually.
          </p>
        )}

        {/* SUBMIT */}
        <button
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default Sellproducts;
