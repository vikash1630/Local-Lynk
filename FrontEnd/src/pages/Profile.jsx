import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavBar from "../components/UserNavBar";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  /* ================= PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/profile`, {
          method: "POST",
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, []);

  /* ================= FRIENDS ================= */
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch(`${API_URL}/api/friends`, {
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setFriends(data.friends);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  /* ================= BLOCKED USERS ================= */
  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/api/user/blocked`, {
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setBlockedUsers(data.blockedUsers);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchBlockedUsers();
  }, []);

  /* ================= ACTIONS ================= */
  const handleUnfriend = async (friendId) => {
    if (!confirm("Unfriend this user?")) return;
    await fetch(`${API_URL}/api/user/unfriend/${friendId}`, {
      method: "DELETE",
      credentials: "include",
    });
    setFriends((prev) => prev.filter((f) => f._id !== friendId));
  };

  const handleBlock = async (friendId) => {
    if (!confirm("Block this user?")) return;
    await fetch(`${API_URL}/api/user/block/${friendId}`, {
      method: "POST",
      credentials: "include",
    });
    setFriends((prev) => prev.filter((f) => f._id !== friendId));
    setBlockedUsers((prev) => [...prev, { _id: friendId }]);
  };

  const handleUnblock = async (blockedUserId) => {
    if (!confirm("Unblock this user?")) return;
    await fetch(`${API_URL}/api/user/unblock/${blockedUserId}`, {
      method: "POST",
      credentials: "include",
    });
    setBlockedUsers((prev) =>
      prev.filter((u) => u._id !== blockedUserId)
    );
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-slate-300">
        Loading profile…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen
        relative
        overflow-hidden
        bg-slate-900
      "
    >
      {/* 🔥 MULTI-GRADIENT BACKGROUND LAYERS */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.35),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.35),transparent_55%)]" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-rose-900/40" />

      <div className="relative z-10">
        <UserNavBar />

        <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">

          {/* ===== PROFILE CARD ===== */}
          <div className="group rounded-3xl bg-slate-800/70 backdrop-blur-xl border border-slate-700 shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-8 transition-all duration-500 hover:scale-[1.015] hover:shadow-[0_30px_80px_rgba(244,63,94,0.25)]">
            <h1 className="text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-indigo-400">
              {user.name}
            </h1>
            <p className="text-slate-300 mt-1">{user.email}</p>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
              {[
                ["User ID", user._id],
                ["Friends", friends.length],
                [
                  "Joined",
                  new Date(user.createdAt).toLocaleDateString(),
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl bg-slate-900/60 p-4 border border-slate-700"
                >
                  <p className="text-slate-400 text-xs mb-1">
                    {label}
                  </p>
                  <p className="text-slate-200 font-medium truncate">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ===== FRIENDS ===== */}
          <div className="rounded-3xl bg-slate-800/70 backdrop-blur-xl border border-slate-700 p-8 shadow-xl">
            <h2 className="text-xl font-bold text-rose-300 mb-6">
              Friends
            </h2>

            {friends.length === 0 ? (
              <p className="text-slate-400">
                No friends yet
              </p>
            ) : (
              <ul className="space-y-5">
                {friends.map((friend) => (
                  <li
                    key={friend._id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-xl bg-slate-900/60 border border-slate-700 p-4 transition hover:scale-[1.01]"
                  >
                    <div>
                      <p className="text-slate-200 font-semibold">
                        {friend.name}
                      </p>
                      <p className="text-sm text-slate-400">
                        {friend.email}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => navigate("/chat")}
                        className="px-3 py-1.5 rounded bg-indigo-500 text-white text-sm hover:bg-indigo-600 transition"
                      >
                        Chat
                      </button>
                      <button
                        onClick={() =>
                          handleUnfriend(friend._id)
                        }
                        className="px-3 py-1.5 rounded bg-amber-500 text-white text-sm hover:bg-amber-600 transition"
                      >
                        Unfriend
                      </button>
                      <button
                        onClick={() =>
                          handleBlock(friend._id)
                        }
                        className="px-3 py-1.5 rounded bg-rose-600 text-white text-sm hover:bg-rose-700 transition"
                      >
                        Block
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ===== BLOCKED USERS ===== */}
          <div className="rounded-3xl bg-slate-800/70 backdrop-blur-xl border border-slate-700 p-8 shadow-xl">
            <h2 className="text-xl font-bold text-rose-300 mb-6">
              Blocked Users
            </h2>

            {blockedUsers.length === 0 ? (
              <p className="text-slate-400">
                No blocked users
              </p>
            ) : (
              <ul className="space-y-4">
                {blockedUsers.map((blocked) => (
                  <li
                    key={blocked._id}
                    className="flex justify-between items-center rounded-xl bg-slate-900/60 border border-slate-700 p-4"
                  >
                    <div>
                      <p className="text-slate-200 font-medium">
                        {blocked.name || blocked._id}
                      </p>
                      {blocked.email && (
                        <p className="text-xs text-slate-400">
                          {blocked.email}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        handleUnblock(blocked._id)
                      }
                      className="px-3 py-1.5 rounded bg-emerald-500 text-white text-sm hover:bg-emerald-600 transition"
                    >
                      Unblock
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
