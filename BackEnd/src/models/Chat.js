// models/Chat.js
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: String,
    messageType: {
      type: String,
      enum: ["text", "image", "video", "audio", "pdf"],
      default: "text",
    },
    fileUrl: String,
    createdAt: { type: Date, default: Date.now }
  },
);

module.exports = mongoose.model("Chat", chatSchema);


