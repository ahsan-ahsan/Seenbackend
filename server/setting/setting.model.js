const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    referralBonus: { type: Number, default: 50 },
    loginBonus: { type: Number, default: 50 },
    agoraKey: { type: String, default: 'AGORA KEY' },
    agoraCertificate: { type: String, default: 'AGORA CERTIFICATE' },
    maxSecondForVideo: { type: Number, default: 30 },
    privacyPolicyLink: { type: String, default: 'PRIVACY POLICY LINK' },
    privacyPolicyText: { type: String, default: 'PRIVACY POLICY TEXT' },
    chatCharge: { type: Number, default: 10 },
    maleCallCharge: { type: Number, default: 10 },
    femaleCallCharge: { type: Number, default: 10 },
    googlePlayEmail: { type: String, default: 'GOOGLE PLAY EMAIL' },
    googlePlayKey: { type: String, default: 'GOOGLE PLAY KEY' },
    googlePlaySwitch: { type: Boolean, default: false },
    stripeSwitch: { type: Boolean, default: false },
    stripePublishableKey: { type: String, default: 'STRIPE PUBLISHABLE KEY' },
    stripeSecretKey: { type: String, default: 'STRIPE SECRET KEY' },
    currency: { type: String, default: '$' },
    rCoinForCashOut: { type: Number, default: 20 },
    rCoinForDiamond: { type: Number, default: 20 },
    isAppActive: { type: Boolean, default: true },
    isFake: { type: Boolean, default: false },
    paymentGateway: { type: Array, default: [] },
    minRcoinForCashOut: { type: Number, default: 200 }, // minimum rCoin for withdraw [redeem]
    freeDiamondForAd: { type: Number, default: 20 },
    maxAdPerDay: { type: Number, default: 3 },
    vipDiamond: { type: Number, default: 20 },
    adminComm: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Setting', settingSchema);
