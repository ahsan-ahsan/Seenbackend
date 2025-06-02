const mongoose = require("mongoose");

const UserThemeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    themeId: { type: mongoose.Schema.Types.ObjectId, ref: "Theme", required: true },
    startDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("UserTheme", UserThemeSchema);