const mongoose = require("mongoose");
const Order = require("../models/Order");

exports.getMyOrders = async (userId) => {
  // ✅ Validate userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const err = new Error("Invalid user ID");
    err.statusCode = 400;
    throw err;
  }

  // 🔍 Find orders placed by this user
  const orders = await Order.find({ buyer: userId })
    .populate("item")          // product details
    .populate("seller", "name email") // optional, minimal seller info
    .sort({ createdAt: -1 });  // latest first

    console.log(orders)

  return orders;
};
