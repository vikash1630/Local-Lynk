const saveFileToCloudinaryService = (file) => {
  if (!file) {
    const err = new Error("No file provided");
    err.statusCode = 400;
    throw err;
  }

  return {
    fileName: file.originalname,
    fileUrl: file.secure_url || file.path,,          // Cloudinary URL
    publicId: file.public_id,    // Cloudinary public_id
    mimeType: file.mimetype,
    size: file.size
  };
};

module.exports = saveFileToCloudinaryService;
