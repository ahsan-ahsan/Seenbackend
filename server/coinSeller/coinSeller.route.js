const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = require("../../util/multer");
const CoinSellerController = require("./coinSeller.controller");
const upload = multer({
  storage,
});
const checkAccessWithKey = require("../../checkAccess");

// router.use(checkAccessWithKey());

// get coin plans
router.get("/",  CoinSellerController.index);
router.get("/:unique_id",  CoinSellerController.edit);

// get purchase plan history
// router.get("/history", checkAccessWithKey(), CoinSellerController.purchaseHistory);

//create coin plan
router.post("/", upload.fields([{ name: "image" }]), CoinSellerController.store);
router.put('/:id', upload.fields([{ name: "image" }]), CoinSellerController.update);
router.delete('/:id', CoinSellerController.delete);


module.exports = router;