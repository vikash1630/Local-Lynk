import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Community = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // canonical state (from list APIs)
  const [friends, setFriends] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  // current user (for self check)
  const [currentUserId, setCurrentUserId] = useState(null);

  // UI state
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH FUNCTIONS (MUST BE ABOVE useEffect) ================= */

  const fetchProfile = async () => {
    const res = await fetch(`${API_URL}/api/profile`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    setCurrentUserId(data._id);
  };

  const fetchFriends = async () => {
    const res = await fetch(`${API_URL}/api/friends`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    setFriends(data.friends || []);
  };

  const fetchReceivedRequests = async () => {
    const res = await fetch(`${API_URL}/api/user/requests/recieved`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    setReceivedRequests(data.requests || []);
  };

  // 🔥 BACKEND IS SOURCE OF TRUTH
  const fetchSentRequests = async () => {
    const res = await fetch(`${API_URL}/api/user/requests/sent`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    console.log("🔍 SENT REQUESTS API RESPONSE:", data);
    setSentRequests(data.requests || []);
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    Promise.all([
      fetchProfile(),
      fetchFriends(),
      fetchReceivedRequests(),
      fetchSentRequests(),
    ]).finally(() => setLoading(false));
  }, []);

  /* ================= LIVE SEARCH ================= */
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      const res = await fetch(
        `${API_URL}/api/users?search=${encodeURIComponent(search)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      setSearchResults(data || []);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  /* ================= HELPERS ================= */
  const isFriend = (id) => friends.some((f) => f._id === id);
  const hasSentRequest = (id) => sentRequests.some((r) => r._id === id);
  const hasReceivedRequest = (id) =>
    receivedRequests.some((r) => r._id === id);

  /* ================= ACTION APIs ================= */

  const sendRequest = async (user) => {
    if (
      user._id === currentUserId ||
      isFriend(user._id) ||
      hasSentRequest(user._id) ||
      hasReceivedRequest(user._id)
    ) {
      return;
    }

    setSentRequests((prev) => [...prev, user]);

    try {
      await fetch(
        `${API_URL}/api/friend/send-friend-request/${user._id}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch {
      setSentRequests((prev) =>
        prev.filter((u) => u._id !== user._id)
      );
    }
  };

  const acceptRequest = async (user) => {
    await fetch(
      `${API_URL}/api/friend/accept-friend-request/${user._id}`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    setReceivedRequests((prev) =>
      prev.filter((r) => r._id !== user._id)
    );
    setFriends((prev) => [...prev, user]);
  };

  const rejectRequest = async (user) => {
    await fetch(
      `${API_URL}/api/friend/reject-friend-request/${user._id}`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    setReceivedRequests((prev) =>
      prev.filter((r) => r._id !== user._id)
    );
  };

  const unfriend = async (user) => {
    await fetch(`${API_URL}/api/friend/unfriend/${user._id}`, {
      method: "DELETE",
      credentials: "include",
    });

    setFriends((prev) =>
      prev.filter((f) => f._id !== user._id)
    );
  };

  const block = async (user) => {
    await fetch(`${API_URL}/api/user/block/${user._id}`, {
      method: "POST",
      credentials: "include",
    });

    setFriends((prev) =>
      prev.filter((f) => f._id !== user._id)
    );
  };

  if (loading) {
    return <div className="p-6">Loading community…</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* ===== FRIENDS ===== */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Friends</h2>
        {friends.length === 0 ? (
          <p>No friends yet</p>
        ) : (
          friends.map((f) => (
            <div key={f._id} className="flex justify-between mb-2">
              <span>{f.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate("/chat")}
                  className="bg-blue-500 text-white px-2 rounded"
                >
                  Chat
                </button>
                <button
                  onClick={() => unfriend(f)}
                  className="bg-yellow-500 text-white px-2 rounded"
                >
                  Unfriend
                </button>
                <button
                  onClick={() => block(f)}
                  className="bg-red-500 text-white px-2 rounded"
                >
                  Block
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ===== SEARCH USERS ===== */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Search Users</h2>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 w-full mb-3"
          placeholder="Search by name or email"
        />

        {searchResults.map((u) => (
          <div key={u._id} className="flex justify-between mb-2">
            <span>{u.name}</span>

            {u._id === currentUserId ? (
              <button disabled className="bg-gray-300 px-2 rounded">
                You
              </button>
            ) : isFriend(u._id) ? (
              <button disabled className="bg-gray-300 px-2 rounded">
                Friend
              </button>
            ) : hasSentRequest(u._id) ? (
              <button disabled className="bg-gray-300 px-2 rounded">
                Request Sent
              </button>
            ) : hasReceivedRequest(u._id) ? (
              <button disabled className="bg-gray-300 px-2 rounded">
                Request Received
              </button>
            ) : (
              <button
                onClick={() => sendRequest(u)}
                className="bg-green-500 text-white px-2 rounded"
              >
                Send
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ===== REQUESTS RECEIVED ===== */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Requests Received</h2>
        {receivedRequests.length === 0 ? (
          <p>No requests</p>
        ) : (
          receivedRequests.map((u) => (
            <div key={u._id} className="flex justify-between mb-2">
              <span>{u.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => acceptRequest(u)}
                  className="bg-green-500 text-white px-2 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => rejectRequest(u)}
                  className="bg-red-500 text-white px-2 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ===== REQUESTS SENT ===== */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Requests Sent</h2>
        {sentRequests.length === 0 ? (
          <p>No sent requests</p>
        ) : (
          sentRequests.map((u) => (
            <div key={u._id} className="flex justify-between mb-2">
              <span>{u.name}</span>
              <button disabled className="bg-gray-300 px-2 rounded">
                Pending
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default Community;
