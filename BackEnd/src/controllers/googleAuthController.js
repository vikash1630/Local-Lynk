const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: "GOOGLE_AUTH", // dummy
      });
    }

    const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("JWT Token Generated:", jwtToken);

    res.cookie("token", jwtToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false
    });

    console.log("user id :", user.id);
    return res.status(200).json({      message: "Google authentication successful",
      token: jwtToken,
      userId: user._id,
    });
  } catch (err) {
    res.status(401).json({ message: "Google authentication failed" });
  }
};
