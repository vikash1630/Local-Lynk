import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import UserNavBar from "../components/UserNavBar";

const API_URL = import.meta.env.VITE_API_URL;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const ADMIN_ID = "69cd1ef1cbfa79b5933fd3bc";

/* ─────────────────────────────────────────────
   REALISTIC BOT REPLY ENGINE
   ───────────────────────────────────────────── */
const generateBotReply = (userMessage) => {
  const msg = userMessage.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|hiya|howdy|sup|what'?s up|good (morning|afternoon|evening))/.test(msg)) {
    const greetings = [
      "👋 Hi there! Welcome to LocalLynk Support. How can I assist you today?",
      "Hello! 😊 Thanks for reaching out. What can I help you with?",
      "Hey! Great to hear from you. What brings you here today?",
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // How are you / status
  if (/how are you|how('?re| is) (you|it going)|you okay|you good/.test(msg)) {
    return "I'm doing great, thanks for asking! 😄 I'm here and ready to help. What can I do for you?";
  }

  // Job / hiring / work / career
  if (/\b(job|jobs|hiring|hire|work|career|employment|vacancy|vacancies|position|apply|application|resume|cv|internship)\b/.test(msg)) {
    if (/how (do|can) i apply|application process|steps to apply/.test(msg)) {
      return "📋 To apply for a job on LocalLynk:\n1. Create or log into your account\n2. Browse listings under the 'Jobs' section\n3. Click 'Apply' on any listing\n4. Submit your profile/resume\n\nNeed help with any specific step?";
    }
    if (/status|update|progress/.test(msg)) {
      return "🔍 To check your application status, go to your Profile → Applications. Each application shows its current stage. Employers typically respond within 3–5 business days.";
    }
    return "💼 LocalLynk connects local talent with nearby employers. You can browse jobs, post listings, or track applications — all in one place. What specifically are you looking for?";
  }

  // Product / services / what do you offer
  if (/\b(product|products|service|services|offer|offerings|feature|features|what (do|does|can) (you|locallynk))\b/.test(msg)) {
    return "🛍️ LocalLynk offers:\n• Job listings & hiring tools\n• Local business directories\n• Product & service marketplaces\n• Community messaging\n\nWhich area would you like to explore?";
  }

  // Pricing / cost / fee / subscription / plan
  if (/\b(price|pricing|cost|fee|fees|subscription|plan|plans|pay|payment|charge|charges|free|premium)\b/.test(msg)) {
    return "💳 LocalLynk has a free tier with core features. Premium plans unlock advanced analytics, priority listings, and enhanced support. Pricing details are available on our website under 'Plans'. Want me to walk you through the options?";
  }

  // Account / login / signup / register / password
  if (/\b(account|login|log in|sign(?: |-)?(?:up|in)|register|registration|password|forgot password|reset|email)\b/.test(msg)) {
    if (/forgot|reset|can't log|cannot log/.test(msg)) {
      return "🔑 To reset your password: go to the Login page → click 'Forgot Password' → enter your registered email. A reset link will be sent within a few minutes. Check your spam folder if you don't see it!";
    }
    if (/delete|close|remove my account/.test(msg)) {
      return "⚠️ To delete your account, go to Settings → Account → Delete Account. Please note this action is irreversible. If you're having issues, I'd love to help resolve them before you go!";
    }
    return "🔐 For account-related help, you can manage everything under Settings. If you're locked out or facing login issues, try resetting your password first. Still stuck? Let me know more details!";
  }

  // Technical / bug / error / not working / crash
  if (/\b(error|bug|crash|broken|not working|issue|problem|glitch|fail|failed|loading|slow|lag)\b/.test(msg)) {
    return "🛠️ Sorry to hear you're running into an issue! Could you tell me:\n• What device/browser are you using?\n• What exactly happened?\n• Any error message you see?\n\nThis helps us fix it faster. 🙏";
  }

  // Contact / support / human / agent / talk to someone
  if (/\b(contact|support|human|agent|real person|talk to someone|customer (service|care)|help desk)\b/.test(msg)) {
    return "📞 For dedicated support, you can:\n• Email us at support@locallynk.com\n• Use the Help Center in the app menu\n• This chat is available Mon–Fri, 9am–6pm IST\n\nA team member will follow up shortly!";
  }

  // Delivery / shipping / order
  if (/\b(delivery|shipping|order|dispatch|track|tracking|courier|arrive|arrival)\b/.test(msg)) {
    return "📦 For order or delivery queries, head to Orders → Track Order in the app. If there's a delay, the seller is notified automatically. You can also message the seller directly from the order page.";
  }

  // Refund / return / cancel / money back
  if (/\b(refund|return|cancel|cancellation|money back|chargeback)\b/.test(msg)) {
    return "💰 Refund & return policies depend on the seller. Generally:\n• Raise a return request within 7 days\n• Go to Orders → Request Return\n• Refunds are processed within 5–7 business days\n\nNeed help with a specific order?";
  }

  // Thank you / thanks
  if (/^(thank(s| you)|ty|thx|cheers|appreciate|great help|helpful)/.test(msg)) {
    const thanks = [
      "You're welcome! 😊 Feel free to reach out anytime.",
      "Happy to help! 🙌 Is there anything else you'd like to know?",
      "Glad I could assist! Don't hesitate to ask if you need anything else. 👍",
    ];
    return thanks[Math.floor(Math.random() * thanks.length)];
  }

  // Bye / goodbye
  if (/^(bye|goodbye|see you|later|take care|cya|gotta go)/.test(msg)) {
    return "Goodbye! 👋 Have a wonderful day. Come back anytime — we're always here to help!";
  }

  // Yes / No / OK / Sure short replies
  if (/^(yes|yeah|yep|yup|sure|ok|okay|alright|no|nope|nah)$/.test(msg)) {
    return "Got it! 👍 Let me know if there's anything specific you'd like help with.";
  }

  // Location / nearby / city / area / local
  if (/\b(location|nearby|near me|city|area|local|locality|neighbourhood|neighborhood|region)\b/.test(msg)) {
    return "📍 LocalLynk is built around your local community! Make sure location access is enabled in the app for the best nearby results. You can also set your preferred area manually under Settings → Location.";
  }

  // Seller / vendor / sell / list / post
  if (/\b(sell|seller|vendor|list|listing|post a (job|product|service)|become a seller)\b/.test(msg)) {
    return "🏪 Want to sell or post on LocalLynk? It's easy:\n1. Go to your Dashboard\n2. Click 'Add Listing'\n3. Choose: Job / Product / Service\n4. Fill in the details and publish!\n\nYour listing goes live immediately. Need help with anything specific?";
  }

  // Notification / alert / email notification
  if (/\b(notification|notifications|alert|alerts|email notification|push|remind)\b/.test(msg)) {
    return "🔔 You can manage your notification preferences under Settings → Notifications. Choose what you want to be alerted about — new messages, job matches, order updates, and more!";
  }

  // Privacy / data / security / safe
  if (/\b(privacy|data|secure|security|safe|gdpr|personal (info|information|data))\b/.test(msg)) {
    return "🔒 Your privacy is our top priority. LocalLynk encrypts all personal data and never sells it to third parties. You can view and manage your data under Settings → Privacy. Our full policy is at locallynk.com/privacy.";
  }

  // Rating / review / feedback
  if (/\b(rating|review|feedback|rate|stars|complaint)\b/.test(msg)) {
    return "⭐ You can leave a review after completing a transaction or interaction. Go to the relevant Order / Job / Profile and tap 'Leave Review'. Your feedback helps the whole community!";
  }

  // App / download / mobile / iOS / Android
  if (/\b(app|download|mobile|ios|android|play store|app store|install)\b/.test(msg)) {
    return "📱 The LocalLynk app is available on both iOS (App Store) and Android (Play Store). Search for 'LocalLynk' and look for our official icon. Make sure you're downloading the latest version for the best experience!";
  }

  // Default fallback — varied and polite
  const fallbacks = [
    "🤖 Thanks for your message! I want to make sure I give you the right info. Could you rephrase or give me a bit more detail?",
    "I'm here to help! 😊 Could you tell me a little more about what you need?",
    "Got your message! To assist you better, could you share more details about your query?",
    "Thanks for reaching out to LocalLynk Support. I didn't quite catch that — could you elaborate a bit?",
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};

/* ─────────────────────────────────────────────
   COMPONENT
   ───────────────────────────────────────────── */
const Chat = () => {
  const { friendId } = useParams();

  const [currentUserId, setCurrentUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [socket, setSocket] = useState(null);
  const isAdminChat = friendId === ADMIN_ID;

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const [isTyping, setIsTyping] = useState(false);
  const [deliveredMap, setDeliveredMap] = useState({});
  const [showLegend, setShowLegend] = useState(false);

  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);
  const typingTimerRef = useRef(null);

  /* ── Auto scroll ── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* ── Get logged user ── */
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch(`${API_URL}/api/user/me`, { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        setCurrentUserId(data.userId);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  /* ── Fetch chat history ── */
  useEffect(() => {
    if (!currentUserId || !friendId) return;
    let timer;

    fetch(`${API_URL}/api/chat/history/${friendId}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (isAdminChat) {
          const welcomeMessage = {
            _id: "welcome-msg",
            from: ADMIN_ID,
            to: currentUserId,
            message: "👋 Welcome to LocalLynk Support! I'm here to help you with jobs, products, accounts, and more. What can I assist you with today?",
            messageType: "text",
            createdAt: new Date(),
          };

          setIsTyping(true);
          timer = setTimeout(() => {
            setIsTyping(false);
            const alreadyHasWelcome = data.some((msg) => msg._id === "welcome-msg");
            setMessages(alreadyHasWelcome ? data : [welcomeMessage, ...data]);
          }, 2000);
        } else {
          setMessages(data);
        }
      })
      .catch(() => {});

    return () => { if (timer) clearTimeout(timer); };
  }, [currentUserId, friendId, isAdminChat]);

  /* ── Socket ── */
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

  /* ── Typing emit ── */
  useEffect(() => {
    if (!socket || !currentUserId) return;
    if (text.trim()) {
      socket.emit("typing", { from: currentUserId, to: friendId });
    }
    const timer = setTimeout(() => {
      socket.emit("stopTyping", { from: currentUserId, to: friendId });
    }, 800);
    return () => clearTimeout(timer);
  }, [text]);

  /* ── Send text ── */
  const sendMessage = () => {
    if (!text.trim() || !socket || uploading) return;

    const userMsg = text.trim();

    socket.emit("sendMessage", {
      from: currentUserId,
      to: friendId,
      message: userMsg,
      messageType: "text",
    });

    setText("");

    if (isAdminChat) {
      // Vary bot reply delay slightly for realism (1.5s – 3s)
      const delay = 1500 + Math.random() * 1500;

      setIsTyping(true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);

      typingTimerRef.current = setTimeout(() => {
        setIsTyping(false);
        const botReply = {
          _id: `bot-${Date.now()}`,
          from: ADMIN_ID,
          to: currentUserId,
          message: generateBotReply(userMsg),
          messageType: "text",
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, botReply]);
      }, delay);
    }
  };

  /* ── Send file ── */
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
        setErrorMsg("❌ File upload failed. Please try again.");
      } finally {
        setUploading(false);
        setUploadProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    xhr.onerror = () => {
      setErrorMsg("❌ Network error. Please check your connection.");
      setUploading(false);
      setUploadProgress(0);
    };

    xhr.send(formData);
  };

  const formatTime = (d) =>
    d
      ? new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "";

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
    return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-purple-950 to-red-950">
        <UserNavBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-white text-lg">Loading chat…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUserId || !friendId) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-purple-950 to-red-950">
        <UserNavBar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white text-xl">Invalid chat session.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-purple-950 to-red-950">
      <UserNavBar />

      {/* Chat area — fills remaining viewport height below the navbar */}
      <div className="flex-1 flex flex-col min-h-0 mt-2 mx-3 md:mx-6 mb-3 rounded-2xl overflow-hidden border border-red-900/30 bg-black/20 backdrop-blur-sm">

      {/* Admin demo banner */}
      {isAdminChat && (
        <div className="text-center py-2 px-4 text-yellow-400 text-sm font-medium bg-black/60 backdrop-blur-sm border-b border-yellow-900/40 flex-shrink-0">
          ⚠️ This is a demonstration chat. Replies are automated.
        </div>
      )}

      {/* ── Tick / Clock legend (top-right, toggleable) ── */}
      <div className="flex justify-end px-4 pt-1 flex-shrink-0 relative">
        <button
          onClick={() => setShowLegend((v) => !v)}
          className="text-xs text-gray-400 hover:text-gray-200 transition flex items-center gap-1 select-none"
          title="What do the message icons mean?"
        >
          <span className="text-base leading-none">ℹ️</span>
          <span>Message status</span>
        </button>

        {showLegend && (
          <div className="absolute top-7 right-4 z-50 bg-black/90 border border-purple-800/60 rounded-2xl shadow-2xl p-4 w-64 backdrop-blur-xl">
            <p className="text-white text-sm font-semibold mb-3">Message Status</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-lg w-6 text-center">⌛</span>
                <div>
                  <p className="text-gray-200 text-xs font-medium">Sending</p>
                  <p className="text-gray-400 text-xs">Message is on its way</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base w-6 text-center text-gray-300">✓</span>
                <div>
                  <p className="text-gray-200 text-xs font-medium">Sent</p>
                  <p className="text-gray-400 text-xs">Message delivered to server</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowLegend(false)}
              className="mt-3 text-xs text-purple-400 hover:text-purple-200 transition"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-3 space-y-3 min-h-0">
        {messages.length === 0 && !isTyping && (
          <div className="flex justify-center mt-16">
            <p className="text-gray-500 text-sm">No messages yet. Say hello! 👋</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isMe = msg.from === currentUserId;
          const prev = messages[i - 1];
          const showDate =
            !prev ||
            new Date(prev.createdAt).toDateString() !== new Date(msg.createdAt).toDateString();

          return (
            <React.Fragment key={msg._id || i}>
              {showDate && (
                <div className="flex justify-center my-4">
                  <span className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-black/60 text-gray-400 backdrop-blur select-none">
                    {formatDateLabel(msg.createdAt)}
                  </span>
                </div>
              )}

              <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] min-w-[80px] px-4 py-3 rounded-2xl shadow-lg
                    ${isMe
                      ? "bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-br-sm"
                      : "bg-gradient-to-br from-purple-900/90 to-black/80 text-gray-100 rounded-bl-sm border border-purple-800/30"
                    }`}
                  style={{ wordBreak: "break-word" }}
                >
                  {/* Text */}
                  {msg.messageType === "text" && (
                    <p className="text-sm md:text-base leading-relaxed whitespace-pre-line">
                      {msg.message}
                    </p>
                  )}

                  {/* Image */}
                  {msg.messageType === "image" && msg.fileUrl && (
                    <img
                      src={msg.fileUrl}
                      className="max-w-[240px] rounded-xl object-cover"
                      alt="Shared image"
                      loading="lazy"
                    />
                  )}

                  {/* File */}
                  {msg.messageType === "file" && msg.fileUrl && (
                    <a
                      href={msg.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 underline text-sm hover:opacity-80 transition"
                    >
                      <span>📎</span>
                      <span>Download file</span>
                    </a>
                  )}

                  {/* Timestamp + delivery status */}
                  <div className={`flex items-center gap-1.5 mt-1.5 ${isMe ? "justify-end" : "justify-start"}`}>
                    <span className={`text-xs ${isMe ? "text-orange-100/70" : "text-gray-500"}`}>
                      {formatTime(msg.createdAt)}
                    </span>
                    {isMe && (
                      <span
                        className="text-xs leading-none"
                        title={deliveredMap[msg._id] ? "Delivered" : "Sending…"}
                      >
                        {deliveredMap[msg._id]
                          ? <span className="text-orange-100/80">✓</span>
                          : <span className="text-orange-200/50">⌛</span>
                        }
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-purple-900/80 border border-purple-800/30 shadow-lg">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Upload progress bar */}
      {uploading && (
        <div className="px-4 pb-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 w-10 text-right">{uploadProgress}%</span>
          </div>
        </div>
      )}

      {/* Error message */}
      {errorMsg && (
        <div className="px-4 pb-2 flex-shrink-0">
          <p className="text-center text-red-400 text-sm bg-red-950/50 rounded-xl py-2 px-4 border border-red-800/40">
            {errorMsg}
          </p>
        </div>
      )}

      {/* ── Input bar ── */}
      <div className="flex-shrink-0 px-3 md:px-4 py-3 flex items-center gap-2 bg-black/50 backdrop-blur-xl border-t border-white/5">
        {/* File attach */}
        <label
          className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full
            bg-purple-900/60 hover:bg-purple-800/70 active:scale-95
            transition cursor-pointer select-none text-lg
            ${uploading ? "opacity-40 pointer-events-none" : ""}`}
          title="Attach file"
        >
          📎
          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={(e) => sendFile(e.target.files[0])}
            disabled={uploading}
          />
        </label>

        {/* Text input */}
        <input
          type="text"
          value={text}
          disabled={uploading}
          onChange={(e) => {
            setText(e.target.value);
            if (errorMsg) setErrorMsg("");
          }}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          className="flex-1 px-4 py-3 rounded-full bg-black/60 border border-white/10
            text-white text-sm md:text-base outline-none
            focus:ring-2 focus:ring-red-600/60 focus:border-transparent
            placeholder-gray-500 transition disabled:opacity-50"
          placeholder="Type a message…"
          autoComplete="off"
        />

        {/* Send button */}
        <button
          onClick={sendMessage}
          disabled={uploading || !text.trim()}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full
            bg-red-600 hover:bg-red-500 active:scale-95
            text-white text-lg transition
            disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
          title="Send"
        >
          ➤
        </button>
      </div>

      </div>{/* end inner chat area */}
    </div>
  );
};

export default Chat;
