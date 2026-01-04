import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import IndexNavBar from "../components/IndexNavBar";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  /* ---------------- GOOGLE LOGIN ---------------- */
  const handleGoogleLogin = async (googleToken) => {
    try {
      const res = await fetch(`${API_URL}/api/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token: googleToken }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Google login failed");

      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  /* ---------------- EMAIL LOGIN ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      navigate("/home");
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
        <div
          className="relative w-full max-w-md sm:max-w-lg
          rounded-2xl border border-rose-900/40
          bg-[#020617]/80 backdrop-blur-xl
          p-6 sm:p-8
          shadow-[0_0_80px_rgba(244,63,94,0.15)]"
        >
          {/* 🔥 HEADING */}
          <h2
            className="mb-2 text-center text-3xl sm:text-4xl font-extrabold
            bg-gradient-to-r from-red-500 via-rose-400 to-pink-400
            text-transparent bg-clip-text"
          >
            Welcome Back
          </h2>

          <p className="mb-6 text-center text-slate-400 text-base sm:text-lg">
            Return to <span className="text-rose-400 font-semibold">LocalLynk</span>
          </p>

          {error && (
            <p
              className="mb-4 rounded-lg border border-red-500/30
              bg-red-500/10 px-4 py-3 text-red-300"
            >
              {error}
            </p>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-1 block text-base font-medium text-slate-300">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg bg-[#020617]/70
                  border border-slate-700 px-4 py-3
                  text-base text-slate-200 placeholder-slate-500
                  outline-none transition
                  focus:border-rose-400
                  focus:ring-2 focus:ring-rose-400/30"
              />
            </div>

            <div>
              <label className="mb-1 block text-base font-medium text-slate-300">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg bg-[#020617]/70
                  border border-slate-700 px-4 py-3
                  text-base text-slate-200 placeholder-slate-500
                  outline-none transition
                  focus:border-rose-400
                  focus:ring-2 focus:ring-rose-400/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg py-3 text-lg font-semibold text-white
                bg-gradient-to-r from-red-600 via-rose-500 to-pink-500
                shadow-[0_0_40px_rgba(244,63,94,0.35)]
                transition hover:opacity-90
                disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Entering the Corps..." : "Login"}
            </button>
          </form>

          {/* SIGN UP */}
          <p className="mt-6 text-center text-slate-400">
            New here?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="font-semibold text-rose-400 hover:underline"
            >
              Become a Member
            </button>
          </p>

          {/* GOOGLE LOGIN */}
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

export default Login;
