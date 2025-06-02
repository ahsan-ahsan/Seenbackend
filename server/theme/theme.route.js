const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const ThemeController = require("./theme.controller");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const dir = "storage/theme";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    callback(null, dir);
  },
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + "-" + Math.floor(Math.random() * 1000);
    const sanitizedOriginalName = file.originalname.replace(/ /g, "");
    const filename = `${uniqueSuffix}-${sanitizedOriginalName}`;
    callback(null, filename);
  },
});

const fileFilter = (req, file, callback) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    callback(null, true);
  } else {
    callback(new Error("Only image files (jpeg, jpg, png, gif) are allowed!"));
  }
};

const upload = multer({ storage, fileFilter });
const checkAccessWithKey = require("../../checkAccess");

// get all sticker
router.get("/", checkAccessWithKey(), ThemeController.index);

//create sticker
router.post("/", checkAccessWithKey(), upload.single("theme"), ThemeController.store);

// update sticker
router.patch(
  "/:themeId",
  checkAccessWithKey(),
  upload.single("theme"),
  ThemeController.update
);

// delete sticker
router.delete("/:themeId", checkAccessWithKey(), ThemeController.destroy);

module.exports = router;
