const getUsersService = require("../services/UsersListService")

exports.getUsers = async (req, res) => {
  try {
    const { search } = req.query;

    const users = await getUsersService.getUsers(search);

    return res.status(200).json(users);

  } catch (error) {
    console.error("Get Users Error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch users"
    });
  }
};
