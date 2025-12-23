const Chat = require("../models/Chat");
const User = require("../models/User")

const chatSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        /**
         * Join personal room (ONLY userId)
         */
        socket.on("join",async (userId) => {
            if (!userId) return;

            const user = await User.findOne({_id: userId});

            socket.join(userId);
            socket.userId = userId; // bind socket to user
            console.log(`User with id : ${userId} = ${user._id} and name : ${user.name} joined personal room`); 
        });

        /**
         * Send one-to-one message
         */
        socket.on("sendMessage", async (data) => {
            const { from, to, message, messageType = "text", fileUrl } = data;

            // 🔒 Strict one-to-one validation
            if (
                !from ||
                !to ||
                !message ||
                from === to ||
                socket.userId !== from
            ) {
                return;
            }

            // Save message
            const chat = await Chat.create({
                from,
                to,
                message,
                messageType,
                fileUrl
            });

            // Emit to receiver
            io.to(to).emit("receiveMessage", chat);

            // Emit to sender
            io.to(from).emit("receiveMessage", chat)
        });

        socket.on("disconnect", () => {
            console.log(`User ${socket.userId} disconnected`);
        });
    });
};

module.exports = chatSocket;
