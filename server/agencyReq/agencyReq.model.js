const mongoose = require("mongoose");

const AgencyRequestSchema = new mongoose.Schema(
  {
    agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestType: {
      type: String,
      enum: ["video", "audio"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AgencyRequest", AgencyRequestSchema);