const express = require("express");
const router = express.Router();

const UserEntryEffController = require("./UserEntryEff.controller");

const checkAccessWithKey = require("../../checkAccess");

router.post("/buy", UserEntryEffController.buy);
router.get("/:userId", UserEntryEffController.get);

module.exports = router;