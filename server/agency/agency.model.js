const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

function generateUniqueId(length = 5) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}



const agencySchema = new mongoose.Schema(
  {
    uniqId: {
      type: String,
      default: () => generateUniqueId(),
      unique: true,
    },
    image: String,
    agencyName: String,
    agencyTagLine: String,
    agencyOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Agency", agencySchema);
