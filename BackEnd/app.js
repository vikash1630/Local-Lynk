const express = require("express");

const cors = require("cors");

const app = express();
app.use((req, res, next) => {
  console.log("📥 Incoming request:", req.method, req.url);
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Make uploaded files publicly accessible
app.use("/uploads", express.static("uploads"));


console.log("App.js Running...");

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({ message: "Local Lynk Backend Running from home Route" });
});

// Test Route
app.get("/test", (req, res) => {
  res.status(200).json({
    receivedBody: req.body
  });
});


// Import Routes

// signup route
const signUpRoute = require("./src/routes/SignUpRoute");

// login route
const LoginRoute = require("./src/routes/loginRoute");

// chat route
const chatRoute = require("./src/socket/chat");


// Upload route
const uploadRoute = require("./src/routes/uploadFileRoute");

// add Friend Route
const addFriendRoute = require("./src/routes/addFriendRoute");

// Add Product Route
const addProductRoute = require("./src/routes/addProductRoute");

// Use Routes
app.use("/api", signUpRoute);
app.use("/api", LoginRoute);
app.use("/api/chat", chatRoute);
app.use("/api/chat", uploadRoute);
app.use("/api", addFriendRoute);
app.use("/api/product", addProductRoute);


/* attach socket function */
app.set("chatSocket", require("./src/socket/chat"));


// checking if verifyToken middleware works
const verifyToken = require("./src/middlewares/verifyToken");

app.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({
    message: "Access to protected route granted",
    user: req.user
  });
});




module.exports = app;
