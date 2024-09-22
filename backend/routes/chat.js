const express = require("express");
const {
  accessChat,
  fetchChats,
  removeFromGroup,
  addToGroup,
  renameGroup,
  createGroupChat,
} = require("../controller/chat");

const router = express.Router();
import {protect} from "../middleware/authMiddleware"


//all routess should be protected
router.route("/").post(accessChat);
router.route("/").get(fetchChats);
router.route("/group").post(createGroupChat);

router.route("/grouprename").put(renameGroup);
router.route("/groupremove").put(removeFromGroup);
router.route("/groupadd").put(addToGroup);

module.exports = router;
