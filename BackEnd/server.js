require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Attach Socket.IO to SAME server
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true
  }
});



// Initialize chat socket
const chatSocket = app.get("chatSocket");
chatSocket(io);

// Connect DB first, then start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
