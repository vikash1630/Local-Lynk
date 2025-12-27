const Login_Service = require("../services/LoginService");
const cookieParser = require("cookie-parser");

// LOGIN CONTROLLER
exports.login = async (req, res) => {
  try {
    const result = await Login_Service.login(req.body);

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false,      // true in prod
      sameSite: "lax",    // IMPORTANT
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    console.log("Cookie set with token:", result.token);

    return res.status(200).json({
      message: "Login successful",
      user: result.user
    });

  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Login failed"
    });
  }
};
