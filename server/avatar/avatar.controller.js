const config = require('../../config');
const { baseURL } = require('../../config');

const { deleteFiles, deleteFile } = require('../../util/deleteFile');
const Avatar = require('./avatar.model');
const fs = require('fs');

// get avatar list
exports.index = async (req, res) => {
  try {
    const avatar = await Avatar.aggregate([
      { $match: { _id: { $ne: null } } },
      {
        $project: {
          avatar: 1,
          createdAt: 1,
          updatedAt: 1,
          type: 1,
          name: 1,
          validity_typ:1,
          validity: 1, 
          price: 1
        },
      },
    ]).sort({ createdAt: -1 });
    const fixedAvatars = avatar.map((item) => ({
          ...item,
          avatar: config.baseURL + item.avatar?.replace(/\\/g, '/'),
        }));

    if (!avatar)
      return res.status(200).json({ status: false, message: 'No data found!' });

    return res.status(200).json({ status: true, message: 'Success!!', fixedAvatars });
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
    const { name, validity, price, validity_typ } = req.body;
    const file = req.file;

    if (!file || !name) {
      return res.status(400).json({ status: false, message: 'Invalid input!' });
    }

    const avatarToInsert = {
      name,
      validity,
      price: price || 0, // default to 0 if not provided
      avatar: file.path,
      validity_typ,
    };

    const avatar = await Avatar.create(avatarToInsert);
    return res.status(200).json({ status: true, message: 'Success!', avatar });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: error.message || 'Server Error' });
  }
};



// update avatar
exports.update = async (req, res) => {
  try {
    const avatar = await Avatar.findById(req.params.avatarId);

    if (!avatar) {
      if (req.file) deleteFile(req.file);
      return res.status(404).json({ status: false, message: 'Avatar does not exist!' });
    }

    // Update fields from req.body (add parsing if necessary)
    if (req.body.name !== undefined) avatar.name = req.body.name;
    if (req.body.validity !== undefined) avatar.validity = req.body.validity;
    if (req.body.price !== undefined) avatar.price = parseFloat(req.body.price);
    if (req.body.validity_typ !== undefined) avatar.validity_typ = req.body.validity_typ;

    
    if (req.file) {
      if (avatar.avatar && fs.existsSync(avatar.avatar)) {
        fs.unlinkSync(avatar.avatar);
      }
      avatar.avatar = req.file.path;
    }

    await avatar.save();

    return res.status(200).json({ status: true, message: 'Success!', avatar });
  } catch (error) {
    if (req.file) deleteFile(req.file);
    return res.status(500).json({ status: false, error: error.message || 'Server Error' });
  }
};

// delete avatar
exports.destroy = async (req, res) => {
  try {
    const avatar = await Avatar.findById(req.params.avatarId);

    if (!avatar)
      return res
        .status(200)
        .json({ status: false, message: 'avatar does not Exist!' });

    if (fs.existsSync(avatar.avatar)) {
      fs.unlinkSync(avatar.avatar);
    }

    await avatar.deleteOne();

    return res.status(200).json({ status: true, message: 'Success!' });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || 'Server Error' });
  }
};