import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import IndexNavBar from "../components/IndexNavBar";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationLoading, setLocationLoading] = useState(true);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleGoogleLogin = async (googleToken) => {
    try {
      await fetch(`${API_URL}/api/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token: googleToken }),
      });
      navigate("/home");
    } catch {
      setError("Google login failed");
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setLocationLoading(false);
      },
      () => setLocationLoading(false)
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const location =
      latitude && longitude
        ? {
            type: "Point",
            coordinates: [Number(longitude), Number(latitude)],
          }
        : null;

    try {
      const res = await fetch(`${API_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
          age: age ? Number(age) : 0,
          ...(location && { location }),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#1a1a1a]">
      <IndexNavBar />

      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-10">
        <div className="relative w-full max-w-md sm:max-w-lg
          rounded-2xl border border-rose-900/40
          bg-[#020617]/80 backdrop-blur-xl
          p-6 sm:p-8 shadow-[0_0_80px_rgba(244,63,94,0.15)]">

          {/* 🔥 HEADING */}
          <h2 className="mb-2 text-center text-3xl sm:text-4xl font-extrabold
            bg-gradient-to-r from-red-500 via-rose-400 to-pink-400
            text-transparent bg-clip-text">
            Join the Corps
          </h2>

          <p className="mb-6 text-center text-slate-400 text-base sm:text-lg">
            Create your <span className="text-rose-400 font-semibold">LocalLynk</span> account
          </p>

          {error && (
            <p className="mb-4 rounded-lg border border-red-500/30
              bg-red-500/10 px-4 py-3 text-red-300">
              {error}
            </p>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              ["Full Name", name, setName, "text"],
              ["Email", email, setEmail, "email"],
              ["Password", password, setPassword, "password"],
              ["Confirm Password", confirmPassword, setConfirmPassword, "password"],
            ].map(([placeholder, value, setter, type], i) => (
              <input
                key={i}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => setter(e.target.value)}
                required
                className="w-full rounded-lg bg-[#020617]/70
                  border border-slate-700 px-4 py-3
                  text-base text-slate-200 placeholder-slate-500
                  outline-none transition
                  focus:border-rose-400
                  focus:ring-2 focus:ring-rose-400/30"
              />
            ))}

            <input
              type="number"
              placeholder="Age (optional)"
              min="0"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full rounded-lg bg-[#020617]/70
                border border-slate-700 px-4 py-3
                text-base text-slate-200 placeholder-slate-500
                outline-none transition
                focus:border-emerald-400
                focus:ring-2 focus:ring-emerald-400/30"
            />

            {/* LOCATION */}
            <input
              readOnly
              value={
                locationLoading
                  ? "Detecting breathing style location..."
                  : latitude || "Location unavailable"
              }
              className="w-full rounded-lg bg-slate-800/60
                border border-slate-700 px-4 py-3 text-slate-400"
            />

            <input
              readOnly
              value={
                locationLoading
                  ? "Detecting breathing style location..."
                  : longitude || "Location unavailable"
              }
              className="w-full rounded-lg bg-slate-800/60
                border border-slate-700 px-4 py-3 text-slate-400"
            />

            {/* ⚔️ SUBMIT */}
            <button
              type="submit"
              disabled={loading || locationLoading}
              className="w-full rounded-lg py-3 text-lg font-semibold text-white
                bg-gradient-to-r from-red-600 via-rose-500 to-pink-500
                shadow-[0_0_40px_rgba(244,63,94,0.35)]
                transition hover:opacity-90 disabled:opacity-60"
            >
              {locationLoading
                ? "Synchronizing..."
                : loading
                ? "Creating account..."
                : "Become a Slayer"}
            </button>
          </form>

          {/* LOGIN */}
          <p className="mt-6 text-center text-slate-400">
            Already enlisted?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-rose-400 hover:underline"
            >
              Login
            </button>
          </p>

          {/* GOOGLE */}
          <div className="mt-6 flex justify-center scale-110">
            <GoogleLogin
              onSuccess={(res) => handleGoogleLogin(res.credential)}
              onError={() => setError("Google login failed")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
