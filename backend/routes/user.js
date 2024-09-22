const express = require("express");
const { register, authUser, allUsers } = require("../controller/user");
import {protect} from "../middleware/authMiddleware"

const router = express.Router();

router.route("/").get(protect,allUsers);
router.route("/").post(register);
router.route("/login").post(authUser);


module.exports = router;
