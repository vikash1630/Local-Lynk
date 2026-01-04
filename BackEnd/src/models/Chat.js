// models/Chat.js
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    message: { type: String, default: "" },

    messageType: {
      type: String,
      enum: ["text", "image", "video", "audio", "pdf", "file"],
      default: "text",
    },

    fileUrl: { type: String, default: null }
  },
  {
    timestamps: true // ✅ automatically adds createdAt & updatedAt
  }
);

module.exports = mongoose.model("Chat", chatSchema);
