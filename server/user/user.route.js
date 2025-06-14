const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = require("../../util/multer");

const UserController = require("./user.controller");
const upload = multer({
  storage,
});

const checkAccessWithKey = require("../../checkAccess");

// router.use(checkAccessWithKey());

// get user list
router.get("/getUsers",  UserController.index);

// get popular user by followers
router.get(
  "/getPopularUser",
  checkAccessWithKey(),
  UserController.getPopularUser
);

// get profile of user who login
router.get("/user/profile", UserController.getProfile);

// get random match for call
router.get("/user/random", checkAccessWithKey(), UserController.randomMatch);

// online the user
router.post("/user/online", UserController.userIsOnline);

// search user by name and username
router.post("/user/search", checkAccessWithKey(), UserController.search);

// get user profile of post[feed]
router.post("/getUser",  UserController.getProfileUser);
router.get("/user-history", UserController.purchaseHistory);
//user login and signup
// router.post("/loginSignup", checkAccessWithKey(), UserController.loginSignup);
router.post("/user-login",  UserController.login);

router.post("/user-signup", upload.fields([{ name: 'coverimage' }]), UserController.signup);

// check username is already exist or not
router.post(
  "/checkUsername",
  checkAccessWithKey(),
  UserController.checkUsername
);

// check referral code is valid and add referral bonus
router.post(
  "/addReferralCode",
  checkAccessWithKey(),
  UserController.referralCode
);

// admin add or less the rCoin or diamond of user through admin panel
router.post(
  "/user/addLessCoin",
  checkAccessWithKey(),
  UserController.addLessRcoinDiamond
);


// Update Coin
router.put(
  "/user/updateCoins",
  checkAccessWithKey(),
  UserController.updateCoins
);

// update user detail [android]
router.post(
  "/user/update",
  upload.fields([{ name: "image" }, { name: "coverImage" }]),
  UserController.updateProfile
);

// bock unblock user
router.patch(
  "/blockUnblock/:userId",
  checkAccessWithKey(),
  UserController.blockUnblock
);

//create Fake user by admin
router.post(
  "/AddFakeUser",
  checkAccessWithKey(),
  upload.fields([{ name: "image" }, { name: "link" }]),
  UserController.AddFakeUser
);

//update Fake user by admin
router.patch(
  "/updateFakeUser",
  checkAccessWithKey(),
  upload.fields([{ name: "image" }, { name: "link" }]),
  UserController.updateFakeUser
);

router.patch("/IdGenerate", checkAccessWithKey(), UserController.IdGenerate);

module.exports = router;
