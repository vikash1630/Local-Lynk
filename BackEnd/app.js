const express = require("express");

const cors = require("cors");
const cookieParser = require("cookie-parser");


const app = express();
app.use((req, res, next) => {
  console.log("📥 Incoming request:", req.method, req.url);
  next();
});

app.use(cors({
  origin: "http://localhost:5173", // Adjust this to your frontend's origin
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
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


// Add Product Route
const addProductRoute = require("./src/routes/addProductRoute");

// logout route
const logoutRoute = require("./src/routes/LogoutRoute");

// Google Login Route
const googleLoginRoute = require("./src/routes/googleLoginRoute");

// Nearby Products Route
const nearByProductsRoute = require("./src/routes/NearByProductsRoute")

// Search Route
const searchRoute = require("./src/routes/ProductSearchRoute")

// product by id route
const productByIdRoute = require("./src/routes/productByIdRoute")

// Product List Route
const productListRoute = require("./src/routes/productListRoute")

// User List Route
const userListRoute = require("./src/routes/UsersListRoute");

// Send Friend Request Route
const sendFriendRequestRoute = require("./src/routes/SendFriendRequestRoute");

// Accept Friend Request Route
const acceptFriendRequestRoute = require("./src/routes/AcceptFriendRequestRoute")

// Reject Friend Request Route
const rejectFriendRequestRoute = require("./src/routes/RejectFriendRequestRoute");

// Block User Route
const blockUserRoute = require("./src/routes/BlockUserRoute");

// Unblock User Route
const unblockUserRoute = require("./src/routes/UnBlockUserRoute")

// Get Profile Details Route
const getProfileRoute = require("./src/routes/GetProfileRoute")

// Friends List Route
const getFriendsRoute = require("./src/routes/GetFriendsRoute")

// Unfriend Route
const unFriendRoute = require("./src/routes/UnFriendRoute")

// Blocked Users List Route
const blockedUserListRoute = require("./src/routes/BlockedUserListRoute")

// List of Friend Requests Route
const getRequestsRoute = require("./src/routes/GetRequestsRoute")

// List of Friend Requests Sent
const getSentRequestsRoute = require("./src/routes/GetSentRequestsRoute")

// Use Routes
app.use("/api", signUpRoute);
app.use("/api", LoginRoute);
app.use("/api", googleLoginRoute);
app.use("/api", logoutRoute);
app.use("/api/chat", chatRoute);
app.use("/api/chat", uploadRoute);
app.use("/api/product", addProductRoute);
app.use("/api/product", nearByProductsRoute);
app.use("/api/product", searchRoute);
app.use("/api/product", productByIdRoute);
app.use("/api/products", productListRoute);
app.use("/api/users", userListRoute);
app.use("/api/friend", sendFriendRequestRoute);
app.use("/api/friend", acceptFriendRequestRoute);
app.use("/api/friend", rejectFriendRequestRoute);
app.use("/api/user", blockUserRoute);
app.use("/api/user", unblockUserRoute);
app.use("/api/profile", getProfileRoute);
app.use("/api/friends", getFriendsRoute);
app.use("/api/friend", unFriendRoute);
app.use("/api/user", blockedUserListRoute);
app.use("/api/user", getRequestsRoute);
app.use("/api/user", getSentRequestsRoute);


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
