const config = require('../../config');
const userModel = require('../user/user.model');
const CoinSeller = require('./coinSeller.model');

exports.index = async (req, res) => {
  try {
    const coinSellers = await CoinSeller.find({});

    if (!coinSellers || coinSellers.length === 0) {
      return res.status(200).json({ status: false, message: 'No data found!' });
    }

    // Enrich and normalize
    const enrichedCoinSellers = await Promise.all(
      coinSellers.map(async (seller) => {
        const user = await userModel.findOne({ uniqueId: seller.unique_id }).select('name email rCoin uniqueId spentCoin isOnline');

        // Normalize image path slashes if exists
        let imagePath = seller.image ? seller.image.replace(/\\/g, '/') : null;

        return {
          ...seller.toObject(),
          image: imagePath,
          userDetails: user || null,
        };
      })
    );

    return res.status(200).json({
      status: true,
      message: 'Success!!',
      coinSellers: enrichedCoinSellers,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || 'Server Error' });
  }
};


exports.edit = async (req, res) => {
  try {
    const { unique_id } = req.params;

    if (!unique_id) {
      return res.status(200).json({ status: false, message: 'Unique ID is required!' });
    }

    const coinSeller = await CoinSeller.findOne({ unique_id });

    if (!coinSeller) {
      return res.status(404).json({ status: false, message: 'CoinSeller not found!' });
    }
    if (coinSeller.image) {
      coinSeller.image = coinSeller.image.replace(/\\/g, '/');
    }

    return res.status(200).json({
      status: true,
      message: 'CoinSeller fetched successfully',
      coinSeller,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || 'Server Error' });
  }
};


exports.store = async (req, res) => {
  try {
    const { unique_id, coin, name } = req.body;

    if (!unique_id || !coin) {
      return res
        .status(200)
        .json({ status: false, message: 'Invalid Details!' });
    }

    let imagePath = null;
    if (req.files?.image && req.files.image.length > 0) {
      imagePath = config.baseURL + req.files.image[0].path;
    }

    // Find if CoinSeller already exists
    let coinSeller = await CoinSeller.findOne({ unique_id });

    if (coinSeller) {
      if (imagePath) coinSeller.image = imagePath;
      coinSeller.coin = coin;
      if (name) coinSeller.name = name;
      await coinSeller.save();
    } else {
      coinSeller = new CoinSeller({
        unique_id,
        coin,
        name,
        image: imagePath
      });
      await coinSeller.save();
    }

    const updatedUser = await userModel.findOneAndUpdate(
      { uniqueId: unique_id },
      { $inc: { rCoin: Number(coin) } },
      { new: true }
    );

    return res.status(200).json({
      status: true,
      message: 'Success!',
      coinSeller
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || 'Server Error'
    });
  }
};


exports.update = async (req, res) => {
  try {
    const { unique_id, coin, name } = req.body;

    if (!unique_id) {
      return res.status(200).json({ status: false, message: 'Unique ID is required!' });
    }

    let coinSeller = await CoinSeller.findOne({ unique_id });

    if (!coinSeller) {
      return res.status(404).json({ status: false, message: 'CoinSeller not found!' });
    }

    let imagePath = null;
    if (req.files?.image && req.files.image.length > 0) {
      imagePath = config.baseURL + req.files.image[0].path;
      coinSeller.image = imagePath;
    }

    if (coin) coinSeller.coin = coin;
    if (name) coinSeller.name = name;

    await coinSeller.save();

    return res.status(200).json({
      status: true,
      message: 'CoinSeller updated successfully',
      coinSeller,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || 'Server Error' });
  }
};


exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const coinSeller = await CoinSeller.findByIdAndDelete(id);

    if (!coinSeller) {
      return res
        .status(404)
        .json({ status: false, message: 'CoinSeller not found!' });
    }

    return res
      .status(200)
      .json({ status: true, message: 'CoinSeller deleted successfully!' });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || 'Server Error' });
  }
};
