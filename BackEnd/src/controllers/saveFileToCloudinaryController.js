const saveFileToCloudinaryService = require("../services/saveFileToCloudinaryService")

exports.uploadFileController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const result = await saveFileToCloudinaryService(req.file);

    res.status(201).json({
      success: true,
      file: result
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};