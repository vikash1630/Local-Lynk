const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // 👤 Buyer (who placed the order)
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 👤 Seller (who owns the product/service)
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 📦 What product is being ordered
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", 
      required: true,
    },


    // quantity
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },

    // 💰 Price at time of order (important!)
    price: {
      type: Number,
      required: true,
    },

    // 📌 Order status
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },

    // 📍 Delivery / service location (optional)
    location: {
      latitude: Number,
      longitude: Number,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

module.exports = mongoose.model("Order", orderSchema);
