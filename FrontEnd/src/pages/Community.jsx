import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavBar from "../components/UserNavBar.jsx";

const Community = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [friends, setFriends] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH FUNCTIONS ================= */

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
      credentials: "include",
    });
    const data = await res.json();
    setFriends(data.friends || []);
  };

  const fetchReceivedRequests = async () => {
    const res = await fetch(`${API_URL}/api/user/requests/recieved`, {
      credentials: "include",
    });
    const data = await res.json();
    setReceivedRequests(data.requests || []);
  };

  const fetchSentRequests = async () => {
    const res = await fetch(`${API_URL}/api/user/requests/sent`, {
      credentials: "include",
    });
    const data = await res.json();
    setSentRequests(data.requests || []);
  };

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
        { credentials: "include" }
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

  /* ================= ACTIONS ================= */

  const sendRequest = async (user) => {
    if (
      user._id === currentUserId ||
      isFriend(user._id) ||
      hasSentRequest(user._id) ||
      hasReceivedRequest(user._id)
    )
      return;

    setSentRequests((prev) => [...prev, user]);

    try {
      await fetch(
        `${API_URL}/api/friend/send-friend-request/${user._id}`,
        { method: "POST", credentials: "include" }
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
      { method: "POST", credentials: "include" }
    );

    setReceivedRequests((prev) =>
      prev.filter((r) => r._id !== user._id)
    );
    setFriends((prev) => [...prev, user]);
  };

  const rejectRequest = async (user) => {
    await fetch(
      `${API_URL}/api/friend/reject-friend-request/${user._id}`,
      { method: "POST", credentials: "include" }
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
    return (
      <div className="min-h-screen flex items-center justify-center text-emerald-400">
        Loading community…
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-900 overflow-hidden">
      {/* 🌈 MULTI-GRADIENT BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.35),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.35),transparent_55%)]" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900/40" />

      <div className="relative z-10">
        <UserNavBar />

        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* FRIENDS */}
          <Section title="Friends 🌿">
            {friends.length === 0 ? (
              <Empty text="No friends yet" />
            ) : (
              friends.map((f) => (
                <Card key={f._id}>
                  <span className="text-slate-200 font-medium">
                    {f.name}
                  </span>
                  <div className="flex gap-2">
                    <Btn onClick={() => navigate("/chat")} color="indigo">Chat</Btn>
                    <Btn onClick={() => unfriend(f)} color="amber">Unfriend</Btn>
                    <Btn onClick={() => block(f)} color="rose">Block</Btn>
                  </div>
                </Card>
              ))
            )}
          </Section>

          {/* SEARCH */}
          <Section title="Find People 🔍">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              className="w-full mb-4 bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-slate-200 outline-none"
            />

            {searchResults.map((u) => (
              <Card key={u._id}>
                <span className="text-slate-200">{u.name}</span>
                {u._id === currentUserId ? (
                  <Badge>You</Badge>
                ) : isFriend(u._id) ? (
                  <Badge>Friend</Badge>
                ) : hasSentRequest(u._id) ? (
                  <Badge>Sent</Badge>
                ) : hasReceivedRequest(u._id) ? (
                  <Badge>Received</Badge>
                ) : (
                  <Btn onClick={() => sendRequest(u)} color="emerald">
                    Send
                  </Btn>
                )}
              </Card>
            ))}
          </Section>

          {/* RECEIVED */}
          <Section title="Requests Received 📩">
            {receivedRequests.length === 0 ? (
              <Empty text="No requests" />
            ) : (
              receivedRequests.map((u) => (
                <Card key={u._id}>
                  <span className="text-slate-200">{u.name}</span>
                  <div className="flex gap-2">
                    <Btn onClick={() => acceptRequest(u)} color="emerald">
                      Accept
                    </Btn>
                    <Btn onClick={() => rejectRequest(u)} color="rose">
                      Reject
                    </Btn>
                  </div>
                </Card>
              ))
            )}
          </Section>

          {/* SENT */}
          <Section title="Requests Sent ⏳">
            {sentRequests.length === 0 ? (
              <Empty text="No sent requests" />
            ) : (
              sentRequests.map((u) => (
                <Card key={u._id}>
                  <span className="text-slate-200">{u.name}</span>
                  <Badge>Pending</Badge>
                </Card>
              ))
            )}
          </Section>

        </div>
      </div>
    </div>
  );
};

/* ===== SMALL UI COMPONENTS ===== */

const Section = ({ title, children }) => (
  <div className="rounded-3xl bg-slate-800/70 backdrop-blur-xl border border-slate-700 p-6 shadow-xl">
    <h2 className="text-xl font-bold text-emerald-300 mb-4">
      {title}
    </h2>
    <div className="space-y-3">{children}</div>
  </div>
);

const Card = ({ children }) => (
  <div className="flex justify-between items-center gap-3 rounded-xl bg-slate-900/60 border border-slate-700 p-3 transition hover:scale-[1.02]">
    {children}
  </div>
);

const Btn = ({ children, onClick, color }) => {
  const map = {
    emerald: "bg-emerald-500 hover:bg-emerald-600",
    indigo: "bg-indigo-500 hover:bg-indigo-600",
    amber: "bg-amber-500 hover:bg-amber-600",
    rose: "bg-rose-500 hover:bg-rose-600",
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded text-sm text-white transition ${map[color]}`}
    >
      {children}
    </button>
  );
};

const Badge = ({ children }) => (
  <span className="px-3 py-1 text-sm rounded bg-slate-700 text-slate-300">
    {children}
  </span>
);

const Empty = ({ text }) => (
  <p className="text-slate-400">{text}</p>
);

export default Community;
