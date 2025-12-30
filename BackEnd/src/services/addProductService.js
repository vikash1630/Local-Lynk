const User = require("../models/User");
const Product = require("../models/Product");

const DEFAULT_PRODUCT_IMAGE =
  "https://res.cloudinary.com/demo/image/upload/v1690000000/default-product.png";

exports.addProduct = async (userId, data) => {
  try {
    /* 1️⃣ Check user */
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    /* 2️⃣ Destructure */
    const {
      name,
      description,
      price,
      quantity = 1,
      lng,
      lat,
      images,
    } = data;

    /* 3️⃣ Validation */
    if (!name || price === undefined || lng === undefined || lat === undefined) {
      const error = new Error("Name, price, longitude and latitude are required");
      error.statusCode = 400;
      throw error;
    }

    if (price < 0) {
      const error = new Error("Price cannot be negative");
      error.statusCode = 400;
      throw error;
    }

    if (quantity < 0) {
      const error = new Error("Quantity cannot be negative");
      error.statusCode = 400;
      throw error;
    }

    /* 4️⃣ Handle images PROPERLY */
    let finalImages;

    if (Array.isArray(images) && images.length > 0) {
      finalImages = images;
    } else {
      finalImages = [DEFAULT_PRODUCT_IMAGE];
    }

    /* 5️⃣ Create product */
    const product = await Product.create({
      name: name.trim(),
      description: description?.trim(),
      price,
      quantity,
      status: quantity === 0 ? "sold" : "available",
      images: finalImages,
      owner: user._id,
      location: {
        type: "Point",
        coordinates: [lng, lat], // lng first
      },
    });

    /* 6️⃣ Attach product to user */
    if (Array.isArray(user.products)) {
      user.products.push(product._id);
      await user.save();
    }

    return {
      message: "Product added successfully",
      product,
    };
  } catch (error) {
    console.error("Error in addProduct service:", error.message);
    throw error;
  }
};
