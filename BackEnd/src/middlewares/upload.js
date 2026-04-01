const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
  const isImage = file.mimetype.startsWith("image/");
  return {
    folder: isImage ? "products" : "chat_files",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf", "mp4", "zip"],
    ...(isImage && {
      transformation: [{ width: 1200, height: 1200, crop: "limit" }],
    }),
    resource_type: isImage ? "image" : "auto",
  };
},
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

console.log("✅ Upload middleware loaded");


module.exports = upload;
