/*
  This middleware runs AFTER multer
  It validates:
  - file existence
  - file type
  - file size
*/

const fileValidationMiddleware = (req, res, next) => {

  // 1️⃣ Check if file exists
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file provided"
    });
  }

  // 2️⃣ Allowed MIME types
  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "video/mp4",
    "application/pdf",
    "application/zip",
    "application/x-zip-compressed"
  ];

  // 3️⃣ Check file type
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      success: false,
      message: "Invalid file type"
    });
  }

  // 4️⃣ Max file size (50 MB)
  const MAX_SIZE = 50 * 1024 * 1024; // bytes

  if (req.file.size > MAX_SIZE) {
    return res.status(400).json({
      success: false,
      message: "File too large. Max 50MB allowed"
    });
  }

  // 5️⃣ Everything OK → move to controller
  next();
};

module.exports = fileValidationMiddleware;
