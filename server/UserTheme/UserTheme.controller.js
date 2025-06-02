const config = require("../../config");
const themeModel = require("../theme/theme.model");
const userModel = require("../user/user.model");
const UserThemeModel = require("./UserTheme.model");

exports.buy = async (req, res) => {
try {
    const { userId, themeId } = req.body;

    if (!userId || !themeId) {
      return res.status(400).json({ status: false, message: "Missing userId or themeId" });
    }

    const theme = await themeModel.findById(themeId);
    if (!theme) {
      return res.status(404).json({ status: false, message: "Theme not found" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    if (user.diamond < theme.price) {
      return res.status(400).json({ status: false, message: "Not enough diamonds" });
    }

    // Calculate expiry date
    const startDate = new Date();
    const expiryDate = new Date(startDate);

    switch (theme.validity_typ) {
      case "day":
        expiryDate.setDate(expiryDate.getDate() + theme.validity);
        break;
      case "month":
        expiryDate.setMonth(expiryDate.getMonth() + theme.validity);
        break;
      case "year":
        expiryDate.setFullYear(expiryDate.getFullYear() + theme.validity);
        break;
    }

    // Deduct diamonds
    user.diamond -= theme.price;
    await user.save();

    const UserTheme = await UserThemeModel.create({
      userId,
      themeId,
      startDate,
      expiryDate,
    });

    return res.status(200).json({ status: true, message: "Purchase successful", data: UserTheme });
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

    const userEntries = await UserThemeModel.find({
    userId,
    expiryDate: { $gte: new Date() }
    })
    .populate("themeId")
    .lean()
    .sort({ expiryDate: 1 });
const fixeduserEntries = userEntries.map((item) => {
  const theme = item.themeId || {};

  return {
    _id: item._id,
    userId: item.userId,
    createdAt: item.createdAt,
    name: theme.name,
    validity: theme.validity,
    validity_typ: theme.validity_typ,
    price: theme.price,
    theme: config.baseURL + (theme.theme || '').replace(/\\/g, '/'),
  };
});

    return res.status(200).json({
      status: true,
      message: "Fetched user Theme",
      data: fixeduserEntries,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: error.message || "Server error" });
  }
};