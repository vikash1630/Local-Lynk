import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const Signup = () => {
  const navigate = useNavigate();

  // form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");

  // location
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
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ token: googleToken })
      });

      navigate("/home");
    } catch (err) {
      setError("Google login failed");
    }
  };

  // 🔥 AUTO-DETECT LOCATION
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLocationLoading(false);
      },
      () => {
        setLocationLoading(false); // fallback to backend default
      }
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
          coordinates: [Number(longitude), Number(latitude)]
        }
        : null;

    try {
      const response = await fetch(`${API_URL}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
          age: age ? Number(age) : 0,
          ...(location && { location })
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Create Account
        </h2>

        {error && (
          <p className="mb-4 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-md border px-3 py-2 text-sm"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border px-3 py-2 text-sm"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-md border px-3 py-2 text-sm"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full rounded-md border px-3 py-2 text-sm"
          />

          <input
            type="number"
            placeholder="Age (optional)"
            min="0"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />

          <input
            type="text"
            value={
              locationLoading
                ? "Detecting location..."
                : latitude || "Not available"
            }
            readOnly
            className="w-full rounded-md border bg-gray-100 px-3 py-2 text-sm"
          />

          <input
            type="text"
            value={
              locationLoading
                ? "Detecting location..."
                : longitude || "Not available"
            }
            readOnly
            className="w-full rounded-md border bg-gray-100 px-3 py-2 text-sm"
          />

          <button
            type="submit"
            disabled={loading || locationLoading}
            className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-60"
          >
            {locationLoading
              ? "Fetching location..."
              : loading
                ? "Creating account..."
                : "Sign Up"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-medium text-blue-600 hover:underline"
          >
            Login
          </button>
        </p>



        <div className="mt-4 flex justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              handleGoogleLogin(credentialResponse.credential);
            }}
            onError={() => {
              setError("Google login failed");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
