const User = require("../models/User");

exports.getCartService = async (userId) => {
  if (!userId) {
    throw new Error("UserId is required");
  }

  const user = await User.findById(userId).populate({
    path: "cart.product",
    select: "name description price images status",
  });

  if (!user) {
    throw new Error("User not found");
  }

  console.log("User cart:", user.cart);
  return user.cart;
};
