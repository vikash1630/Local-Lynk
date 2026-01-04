import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import UserNavBar from "../components/UserNavBar";

const API_URL = import.meta.env.VITE_API_URL;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;


const Chat = () => {
  const { friendId } = useParams();

  const [currentUserId, setCurrentUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [socket, setSocket] = useState(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const [isTyping, setIsTyping] = useState(false);
  const [deliveredMap, setDeliveredMap] = useState({});

  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------------- GET LOGGED USER ---------------- */
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch(`${API_URL}/api/user/me`, {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        setCurrentUserId(data.userId);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  /* ---------------- FETCH CHAT HISTORY ---------------- */
  useEffect(() => {
    if (!currentUserId || !friendId) return;

    fetch(`${API_URL}/api/chat/history/${friendId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setMessages)
      .catch(() => {});
  }, [currentUserId, friendId]);

  /* ---------------- SOCKET ---------------- */
  useEffect(() => {
    if (!currentUserId) return;

    const s = io(SOCKET_URL, { withCredentials: true });
    setSocket(s);

    s.emit("join", currentUserId);

    s.on("receiveMessage", (chat) => {
      if (
        (chat.from === currentUserId && chat.to === friendId) ||
        (chat.from === friendId && chat.to === currentUserId)
      ) {
        setMessages((prev) => [...prev, chat]);
      }
    });

    s.on("typing", () => setIsTyping(true));
    s.on("stopTyping", () => setIsTyping(false));

    s.on("messageDelivered", ({ messageId }) => {
      setDeliveredMap((prev) => ({ ...prev, [messageId]: true }));
    });

    return () => s.disconnect();
  }, [currentUserId, friendId]);

  /* ---------------- TYPING EMIT ---------------- */
  useEffect(() => {
    if (!socket) return;

    if (text.trim()) {
      socket.emit("typing", { from: currentUserId, to: friendId });
    }

    const timer = setTimeout(() => {
      socket.emit("stopTyping", { from: currentUserId, to: friendId });
    }, 800);

    return () => clearTimeout(timer);
  }, [text]);

  /* ---------------- SEND TEXT ---------------- */
  const sendMessage = () => {
    if (!text.trim() || !socket || uploading) return;

    socket.emit("sendMessage", {
      from: currentUserId,
      to: friendId,
      message: text.trim(),
      messageType: "text",
    });

    setText("");
  };

  /* ---------------- SEND FILE ---------------- */
  const sendFile = (file) => {
    if (!file || !socket) return;

    setUploading(true);
    setUploadProgress(0);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_URL}/api/chat/upload`);
    xhr.withCredentials = true;

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setUploadProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        if (xhr.status !== 200 && xhr.status !== 201) throw new Error();
        const res = JSON.parse(xhr.responseText);

        socket.emit("sendMessage", {
          from: currentUserId,
          to: friendId,
          messageType: file.type.startsWith("image/") ? "image" : "file",
          fileUrl: res.file.fileUrl,
        });
      } catch {
        setErrorMsg("❌ File upload failed");
      } finally {
        setUploading(false);
        setUploadProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    xhr.onerror = () => {
      setErrorMsg("❌ Network error");
      setUploading(false);
      setUploadProgress(0);
    };

    xhr.send(formData);
  };

  const formatTime = (d) =>
    d ? new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "🕒";

  const formatDateLabel = (d) => {
    const date = new Date(d);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const sameDay = (a, b) =>
      a.getDate() === b.getDate() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear();

    if (sameDay(date, today)) return "Today";
    if (sameDay(date, yesterday)) return "Yesterday";

    return date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) return <div className="p-12 text-center text-xl">Loading…</div>;
  if (!currentUserId || !friendId)
    return <div className="p-12 text-center text-xl">Invalid chat</div>;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-black via-purple-950 to-red-950">
      <UserNavBar />

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        {messages.map((msg, i) => {
          const isMe = msg.from === currentUserId;
          const prev = messages[i - 1];
          const showDate =
            !prev ||
            new Date(prev.createdAt).toDateString() !==
              new Date(msg.createdAt).toDateString();

          return (
            <React.Fragment key={msg._id}>
              {showDate && (
                <div className="flex justify-center my-6">
                  <span className="px-6 py-2 rounded-full text-sm font-bold tracking-widest
                    bg-black/70 text-gray-300 backdrop-blur">
                    {formatDateLabel(msg.createdAt)}
                  </span>
                </div>
              )}

              <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[78%] px-6 py-4 rounded-3xl shadow-2xl
                  ${isMe
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                    : "bg-gradient-to-br from-purple-900 to-black text-gray-200"
                  }`}
                >
                  {msg.messageType === "text" && (
                    <p className="text-lg leading-relaxed">{msg.message}</p>
                  )}

                  {msg.messageType === "image" && (
                    <img
                      src={msg.fileUrl}
                      className="max-w-[260px] rounded-2xl"
                      alt=""
                    />
                  )}

                  {msg.messageType === "file" && (
                    <a
                      href={msg.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="underline text-lg"
                    >
                      📎 Download file
                    </a>
                  )}

                  <div className="flex justify-end gap-2 mt-2 text-sm opacity-80">
                    <span>{formatTime(msg.createdAt)}</span>
                    {isMe && <span>{deliveredMap[msg._id] ? "✓" : "⌛"}</span>}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* TYPING */}
      {isTyping && (
        <div className="px-8 pb-3 text-2xl font-semibold text-purple-300 animate-pulse">
          typing…
        </div>
      )}

      {/* UPLOAD BAR */}
      {uploading && (
        <div className="px-6 pb-3">
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="text-center text-red-400 text-base pb-2">
          {errorMsg}
        </div>
      )}

      {/* INPUT */}
      <div className="p-5 flex items-center gap-4 bg-black/50 backdrop-blur-xl">
        <input
          type="text"
          value={text}
          disabled={uploading}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 px-6 py-4 rounded-full bg-black/70
            text-white text-xl outline-none focus:ring-2 focus:ring-red-600"
          placeholder="Type a message…"
        />

        <label className="cursor-pointer text-3xl hover:scale-110 transition">
          📎
          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={(e) => sendFile(e.target.files[0])}
            disabled={uploading}
          />
        </label>

        <button
          onClick={sendMessage}
          disabled={uploading}
          className="px-8 py-4 rounded-full bg-red-600
            text-white text-xl font-bold hover:bg-red-700
            disabled:opacity-50 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
