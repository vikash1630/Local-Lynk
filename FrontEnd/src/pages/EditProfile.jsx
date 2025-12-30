import React, { useEffect, useState } from "react";
import UserNavBar from "../components/UserNavBar";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const EditProfile = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    lat: "",
    lng: "",
  });

  const [avatarPreview, setAvatarPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /* FETCH PROFILE */
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

        setAvatarPreview(data.profilePhoto || "");
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
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
        profilePhoto: avatarPreview,
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
      setError("Invalid Input !!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-zinc-900 to-rose-950 text-zinc-300">
        Loading profile…
      </div>
    );
  }

  return (
    <div>
      <UserNavBar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-zinc-900 to-rose-950 px-4">
        <div className="w-full max-w-xl rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 p-8 text-zinc-200 shadow-xl">

          {/* PROFILE PHOTO */}
          <div className="flex justify-center mb-6">
            <label className="relative w-32 h-32 rounded-full cursor-pointer overflow-hidden border border-white/20 hover:scale-105 transition">
              <img
                src={avatarPreview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Name" name="name" value={form.name} onChange={handleChange} />
            <Input label="Email" value={form.email} disabled />
            <Input label="Age" type="number" name="age" value={form.age} onChange={handleChange} />

            <div className="grid grid-cols-2 gap-3">
              <Input label="Latitude" name="lat" value={form.lat} onChange={handleChange} />
              <Input label="Longitude" name="lng" value={form.lng} onChange={handleChange} />
            </div>

            {message && <p className="text-emerald-400">{message}</p>}
            {error && <p className="text-rose-400">{error}</p>}

            <button
              disabled={saving}
              className="w-full py-3 rounded bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 transition"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-xs text-zinc-400">{label}</label>
    <input
      {...props}
      className="w-full bg-black/30 border border-white/20 rounded px-3 py-2 text-zinc-200"
    />
  </div>
);

export default EditProfile;
