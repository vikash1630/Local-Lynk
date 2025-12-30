const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken")
const userController = require("../controllers/EditProfileController")
router.put("/edit", verifyToken, userController.editProfile);

module.exports = router;
