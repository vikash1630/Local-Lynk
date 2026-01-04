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

  const [avatarPreview, setAvatarPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* 🌙 Fetch profile */
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
        setError("Unable to load profile");
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
    reader.onloadend = () => setAvatarPreview(reader.result);
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

      setMessage("Profile saved peacefully ✨");
    } catch {
      setError("Please check the details again");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1020] via-[#0f172a] to-[#020617] text-slate-400">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1020] via-[#0f172a] to-[#020617]">
      <UserNavBar />

      <div className="flex justify-center px-4 py-14">
        <div
          className="
            w-full max-w-xl
            rounded-3xl
            bg-white/5
            backdrop-blur-2xl
            border border-white/10
            p-8
            shadow-[0_30px_80px_rgba(0,0,0,0.6)]
          "
        >
          {/* 🌸 Avatar */}
          <div className="flex justify-center mb-10">
            <label
              className="
                group relative h-32 w-32
                overflow-hidden rounded-full
                cursor-pointer
                border border-white/20
                shadow-[0_0_40px_rgba(255,182,193,0.15)]
              "
            >
              <img
                src={avatarPreview || "/avatar-placeholder.png"}
                alt="Profile"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="
                  absolute inset-0
                  flex items-center justify-center
                  bg-black/40
                  text-xs tracking-widest text-white
                  opacity-0 transition-opacity duration-500
                  group-hover:opacity-100
                "
              >
                CHANGE
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input label="Name" name="name" value={form.name} onChange={handleChange} />
            <Input label="Email" value={form.email} disabled />
            <Input label="Age" type="number" name="age" value={form.age} onChange={handleChange} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Latitude" name="lat" value={form.lat} onChange={handleChange} />
              <Input label="Longitude" name="lng" value={form.lng} onChange={handleChange} />
            </div>

            {message && (
              <p className="rounded-xl bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
                {message}
              </p>
            )}

            {error && (
              <p className="rounded-xl bg-rose-400/10 px-4 py-2 text-sm text-rose-300">
                {error}
              </p>
            )}

            <button
              disabled={saving}
              className="
                w-full rounded-xl
                bg-gradient-to-r from-pink-500/70 via-rose-500/70 to-indigo-500/70
                py-3
                font-medium tracking-wide
                text-white
                shadow-[0_0_35px_rgba(236,72,153,0.35)]
                transition-all duration-700
                hover:from-pink-400/70 hover:to-indigo-400/70
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

/* 🌫️ Calm Input */
const Input = ({ label, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-xs tracking-wide text-slate-400">{label}</label>
    <input
      {...props}
      className="
        w-full rounded-xl
        bg-black/30
        border border-white/10
        px-4 py-2.5
        text-sm text-slate-200
        outline-none
        transition-all duration-300
        focus:border-pink-400/50
        focus:ring-2 focus:ring-pink-400/20
        disabled:opacity-60
      "
    />
  </div>
);

export default EditProfile;
