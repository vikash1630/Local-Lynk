const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

/* ---------------- LOG INCOMING REQUESTS ---------------- */
app.use((req, res, next) => {
  console.log("📥 Incoming request:", req.method, req.url);
  next();
});

/* ---------------- CORS (CORRECT FOR VERCEL + COOKIES) ---------------- */
app.use(
  cors({
    origin: true,          // ✅ reflect request origin
    credentials: true      // ✅ allow cookies
  })
);

/* ---------------- MIDDLEWARES ---------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

console.log("App.js Running...");

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Local Lynk Backend Running from home Route"
  });
});

/* ---------------- TEST ROUTE ---------------- */
app.get("/test", (req, res) => {
  res.status(200).json({
    receivedBody: req.body
  });
});

/* ---------------- IMPORT ROUTES ---------------- */
const signUpRoute = require("./src/routes/SignUpRoute");
const loginRoute = require("./src/routes/loginRoute");
const logoutRoute = require("./src/routes/LogoutRoute");
const googleLoginRoute = require("./src/routes/googleLoginRoute");

const addProductRoute = require("./src/routes/addProductRoute");
const near_toggleRoute = require("./src/routes/NearByProductsRoute");
const searchRoute = require("./src/routes/ProductSearchRoute");
const productByIdRoute = require("./src/routes/productByIdRoute");
const productListRoute = require("./src/routes/productListRoute");
const allProductListRoute = require("./src/routes/AllProductsRoute");

const userListRoute = require("./src/routes/UsersListRoute");

const sendFriendRequestRoute = require("./src/routes/SendFriendRequestRoute");
const acceptFriendRequestRoute = require("./src/routes/AcceptFriendRequestRoute");
const rejectFriendRequestRoute = require("./src/routes/RejectFriendRequestRoute");
const unFriendRoute = require("./src/routes/UnFriendRoute");

const blockUserRoute = require("./src/routes/BlockUserRoute");
const unblockUserRoute = require("./src/routes/UnBlockUserRoute");
const blockedUserListRoute = require("./src/routes/BlockedUserListRoute");

const getProfileRoute = require("./src/routes/GetProfileRoute");
const getFriendsRoute = require("./src/routes/GetFriendsRoute");
const getRequestsRoute = require("./src/routes/GetRequestsRoute");
const getSentRequestsRoute = require("./src/routes/GetSentRequestsRoute");

const addToCartRoute = require("./src/routes/AddToCartRoute");
const removeFromCartRoute = require("./src/routes/RemoveFromCartRoute");
const cartItemsRoute = require("./src/routes/CartListRoute");

const myProductsRoute = require("./src/routes/MyProductsRoute");
const markSoldRoute = require("./src/routes/MarkProductAsSoldRoute");

const editProfileRoute = require("./src/routes/EditProfileRoute");

const buyNowRoute = require("./src/routes/buyNowRoute");
const myOrdersRoute = require("./src/routes/myOrdersRoute");
const checkOutRoute = require("./src/routes/CheckOutRoute");

const chatHistoryRoute = require("./src/routes/GetChatHistoryRoute");
const fileUploadRoute = require("./src/routes/saveFileToCloudinaryRoute");

/* ---------------- USE ROUTES ---------------- */
app.use("/api", signUpRoute);
app.use("/api", loginRoute);
app.use("/api", googleLoginRoute);
app.use("/api", logoutRoute);

app.use("/api/product", addProductRoute);
app.use("/api/product", near_toggleRoute);
app.use("/api/product", searchRoute);
app.use("/api/product", productByIdRoute);

app.use("/api/products", productListRoute);
app.use("/api/products", allProductListRoute);
app.use("/api/products", markSoldRoute);

app.use("/api/users", userListRoute);

app.use("/api/friend", sendFriendRequestRoute);
app.use("/api/friend", acceptFriendRequestRoute);
app.use("/api/friend", rejectFriendRequestRoute);
app.use("/api/friend", unFriendRoute);

app.use("/api/user", blockUserRoute);
app.use("/api/user", unblockUserRoute);
app.use("/api/user", blockedUserListRoute);
app.use("/api/user", getRequestsRoute);
app.use("/api/user", getSentRequestsRoute);

app.use("/api/profile", getProfileRoute);
app.use("/api/friends", getFriendsRoute);

app.use("/api/cart", addToCartRoute);
app.use("/api/cart", removeFromCartRoute);
app.use("/api/cart", cartItemsRoute);

app.use("/api/Myproducts", myProductsRoute);

app.use("/api/EditProfile", editProfileRoute);

app.use("/api/orders", buyNowRoute);
app.use("/api/orders", myOrdersRoute);

app.use("/api/checkOut", checkOutRoute);

app.use("/api/chat", chatHistoryRoute);
app.use("/api/chat", fileUploadRoute);

/* ---------------- SOCKET ATTACH ---------------- */
app.set("chatSocket", require("./src/socket/chat"));

/* ---------------- AUTH TEST ROUTES ---------------- */
const verifyToken = require("./src/middlewares/verifyToken");

app.get("/api/user/me", verifyToken, (req, res) => {
  res.status(200).json({
    userId: req.user.userId || req.user.id
  });
});

app.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({
    message: "Access to protected route granted",
    user: req.user
  });
});

module.exports = app;
