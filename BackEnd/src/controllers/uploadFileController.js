const { saveFileToDisk } = require("../services/uploadFileService");

const uploadFile = (req, res) => {
  try {
    console.log("🧠 [CONTROLLER] uploadFile controller entered");

    if (!req.file) {
      console.log("❌ [CONTROLLER] No file found in request");
      return res.status(400).json({
        success: false,
        message: "No file received"
      });
    }

    console.log("✅ [CONTROLLER] File validated");
    console.log("📄 [CONTROLLER] Original name:", req.file.originalname);
    console.log("📦 [CONTROLLER] Buffer size:", req.file.buffer.length, "bytes");

    // STEP 4: Call service
    const fileData = saveFileToDisk(req.file);

    console.log("🎉 [CONTROLLER] Upload SUCCESS confirmed");

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      fileUrl: fileData.fileUrl
    });

  } catch (err) {
    console.error("🔥 [CONTROLLER] Upload failed:", err.message);
    res.status(500).json({
      success: false,
      message: "Upload failed"
    });
  }
};

module.exports = { uploadFile };
