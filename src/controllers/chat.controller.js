const Chat = require("../models/chat.model");
const Thread = require("../models/thread.model");
const asyncHandler = require("../middleware/asyncHandler");
const { getIO, onlineUsers } = require("../socket/socket");

// Send Messages
exports.sendMessage = asyncHandler(async (req, res, next) => {
    const { sender, receiver, message } = req.body;

    if (!sender || !receiver || !message)
        return res.status(400).json({ message: "Missing fields" });

    // find or create thread
    let thread = await Thread.findOne({
        participants: { $all: [sender, receiver] }
    });


    if (!thread) {
        thread = await Thread.create({
            participants: [sender, receiver]
        });
    }

    // creating chat
    const chat = await Chat.create({
        sender,
        receiver,
        message,
        thread: thread._id
    });

    // update thread
    thread.lastMessage = message;
    thread.lastMessageTime = new Date();
    await thread.save();

    // realtime emit
    const receiverSocket = onlineUsers.get(receiver);
    if (receiverSocket) {
        getIO().to(receiverSocket).emit("new_messages", chat);
    }
    res.status(201).json(chat);
});

// Get messages by thread ID
exports.getMessages = asyncHandler(async (req, res) => {
    const { threadID } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const messages = await Chat.find({ thread: threadID })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    res.json(messages);
});

// Get thread + messages between two users
exports.getThread = asyncHandler(async (req, res) => {
    const { senderId, receiverId } = req.params;

    const thread = await Thread.findOne({
        participants: { $all: [senderId, receiverId] }
    });

    if (!thread) {
        return res.json({ thread: null, messages: [] });
    }

    const messages = await Chat.find({ thread: thread._id })
        .sort({ createdAt: 1 });

    res.json({ thread, messages });
});
