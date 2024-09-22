const express = require("express");
const { allMessages, sendMessage } = require("../controller/messages");

const router = express.Router();

router.route("/:chatId").get(allMessages);
router.route("/").post(sendMessage);

module.exports = router;
