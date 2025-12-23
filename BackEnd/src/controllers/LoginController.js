const Login_Service = require("../services/LoginService");

// LOGIN CONTROLLER
exports.login = async (req, res) => {
  try {
    const result = await Login_Service.login(req.body);
    return res.status(200).json(result);
    } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Login failed"
    });
  }
};

