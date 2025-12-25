const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.signUp = async (data) => {
    const { name, email, password, confirmPassword, age, } = data;

    // What is 400 error code? -> Bad Request - server received request and understood it, but the request is invalid so refused to process it because input is wrong.

    // basic validation
    if (!name || !email || !password || !confirmPassword || !age || name.trim() === "" || email.trim() === "" || password.trim() === "") {
        const error = new Error("All fields are required");
        error.statusCode = 400;
        throw error;
    }

    // password match validation
    if (password != confirmPassword) {
        const error = new Error("Passwords do not match");
        error.statusCode = 400;
        throw error;
    }

    // age validation
    if (age != parseInt(age)) {
        const error = new Error("Age must be a number");
        error.statusCode = 400;
        throw error;
    }

    // what is 409 error code? -> Conflict - request could not be completed due to a conflict with the current state of the resource, such as duplicate entries.

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new Error("User already exists");
        error.statusCode = 409;
        throw error;
    }


    const saltRounds = 10;

    // generate salt
    const salt = await bcrypt.genSalt(saltRounds);

    // hash password with salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        // location: {
        //     type: "Point",
        //     coordinates: [lng, lat]   // longitude first, latitude second
        // }
    });

    return {
        message: "User registered successfully",
        userId: user._id,
        name: user.name,
        email: user.email,
        hashedpassword: user.password,
    };
};









