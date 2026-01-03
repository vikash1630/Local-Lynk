const mongoose = require("mongoose");
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

exports.buyNow = async ({ buyerId, productId }) => {
  // ✅ Validate ObjectIds
  if (!mongoose.Types.ObjectId.isValid(buyerId)) {
    const err = new Error("Invalid buyer ID");
    err.statusCode = 400;
    throw err;
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    const err = new Error("Invalid product ID");
    err.statusCode = 400;
    throw err;
  }

  // 🔍 Find product
  const product = await Product.findById(productId);

  if (!product) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }

  if (product.status !== "available") {
    const err = new Error("Product is not available");
    err.statusCode = 400;
    throw err;
  }

  if (product.quantity <= 0) {
    const err = new Error("Product is out of stock");
    err.statusCode = 400;
    throw err;
  }

  if (product.owner.toString() === buyerId.toString()) {
    const err = new Error("You cannot buy your own product");
    err.statusCode = 400;
    throw err;
  }

  // 🔍 Find buyer
  const buyer = await User.findById(buyerId);
  if (!buyer) {
    const err = new Error("Buyer not found");
    err.statusCode = 404;
    throw err;
  }

  // 🧾 Create order
  const order = await Order.create({
    buyer: buyerId,
    seller: product.owner, // stored for future use
    item: product._id,
    quantity: 1,
    price: product.price,
  });

  // ✅ ONLY buyer gets order reference
  buyer.orders.push(order._id);
  await buyer.save();

  // 📉 Reduce product quantity
  product.quantity -= 1;

  if (product.quantity === 0) {
    product.status = "sold";
  }

  await product.save();

  return order;
};
