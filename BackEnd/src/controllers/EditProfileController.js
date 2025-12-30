const userService = require("../services/EditProfileService")
exports.editProfile = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    const updatedUser = await userService.editProfile(userId, req.body);

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to update profile",
    });
  }
};
