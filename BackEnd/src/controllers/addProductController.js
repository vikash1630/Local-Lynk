const addProductService = require("../services/addProductService");

exports.addProductController = async (req, res) => {
  try {
    
    // 1️⃣ Get userId from verifyToken middleware
    const userId = req.user.userId || req.user.id;
    console.log("User ID from token:", userId);

    // 2️⃣ Pass body as data
    const data = req.body;
    console.log("Request body data:", data);

    if (!data) {
      console.log("Request body is missing");
      error.statusCode = 400;
      return res.status(400).json({ message: "Request body is missing" });
    }
    
    // 3️⃣ Call service correctly
    const result = await addProductService.addProduct(userId, data);
    console.log("Product added successfully:", result);
    res.status(201).json(result);

  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Something went wrong"
    });
  }
};
