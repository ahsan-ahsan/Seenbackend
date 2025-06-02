const express = require("express");
const router = express.Router();

const UserAvatarController = require("./UserAvatar.controller");

router.post("/buy", UserAvatarController.buy);
router.get("/:userId", UserAvatarController.get);

module.exports = router;