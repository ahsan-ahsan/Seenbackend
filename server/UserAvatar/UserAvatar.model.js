const mongoose = require("mongoose");

const UserAvatarSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    avatarId: { type: mongoose.Schema.Types.ObjectId, ref: "Avatar", required: true },
    startDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("UserAvatar", UserAvatarSchema);