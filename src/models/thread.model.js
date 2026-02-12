const mongoose = require("mongoose");
const threadSchema = new mongoose.Schema(
    {
        participants: [{
            type: String,
            required: true,
        }],
        lastMessage: String,
        lastMessageTime: Date,
        unreadCount: { type: Number, default: 0 }
    },
    { timestamps: true },
);
module.exports = mongoose.model("Thread", threadSchema);
