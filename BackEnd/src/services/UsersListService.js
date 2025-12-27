const User = require("../models/User");

exports.getUsers = async (search) => {
  let query = {};

  if (search && search.trim()) {
    query.$or = [
      {
        name: {
          $regex: search,
          $options: "i"
        }
      },
      {
        email: {
          $regex: search,
          $options: "i"
        }
      }
    ];
  }

  const users = await User.find(query)
    .select("name email age")
    .limit(5)
    .sort({ createdAt: -1 });

  return users;
};
