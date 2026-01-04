const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");
const upload = require("../middlewares/upload");
const {
  uploadFileController
} = require("../controllers/saveFileToCloudinaryController")

// Upload file to Cloudinary
router.post(
  "/upload",
  verifyToken,
  upload.single("file"),
  uploadFileController
);

module.exports = router;
