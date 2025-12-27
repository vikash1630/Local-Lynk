const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  console.log("Cookies received:", req.cookies);

  try {
    const authHeader = req.headers.authorization;
    const token =
      authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token missing"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

module.exports = verifyToken;
