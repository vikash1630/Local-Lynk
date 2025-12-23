const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (data) => {   
    const { email, password } = data;

    // basic validation
    if (!email || !password || email.trim() === "" || password.trim() === "") {
        const error = new Error("Email and password are required");
        error.statusCode = 400;
        throw error;
    }
    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }  
    // compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    // generate JWT token
    const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
    return {
        message: "Login successful",
        token,
        userId: user._id,
        name: user.name,
        email: user.email,
    };
}