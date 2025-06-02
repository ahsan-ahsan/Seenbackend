const PrivacyText = require('./privacy.model'); // adjust path

exports.index = async (req, res) => {
  try {
    const texts = await PrivacyText.find().sort({ updatedAt: -1 });
    return res.status(200).json({
      status: true,
      message: "Privacy texts fetched successfully",
      privacyTexts: texts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

exports.store = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ status: false, message: "Content is required" });
    }

    const privacyText = new PrivacyText({ content });
    await privacyText.save();

    return res.status(201).json({ status: true, message: "Privacy text created", privacyText });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};


exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ status: false, message: "Content is required" });
    }

    const updated = await PrivacyText.findByIdAndUpdate(
      id,
      { content, updatedAt: Date.now() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ status: false, message: "Privacy text not found" });
    }

    return res.status(200).json({ status: true, message: "Privacy text updated", privacyText: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};


exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await PrivacyText.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ status: false, message: "Privacy text not found" });
    }

    return res.status(200).json({ status: true, message: "Privacy text deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};
