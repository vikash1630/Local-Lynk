const mongoose = require("mongoose");
const User = require("../models/User")
const Product = require("../models/Product")
/* ---------------- REMOVE FROM CART ---------------- */
exports.removeFromCartService = async (userId, productId) => {
  // 1️⃣ Validate inputs
  if (!userId || !productId) {
    throw new Error("userId and productId are required");
  }

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(productId)
  ) {
    throw new Error("Invalid userId or productId");
  }

  // 2️⃣ Check user
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // 3️⃣ Check cart empty
  if (!user.cart || user.cart.length === 0) {
    throw new Error("Cart is empty");
  }

  // 4️⃣ Check product exists in cart
  const itemIndex = user.cart.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    throw new Error("Product not found in cart");
  }

  // 5️⃣ Remove item
  user.cart.splice(itemIndex, 1);

  await user.save();
  return user.cart;
};
