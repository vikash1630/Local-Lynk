const userService = require("../services/GetProfileDetailsService")

exports.getUserDetails = async (req, res) => {
  try {
    const userId  = req.user.userId || req.user.id;
    console.log("Fetching details for userId:", userId);
    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json(user);

  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Failed to fetch user"
    });
  }
};
