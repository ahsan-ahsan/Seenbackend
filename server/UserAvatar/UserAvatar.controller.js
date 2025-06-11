const config = require("../../config");
const avatarModel = require("../avatar/avatar.model");
const userModel = require("../user/user.model");
const UserAvatarModel = require("./UserAvatar.model");

exports.buy = async (req, res) => {
try {
    const { userId, avatarId } = req.body;

    if (!userId || !avatarId) {
      return res.status(400).json({ status: false, message: "Missing userId or avatarId" });
    }

    const avatar = await avatarModel.findById(avatarId);
    if (!avatar) {
      return res.status(404).json({ status: false, message: "Avatar not found" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    if (user.diamond < avatar.price) {
      return res.status(400).json({ status: false, message: "Not enough diamonds" });
    }

    // Calculate expiry date
    const startDate = new Date();
    const expiryDate = new Date(startDate);

    switch (avatar.validity_typ) {
      case "day":
        expiryDate.setDate(expiryDate.getDate() + avatar.validity);
        break;
      case "month":
        expiryDate.setMonth(expiryDate.getMonth() + avatar.validity);
        break;
      case "year":
        expiryDate.setFullYear(expiryDate.getFullYear() + avatar.validity);
        break;
    }

    // Deduct diamonds
    user.diamond -= avatar.price;
     user.spentDiamond= user.spentDiamond + avatar.price;
    await user.save();

    const UserAvatar = await UserAvatarModel.create({
      userId,
      avatarId,
      startDate,
      expiryDate,
    });

    return res.status(200).json({ status: true, message: "Purchase successful", data: UserAvatar });
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

    const userEntries = await UserAvatarModel.find({
    userId,
    expiryDate: { $gte: new Date() }
    })
    .populate("avatarId")
    .lean()
    .sort({ expiryDate: 1 });
    const fixeduserEntries = userEntries.map((item) => {
    const avatar = item.avatarId || {};

  return {
    _id: item._id,
    userId: item.userId,
    createdAt: item.createdAt,
    name: avatar.name,
    validity: avatar.validity,
    validity_typ: avatar.validity_typ,
    price: avatar.price,
    avatar: config.baseURL + (avatar.avatar || '').replace(/\\/g, '/'),
  };
});

    return res.status(200).json({
      status: true,
      message: "Fetched user Avatar",
      data: fixeduserEntries,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: error.message || "Server error" });
  }
};