// LOGOUT SERVICE
exports.logout = async (res) => {
  // Clear the JWT cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,          // ✅ REQUIRED in production (HTTPS only)
    sameSite: "none",      // ✅ Required if frontend & backend are on different domains
    path: "/",             // ✅ Must match cookie creation
  });

  return {
    message: "Logout successful"
  };
};
