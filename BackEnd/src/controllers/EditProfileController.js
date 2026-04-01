const userService = require("../services/EditProfileService")
const cloudinary = require("../config/cloudinary");

exports.editProfile = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const data = { ...req.body };

    // If a new avatar was uploaded as a file, push it to Cloudinary
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
        transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
      });
      data.profilePhoto = uploadResult.secure_url;
    }

    const updatedUser = await userService.editProfile(userId, data);
    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || "Failed to update profile" });
  }
};