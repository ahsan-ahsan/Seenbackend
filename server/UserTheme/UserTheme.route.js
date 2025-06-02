const express = require("express");
const router = express.Router();

const UserThemeController = require("./UserTheme.controller");

router.post("/buy", UserThemeController.buy);
router.get("/:userId", UserThemeController.get);

module.exports = router;