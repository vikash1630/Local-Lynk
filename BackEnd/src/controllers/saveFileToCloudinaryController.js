const saveFileToCloudinaryService = require("../services/saveFileToCloudinaryService")

exports.uploadFileController = async (req, res) => {
  try {
    const result = saveFileToCloudinaryService(req.file);

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
