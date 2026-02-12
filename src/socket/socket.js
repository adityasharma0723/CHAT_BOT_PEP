const { Server } = require("socket.io");
let io;
const onlineUsers = new Map();
function initSocket(httpServer) {
    io = new Server(httpServer, { cors: { origin: "*" } });
    io.on("connection", (socket) => {
        console.log("user connected", socket.id);
        socket.on("user:online", (userId) => {
            onlineUsers.set(userId, socket.id);
        });
        socket.on("disconnect", () => {
            for (const [key, value] of onlineUsers.entries()) {
                if (value === socket.id) {
                    onlineUsers.delete(key);
                    break;
                }
            }
        });
    });
}
function getIO() {
    return io;
}
module.exports = {
    initSocket,
    getIO,
    onlineUsers,
}