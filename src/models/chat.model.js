const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
    {
        sender: {
            type: String,
            required: true,
        },
        receiver: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true
        },
        thread: {
            type: String,
        },
        isRead: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true },
);
module.exports = mongoose.model("Chat", chatSchema);