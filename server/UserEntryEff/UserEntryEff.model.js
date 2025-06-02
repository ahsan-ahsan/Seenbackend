const mongoose = require("mongoose");

const UserEntryEffSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    entryEffId: { type: mongoose.Schema.Types.ObjectId, ref: "entryeff", required: true },
    startDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("UserEntryEff", UserEntryEffSchema);