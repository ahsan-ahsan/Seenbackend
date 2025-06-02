const mongoose = require("mongoose");

const themeSchema = new mongoose.Schema(
  {
    name: String,
    validity:{ type: Number, default: 0 },
    validity_typ:{ type: String,enum: ["day", "month","year"], default: "day" },
    price:{ type: Number, default: 0 },
    theme:String,
    type: { type: Number, enum: [0, 1], default: 0 },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Theme", themeSchema);
