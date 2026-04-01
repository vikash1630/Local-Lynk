const Chat = require("../models/Chat");
const User = require("../models/User");

const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    /* ---------------- JOIN PERSONAL ROOM ---------------- */
    socket.on("join", async (userId) => {
      if (!userId) return;

      const user = await User.findById(userId);
      if (!user) return;

      socket.join(userId);
      socket.userId = userId;

      console.log(`👤 ${user.name} (${userId}) joined personal room`);
    });

    /* ---------------- TYPING ---------------- */
    socket.on("typing", ({ from, to }) => {
      if (!from || !to || socket.userId !== from) return;
      io.to(to).emit("typing");
    });

    socket.on("stopTyping", ({ from, to }) => {
      if (!from || !to || socket.userId !== from) return;
      io.to(to).emit("stopTyping");
    });

    /* ---------------- SEND MESSAGE ---------------- */
    socket.on("sendMessage", async (data) => {
      const { from, to, message = "", messageType = "text", fileUrl = null } = data;

      if (
        !from || !to || from === to || socket.userId !== from ||
        (messageType === "text" && !message) ||
        (messageType !== "text" && !fileUrl)
      ) {
        return;
      }

      try {
        const chat = await Chat.create({ from, to, message, messageType, fileUrl });

        io.to(to).emit("receiveMessage", chat);
        io.to(from).emit("receiveMessage", chat);
        io.to(from).emit("messageDelivered", { messageId: chat._id });
      } catch (err) {
        console.error("❌ sendMessage DB error:", err.message);
        socket.emit("messageError", {
          error: "Failed to send message. Please try again."
        });
      }
    });

    /* ---------------- DISCONNECT ---------------- */
    socket.on("disconnect", () => {
      console.log(`❌ User ${socket.userId} disconnected`);
    });
  });
};

module.exports = chatSocket;
