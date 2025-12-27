const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    // 1️⃣ Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token missing"
      });
    }

    const token = authHeader.split(" ")[1];

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded Token:", decoded);

    console.log("Token verified successfully");
    // 3️⃣ Attach user info to request
    req.user = decoded; // { userId: ... }
    console.log("User info attached to request as :", req.user);

    next(); // allow request
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

module.exports = verifyToken;
