const express = require("express");
const router = express.Router();

const { signUp } = require("../controllers/SignUpController");

// SIGNUP ROUTE
router.post("/signup", signUp);

module.exports = router;
