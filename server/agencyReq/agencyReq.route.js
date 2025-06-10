const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = require("../../util/multer");

const AgencyReqController = require("./agencyReq.controller");

router.post("/", AgencyReqController.store);

module.exports = router;