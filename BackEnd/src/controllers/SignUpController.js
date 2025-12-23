const signUp_service = require("../services/SignUpService");

// SIGNUP CONTROLLER
exports.signUp = async (req, res) => {

  try {
    const result = await signUp_service.signUp(req.body);

    return res.status(201).json(result);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Signup failed"
    });
  }
};
