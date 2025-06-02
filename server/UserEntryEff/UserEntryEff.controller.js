const config = require("../../config");
const EntryEff = require("../entryEff/entryEff.model");
const userModel = require("../user/user.model");
const UserEntryEff = require("./UserEntryEff.model");
const mongoose = require("mongoose");

exports.buy = async (req, res) => {
try {
    const { userId, entryEffId } = req.body;

    if (!userId || !entryEffId) {
      return res.status(400).json({ status: false, message: "Missing userId or entryEffId" });
    }

    const entryEff = await EntryEff.findById(entryEffId);
    if (!entryEff) {
      return res.status(404).json({ status: false, message: "EntryEff not found" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    if (user.diamond < entryEff.price) {
      return res.status(400).json({ status: false, message: "Not enough diamonds" });
    }

    // Calculate expiry date
    const startDate = new Date();
    const expiryDate = new Date(startDate);

    switch (entryEff.validity_typ) {
      case "day":
        expiryDate.setDate(expiryDate.getDate() + entryEff.validity);
        break;
      case "month":
        expiryDate.setMonth(expiryDate.getMonth() + entryEff.validity);
        break;
      case "year":
        expiryDate.setFullYear(expiryDate.getFullYear() + entryEff.validity);
        break;
    }

    // Deduct diamonds
    user.diamond -= entryEff.price;
    await user.save();

    const userEntryEff = await UserEntryEff.create({
      userId,
      entryEffId,
      startDate,
      expiryDate,
    });

    return res.status(200).json({ status: true, message: "Purchase successful", data: userEntryEff });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: error.message || "Server error" });
  }
};

exports.get = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ status: false, message: "Missing userId" });
    }

    const userEntries = await UserEntryEff.find({
    userId,
    expiryDate: { $gte: new Date() }
    })
    .populate("entryEffId")
    .lean() // returns plain JS objects instead of Mongoose documents
    .sort({ expiryDate: 1 });
const fixeduserEntries = userEntries.map((item) => {
  const eff = item.entryEffId || {};

  return {
    _id: item._id,
    userId: item.userId,
    createdAt: item.createdAt,
    name: eff.name,
    validity: eff.validity,
    validity_typ: eff.validity_typ,
    price: eff.price,
    entryEff: config.baseURL + (eff.entryEff || '').replace(/\\/g, '/'),
  };
});

    return res.status(200).json({
      status: true,
      message: "Fetched user EntryEffs",
      data: fixeduserEntries,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: error.message || "Server error" });
  }
};