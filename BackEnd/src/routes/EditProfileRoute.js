const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken")
const userController = require("../controllers/EditProfileController")
const upload = require("../middlewares/upload");

router.put("/edit", verifyToken, upload.single("avatar"), userController.editProfile);

module.exports = router;
