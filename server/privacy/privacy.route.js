const express = require("express");
const router = express.Router();
const PrivacyController = require("./privacy.controller");

const checkAccessWithKey = require("../../checkAccess");

router.get("/", PrivacyController.index);
router.post("/", checkAccessWithKey(), PrivacyController.store);

router.patch(
  "/:id",
  checkAccessWithKey(),
  PrivacyController.update
);

router.delete("/:id", checkAccessWithKey(), PrivacyController.delete);

module.exports = router;