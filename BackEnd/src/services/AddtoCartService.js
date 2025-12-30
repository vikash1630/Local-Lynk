const mongoose = require("mongoose");
const User = require("../models/User");
const Product = require("../models/Product");

/* ---------------- ADD TO CART ---------------- */
exports.addToCartService = async (userId, productId) => {
  // 1️⃣ Validate inputs
  if (!userId || !productId) {
    throw new Error("user or product not found");
  }

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(productId)
  ) {
    throw new Error("Invalid user or product");
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

  // ❌ Block sold or out-of-stock products
  if (product.status === "sold" || product.quantity === 0) {
    throw new Error("Product out of stock");
  }

  // 4️⃣ Check if product already in cart
  const itemIndex = user.cart.findIndex(
    (item) => item.product.toString() === productId.toString()
  );

  if (itemIndex > -1) {
    const currentQty = user.cart[itemIndex].quantity;

    // ❌ STOCK LIMIT CHECK
    if (currentQty + 2 > product.quantity) {
      throw new Error("Requested quantity exceeds available stock");
    }

    user.cart[itemIndex].quantity += 1;
  } else {
    // New item
    if (product.quantity < 1) {
      error.statur = 400;
      throw new Error("Product out of stock");
    }

    user.cart.push({
      product: productId,
      quantity: 1,
    });
  }

  await user.save();
  return user.cart;
};
