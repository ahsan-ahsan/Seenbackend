const mongoose = require('mongoose');

const privacyTextSchema = new mongoose.Schema({
  content: { type: String, required: true },
},
{ timestamps: true, versionKey: false });

const PrivacyText = mongoose.model('PrivacyText', privacyTextSchema);

module.exports = PrivacyText;