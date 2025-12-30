import React, { useEffect, useState } from "react";
import UserNavBar from "../components/UserNavBar";

const API_URL = import.meta.env.VITE_API_URL;

const EditProfile = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    lat: "",
    lng: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/profile`, {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();

        setForm({
          name: data.name || "",
          email: data.email || "",
          age: data.age || "",
          lat: data.location?.coordinates?.[1] || "",
          lng: data.location?.coordinates?.[0] || "",
        });
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        name: form.name,
        age: Number(form.age),
        location: {
          coordinates: [Number(form.lng), Number(form.lat)],
        },
      };

      const res = await fetch(`${API_URL}/api/EditProfile/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage("Profile updated successfully");
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-zinc-900 to-rose-950 text-zinc-300">
        Loading profile…
      </div>
    );
  }

  return (
    <div><UserNavBar />
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-zinc-900 to-rose-950 px-4 relative">
      {/* subtle glass overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl shadow-xl p-8 text-zinc-200">
        <h2 className="text-2xl font-semibold text-rose-400 mb-1">
          Edit Profile
        </h2>
        <p className="text-sm text-zinc-400 mb-8">
          Keep your details sharp and clean
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <Field
            label="Email (cannot be changed)"
            value={form.email}
            disabled
          />

          <Field
            label="Age"
            type="number"
            name="age"
            min="0"
            value={form.age}
            onChange={handleChange}
          />

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Latitude"
              name="lat"
              value={form.lat}
              onChange={handleChange}
            />
            <Field
              label="Longitude"
              name="lng"
              value={form.lng}
              onChange={handleChange}
            />
          </div>

          {/* MESSAGES */}
          {message && (
            <p className="text-sm text-emerald-400 border-l-4 border-emerald-500 pl-3">
              {message}
            </p>
          )}
          {error && (
            <p className="text-sm text-rose-400 border-l-4 border-rose-500 pl-3">
              {error}
            </p>
          )}

          {/* SUBMIT */}
          <button
            disabled={saving}
            className={`w-full mt-4 py-3 rounded-md font-medium transition
              ${
                saving
                  ? "bg-white/10 text-zinc-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-rose-600 to-rose-700 text-white hover:from-rose-500 hover:to-rose-600"
              }`}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>
    </div></div>
  );
};

/* ===== Field Component ===== */
const Field = ({ label, ...props }) => (
  <div>
    <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">
      {label}
    </label>
    <input
      {...props}
      className={`w-full rounded-md bg-black/30 border border-white/20 px-3 py-2 text-zinc-200
      placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition`}
    />
  </div>
);

export default EditProfile;
