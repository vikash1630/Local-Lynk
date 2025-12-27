import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
        if (!res.ok) throw new Error(data.message || "Failed to load profile");

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
          method: "GET",
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
      <div className="flex justify-center items-center h-screen">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* ===== PROFILE CARD ===== */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold">{user.name}</h1>
        <p className="text-gray-500">{user.email}</p>

        <div className="mt-4 flex gap-6 text-sm text-gray-600">
          <span>User ID: {user._id}</span>
          <span>Friends: {friends.length}</span>
          <span>
            Joined: {new Date(user.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* ===== FRIEND LIST ===== */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Friends</h2>

        {friends.length === 0 ? (
          <p className="text-gray-500">No friends yet</p>
        ) : (
          <ul className="space-y-4">
            {friends.map((friend) => (
              <li
                key={friend._id}
                className="flex justify-between items-center border-b pb-3"
              >
                <div>
                  <p className="font-medium">{friend.name}</p>
                  <p className="text-sm text-gray-500">{friend.email}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate("/chat")}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
                  >
                    Chat
                  </button>

                  <button
                    onClick={() => handleUnfriend(friend._id)}
                    className="px-3 py-1 text-sm bg-yellow-500 text-white rounded"
                  >
                    Unfriend
                  </button>

                  <button
                    onClick={() => handleBlock(friend._id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded"
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
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Blocked Users</h2>

        {blockedUsers.length === 0 ? (
          <p className="text-gray-500">No blocked users</p>
        ) : (
          <ul className="space-y-3">
            {blockedUsers.map((blocked) => (
              <li
                key={blocked._id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="text-sm font-medium">
                    {blocked.name || blocked._id}
                  </p>
                  {blocked.email && (
                    <p className="text-xs text-gray-500">
                      {blocked.email}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleUnblock(blocked._id)}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded"
                >
                  Unblock
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Profile;
