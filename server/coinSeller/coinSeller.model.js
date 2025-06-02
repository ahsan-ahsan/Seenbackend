const mongoose = require("mongoose");

const coinSellerSchema = new mongoose.Schema(
  {
    image: { type: String, default: "" },
    name: { type: String, default: "" },
    unique_id: { type: Number, unique: true, required: true },
    coin: Number,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
coinSellerSchema.index({ isDelete: 1 });

module.exports = mongoose.model("CoinSeller", coinSellerSchema);