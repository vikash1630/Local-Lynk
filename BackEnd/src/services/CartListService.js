const User = require("../models/User");

exports.getCartService = async (userId) => {
  if (!userId) {
    const error = new Error("UserId is required");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(userId).populate({
    path: "cart.product",
    select: "name description price images status quantity",
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // ✅ REMOVE INVALID CART ITEMS (product === null)
  const validCart = user.cart.filter(item => item.product);

  // ✅ CLEAN DATABASE (IMPORTANT)
  if (validCart.length !== user.cart.length) {
    user.cart = validCart;
    await user.save();
  }

  return validCart;
};
