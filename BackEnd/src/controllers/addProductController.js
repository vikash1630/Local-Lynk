const addProductService = require("../services/addProductService")

exports.addProductController = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    console.log("FILES:", req.files);
    console.log("BODY:", req.body);

    // ✅ Extract image URLs from Cloudinary
    const images = req.files?.map(file => file.path) || [];

    // ✅ Merge body + images
    const data = {
      ...req.body,
      images,
    };

    const result = await addProductService.addProduct(userId, data);

    res.status(201).json(result);

  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Something went wrong"
    });
  }
};
