const Product = require("../models/Product");

exports.getMyProductsService = async (userId) => {
    if (!userId) {
        const error = new Error("Unauthorized");
        error.statusCode = 401;
        throw error;
    }

    const products = await Product.find({ owner: userId })
        .select("name description price quantity status images createdAt")
        .sort({
            status: 1,        // available first, sold last
            createdAt: -1     // newest first within each status
        });


    return products;
};
