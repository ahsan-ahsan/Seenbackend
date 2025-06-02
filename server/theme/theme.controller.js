const config = require('../../config');
const { baseURL } = require('../../config');

const { deleteFiles, deleteFile } = require('../../util/deleteFile');
const Theme = require('./theme.model');
const fs = require('fs');

// get theme list
exports.index = async (req, res) => {
  try {
    const theme = await Theme.aggregate([
      { $match: { _id: { $ne: null } } },
      {
        $project: {
          theme: 1,
          createdAt: 1,
          updatedAt: 1,
          type: 1,
          name: 1,
          validity: 1,
          validity_typ:1, 
          price: 1
        },
      },
    ]).sort({ createdAt: -1 });
    const fixedThemes = theme.map((item) => ({
          ...item,
          theme: config.baseURL + item.theme?.replace(/\\/g, '/'),
        }));

    if (!theme)
      return res.status(200).json({ status: false, message: 'No data found!' });

    return res.status(200).json({ status: true, message: 'Success!!', fixedThemes });
  } catch (error) {
    // console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || 'Server Error' });
  }
};


// store multiple theme
exports.store = async (req, res) => {
  try {
    const { name, validity, price, type,validity_typ } = req.body;
    const file = req.file;

    if (!file || !name) {
      return res.status(400).json({ status: false, message: 'Invalid input!' });
    }

    // Check if price is required when type is not 0
    if (parseInt(type) !== 0 && (price === undefined || price === '')) {
      return res.status(400).json({ status: false, message: 'Price is required when type is not 0.' });
    }

    const themeToInsert = {
      name,
      validity,
      validity_typ,
      price: price || 0, // default to 0 if not provided
      theme: file.path,
      type,
    };

    const theme = await Theme.create(themeToInsert);
    return res.status(200).json({ status: true, message: 'Success!', theme });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: error.message || 'Server Error' });
  }
};



// update theme
exports.update = async (req, res) => {
  try {
    const theme = await Theme.findById(req.params.themeId);

    if (!theme) {
      if (req.file) deleteFile(req.file);
      return res.status(404).json({ status: false, message: 'Theme does not exist!' });
    }

    // Update fields from req.body (add parsing if necessary)
    if (req.body.name !== undefined) theme.name = req.body.name;
    if (req.body.validity !== undefined) theme.validity = req.body.validity;
    if (req.body.validity_typ !== undefined) theme.validity_typ = req.body.validity_typ;
    if (req.body.price !== undefined) theme.price = parseFloat(req.body.price);
    if (req.body.type !== undefined) theme.type = parseInt(req.body.type);

    // If new file uploaded, replace old image file
    if (req.file) {
      // Delete old image file if exists
      if (theme.theme && fs.existsSync(theme.theme)) {
        fs.unlinkSync(theme.theme);
      }
      theme.theme = req.file.path;
    }

    await theme.save();

    return res.status(200).json({ status: true, message: 'Success!', theme });
  } catch (error) {
    console.error(error);
    if (req.file) deleteFile(req.file);
    return res.status(500).json({ status: false, error: error.message || 'Server Error' });
  }
};

// delete theme
exports.destroy = async (req, res) => {
  try {
    const theme = await Theme.findById(req.params.themeId);

    if (!theme)
      return res
        .status(200)
        .json({ status: false, message: 'theme does not Exist!' });

    if (fs.existsSync(theme.theme)) {
      fs.unlinkSync(theme.theme);
    }

    await theme.deleteOne();

    return res.status(200).json({ status: true, message: 'Success!' });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || 'Server Error' });
  }
};
