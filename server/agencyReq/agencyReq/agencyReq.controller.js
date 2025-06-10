const AgencyRequest = require("./agencyReq.model.js");
const agencyModel = require("../agency/agency.model");
const userModel = require("../user/user.model");

exports.store = async (req, res) => {
  try {
    const { agencyId, userId, requestType } = req.body;

    if (!agencyId || !userId || !requestType) {
      return res
        .status(400)
        .json({ status: false, message: "All fields are required." });
    }

    const agency = await agencyModel.findById(agencyId);
    if (!agency) {
      return res
        .status(404)
        .json({ status: false, message: "Agency not found." });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found." });
    }

    const request = await AgencyRequest.create({
      agency: agencyId,
      user: userId,
      requestType,
    });

    return res.status(200).json({
      status: true,
      message: "Request sent successfully.",
      request,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};