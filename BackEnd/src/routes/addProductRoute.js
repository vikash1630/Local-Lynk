const express = require("express");
const router = express.Router();

const productController = require("../controllers/addProductController")
const verifyToken = require("../middlewares/verifyToken")
const upload = require("../middlewares/upload") // ✅ NEW

// ADD PRODUCT WITH IMAGES
router.post(
  "/add-product",
  verifyToken,
  (req, res, next) => {
    console.log("✅ verifyToken passed");
    next();
  },
  upload.array("images", 1),
  (req, res, next) => {
    console.log("✅ multer passed");
    console.log("FILES:", req.files);
    console.log("BODY:", req.body);
    next();
  },
  productController.addProductController
);


module.exports = router;
