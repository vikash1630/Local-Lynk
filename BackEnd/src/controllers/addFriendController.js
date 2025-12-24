
const addFriendService = require("../services/addFriendService");

// ADD FRIEND CONTROLLER

exports.addFriend = async (req, res) => {
    try {
        const userId = req.user.userId; // from JWT
        console.log("User ID from Token:", userId);
        const { friendId } = req.params;
        console.log("Friend ID from Params:", friendId);

        const result = await addFriendService.addFriend(userId, friendId);
        res.status(201).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message
        });
    }
};
