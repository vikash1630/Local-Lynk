const express = require("express");
const upload = require("../config/multer");
const { uploadFile } = require("../controllers/uploadFileController");

const router = express.Router();

router.post(
  "/upload",

  // STEP 1: Route hit
  (req, res, next) => {
    console.log("🚪 [ROUTE] /upload endpoint hit");
    next();
  },

  // STEP 2: Multer middleware
  upload.single("file"),

  (req, res, next) => {
    console.log("📦 [ROUTE] Multer executed");
    next();
  },

  // STEP 3: Controller
  uploadFile
);

module.exports = router;
