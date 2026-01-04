import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserNavBar from "../components/UserNavBar";

const DEFAULT_PROFILE_PHOTO =
  "https://res.cloudinary.com/demo/image/upload/v1690000000/default-profile.png";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  /* ================= FETCH PROFILE ================= */
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
        setError(err.message || "Failed to load profile");
      }
    };

    fetchProfile();
  }, [API_URL]);

  /* ================= FETCH FRIENDS ================= */
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch(`${API_URL}/api/friends`, {
          credentials: "include",
        });

        const data = await res.json();
        if (res.ok) setFriends(data.friends || []);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [API_URL]);

  /* ================= FETCH BLOCKED USERS ================= */
  useEffect(() => {
    const fetchBlocked = async () => {
      try {
        const res = await fetch(`${API_URL}/api/user/blocked`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) setBlockedUsers(data.blockedUsers || []);
      } catch {}
    };

    fetchBlocked();
  }, [API_URL]);

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

  const handleUnblock = async (userId) => {
    await fetch(`${API_URL}/api/user/unblock/${userId}`, {
      method: "POST",
      credentials: "include",
    });

    setBlockedUsers((prev) => prev.filter((u) => u._id !== userId));
  };

  /* ================= LOADING / ERROR ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-400">
        Loading profile…
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-rose-400">
        {error || "Profile not found"}
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.25),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.25),transparent_55%)]" />

      <div className="relative z-10">
        <UserNavBar />

        <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">

          {/* ===== PROFILE CARD ===== */}
          <div className="rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-700 p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              {/* PROFILE PHOTO */}
              <img
                src={user?.profilePhoto || DEFAULT_PROFILE_PHOTO}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-2 border-rose-500/60 shadow-xl"
              />

              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-indigo-400">
                  {user.name}
                </h1>

                <p className="text-slate-400 mt-1 break-all">
                  {user.email}
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <Stat label="User ID" value={user._id} />
                  <Stat label="Friends" value={friends.length} />
                  <Stat
                    label="Joined"
                    value={new Date(user.createdAt).toLocaleDateString()}
                  />
                </div>

                {/* CENTERED EDIT BUTTON */}
                <div className="mt-8 flex justify-center sm:justify-start">
                  <Link
                    to="/EditProfile"
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold shadow-xl hover:scale-105 transition"
                  >
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ===== FRIENDS ===== */}
          <Section title="Friends">
            {friends.length === 0 ? (
              <Empty text="No friends yet" />
            ) : (
              friends.map((f) => (
                <Row key={f._id}>
                  <UserMini user={f} />
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
                    <Btn onClick={() => navigate(`/chat/${f._id}`)} text="Chat" color="indigo" />
                    <Btn onClick={() => handleUnfriend(f._id)} text="Unfriend" color="amber" />
                    <Btn onClick={() => handleBlock(f._id)} text="Block" color="rose" />
                  </div>
                </Row>
              ))
            )}
          </Section>

          {/* ===== BLOCKED USERS ===== */}
          <Section title="Blocked Users">
            {blockedUsers.length === 0 ? (
              <Empty text="No blocked users" />
            ) : (
              blockedUsers.map((u) => (
                <Row key={u._id}>
                  <span className="text-slate-300 truncate">{u.name || u._id}</span>
                  <Btn onClick={() => handleUnblock(u._id)} text="Unblock" color="emerald" />
                </Row>
              ))
            )}
          </Section>

        </div>
      </div>
    </div>
  );
};

/* ================= SMALL COMPONENTS ================= */

const Stat = ({ label, value }) => (
  <div className="rounded-xl bg-slate-950/70 border border-slate-700 p-4">
    <p className="text-xs text-slate-400 uppercase">{label}</p>
    <p className="text-slate-200 font-semibold truncate">{value}</p>
  </div>
);

const Section = ({ title, children }) => (
  <div className="rounded-3xl bg-slate-800/70 backdrop-blur-xl border border-slate-700 p-8 shadow-xl">
    <h2 className="text-xl font-bold text-rose-300 mb-6">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

const Row = ({ children }) => (
  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 rounded-xl bg-slate-900/60 border border-slate-700 p-4">
    {children}
  </div>
);

const UserMini = ({ user }) => (
  <div className="text-center sm:text-left">
    <p className="text-slate-200 font-semibold">{user.name}</p>
    <p className="text-sm text-slate-400 break-all">{user.email}</p>
  </div>
);

const Btn = ({ text, onClick, color }) => {
  const colors = {
    indigo: "bg-indigo-500 hover:bg-indigo-600",
    amber: "bg-amber-500 hover:bg-amber-600",
    rose: "bg-rose-600 hover:bg-rose-700",
    emerald: "bg-emerald-500 hover:bg-emerald-600",
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-white text-sm font-semibold transition ${colors[color]}`}
    >
      {text}
    </button>
  );
};

const Empty = ({ text }) => (
  <p className="text-slate-400 text-center">{text}</p>
);

export default Profile;
