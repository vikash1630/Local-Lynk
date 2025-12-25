const LogoutService = require("../services/LogoutService");

// LOGOUT CONTROLLER
exports.logout = async (req, res) => {
  try {
    const result = await LogoutService.logout(res);

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({
      message: "Logout failed"
    });
  }
};
