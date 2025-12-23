const fs = require("fs");
const path = require("path");

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

const saveFileToDisk = (file) => {
  console.log("⚙️ [SERVICE] saveFileToDisk called");

  // STEP 5: Ensure uploads folder
  if (!fs.existsSync(UPLOAD_DIR)) {
    console.log("📁 [SERVICE] uploads folder not found, creating...");
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  } else {
    console.log("📁 [SERVICE] uploads folder exists");
  }

  // STEP 6: Create filename
  const filename = Date.now() + "-" + file.originalname;
  const filePath = path.join(UPLOAD_DIR, filename);

  console.log("✍️ [SERVICE] Writing file to disk...");
  console.log("📍 [SERVICE] Path:", filePath);

  // STEP 7: Write file
  fs.writeFileSync(filePath, file.buffer);

  console.log("📝 [SERVICE] File write completed");

  // STEP 8: Verify file exists
  if (!fs.existsSync(filePath)) {
    throw new Error("File not found after write");
  }

  // STEP 9: Verify file size > 0
  const stats = fs.statSync(filePath);

  console.log("📏 [SERVICE] File size on disk:", stats.size, "bytes");

  if (stats.size <= 0) {
    throw new Error("File written but size is 0 bytes");
  }

  // ✅ FINAL SUCCESS LOG (ONLY HERE)
  console.log("✅✅ [SERVICE] FILE UPLOADED SUCCESSFULLY TO uploads/");
  console.log("📦 [SERVICE] Final filename:", filename);

  return {
    fileName: filename,
    filePath,
    fileUrl: `/uploads/${filename}`
  };
};

module.exports = { saveFileToDisk };
