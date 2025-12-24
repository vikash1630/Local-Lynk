const User = require("../models/User");
const Product = require("../models/Product");

exports.addProduct = async (userId, data) => {
    try {
        // 1️⃣ Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        console.log("USER ID:", userId);
        console.log("DATA:", data);


        // 2️⃣ Destructure product data
        const { name, description, price, status, lng, lat } = data;

        // 3️⃣ Basic validation
        if (!name || !price || !lng || !lat) {
            const error = new Error("Required fields missing");
            error.statusCode = 400;
            throw error;
        }

        // 4️⃣ Create product with GeoJSON location
        const product = await Product.create({
            name,
            description,
            price,
            status,
            userId: user._id,
            location: {
                type: "Point",
                coordinates: [lng, lat] // longitude first
            }
        });

        // 5️⃣ Attach product to user (optional but recommended)
        user.products.push(product._id);
        await user.save();

        // 6️⃣ Return response
        return {
            message: "Product added successfully",
            product
        };

    } catch (error) {
        console.error("Error in addProductService:", error);
        throw error;
    }
};
