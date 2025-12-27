const mongoose = require("mongoose");
const User = require("../models/User");
const Product = require("../models/Product");

/* ---------------- ADD TO CART ---------------- */
exports.addToCartService = async (userId, productId) => {
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

  // 3️⃣ Check product
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  // Optional: block adding sold products
  if (product.status === "sold") {
    throw new Error("Product already sold");
  }

  // 4️⃣ Check if product already in cart
  const itemIndex = user.cart.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex > -1) {
    // Increment quantity
    user.cart[itemIndex].quantity += 1;
  } else {
    // Add new item
    user.cart.push({
      product: productId,
      quantity: 1,
    });
  }

  await user.save();
  return user.cart;
};
