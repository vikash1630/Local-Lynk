const multer = require("multer");

// safest option
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;
