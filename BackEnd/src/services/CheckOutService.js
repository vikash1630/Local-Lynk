const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const mongoose = require("mongoose");

exports.buyWholeCart = async (buyerId) => {
  if (!mongoose.Types.ObjectId.isValid(buyerId)) {
    const err = new Error("Invalid buyer ID");
    err.statusCode = 400;
    throw err;
  }

  // 🧾 Fetch buyer with cart populated
  const buyer = await User.findById(buyerId).populate("cart.product");

  if (!buyer) {
    const err = new Error("Buyer not found");
    err.statusCode = 404;
    throw err;
  }

  if (!buyer.cart || buyer.cart.length === 0) {
    const err = new Error("Cart is empty");
    err.statusCode = 400;
    throw err;
  }

  const createdOrders = [];

  // 🛒 Process each cart item
  for (const cartItem of buyer.cart) {
    const product = cartItem.product;
    const quantity = cartItem.quantity;

    if (!product) continue;

    // ❌ Product unavailable
    if (product.status !== "available") {
      const err = new Error(`${product.name} is not available`);
      err.statusCode = 400;
      throw err;
    }

    // ❌ Insufficient stock
    if (product.quantity < quantity) {
      const err = new Error(
        `Insufficient stock for ${product.name}`
      );
      err.statusCode = 400;
      throw err;
    }

    const sellerId = product.owner;

    // 🧾 Create order
    const order = await Order.create({
      buyer: buyerId,
      seller: sellerId,
      item: product._id,
      quantity,
      price: product.price,
      status: "confirmed",
    });

    createdOrders.push(order._id);

    // 📉 Update product stock
    product.quantity -= quantity;
    if (product.quantity === 0) {
      product.status = "sold";
    }
    await product.save();

    // 🧑‍💼 Push order to seller
    await User.findByIdAndUpdate(sellerId, {
      $push: { orders: order._id },
    });

    // 🧑‍🛒 Push order to buyer
    buyer.orders.push(order._id);
  }

  // 🧹 Clear buyer cart
  buyer.cart = [];
  await buyer.save();

  return {
    message: "Cart purchased successfully",
    ordersCreated: createdOrders.length,
    orderIds: createdOrders,
  };
};
