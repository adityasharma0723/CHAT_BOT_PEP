const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");

router.post("/send", chatController.sendMessage);
router.get("/:threadID", chatController.getMessages);

module.exports = router;
