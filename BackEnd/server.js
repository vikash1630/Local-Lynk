require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

/* ---------------- CREATE HTTP SERVER ---------------- */
const server = http.createServer(app);

/* ---------------- SOCKET.IO SETUP ---------------- */
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: true,          // ✅ reflect frontend origin
    methods: ["GET", "POST"],
    credentials: true
  }
});

/* ---------------- INIT CHAT SOCKET ---------------- */
const chatSocket = app.get("chatSocket");
chatSocket(io);

/* ---------------- CONNECT DB & START SERVER ---------------- */
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Server failed to start:", err);
  });
