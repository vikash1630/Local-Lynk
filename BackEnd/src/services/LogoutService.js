// LOGOUT SERVICE
exports.logout = async (res) => {
  // Clear the JWT cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,     // true in production
    sameSite: "lax"
  });

  return {
    message: "Logout successful"
  };
};
