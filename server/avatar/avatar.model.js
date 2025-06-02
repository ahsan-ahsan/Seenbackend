const mongoose = require("mongoose");

const avatarSchema = new mongoose.Schema(
  {
    name: String,
    validity:{ type: Number, default: 0 },
    validity_typ:{ type: String,enum: ["day", "month","year"], default: "day" },
    price:{ type: Number, default: 0 },
    avatar:String,
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Avatar", avatarSchema);
