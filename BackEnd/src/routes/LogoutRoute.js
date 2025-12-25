const express = require("express");
const router = express.Router();

const { logout } = require("../controllers/LogoutController")

// LOGOUT
router.post("/logout", logout);

module.exports = router;
