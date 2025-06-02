const config = require('../../config');
const { baseURL } = require('../../config');

const { deleteFiles, deleteFile } = require('../../util/deleteFile');
const EntryEff = require('./entryEff.model');
const fs = require('fs');

// get EntryEff list
exports.index = async (req, res) => {
  try {
    const entryEff = await EntryEff.aggregate([
      { $match: { _id: { $ne: null } } },
      {
        $project: {
          entryEff: 1,
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
    const fixedentryEff = entryEff.map((item) => ({
          ...item,
          entryEff: config.baseURL + item.entryEff?.replace(/\\/g, '/'),
        }));

    if (!entryEff)
      return res.status(200).json({ status: false, message: 'No data found!' });

    return res.status(200).json({ status: true, message: 'Success!!', fixedentryEff });
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

    const entryEffToInsert = {
      name,
      validity,
      price: price || 0, // default to 0 if not provided
      entryEff: file.path,
      validity_typ,
    };

    const entryEff = await EntryEff.create(entryEffToInsert);
    return res.status(200).json({ status: true, message: 'Success!', entryEff });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: error.message || 'Server Error' });
  }
};



// update EntryEff
exports.update = async (req, res) => {
  try {
    const entryEff = await EntryEff.findById(req.params.entryEffId);

    if (!entryEff) {
      if (req.file) deleteFile(req.file);
      return res.status(404).json({ status: false, message: 'entryEff does not exist!' });
    }

    // Update fields from req.body (add parsing if necessary)
    if (req.body.name !== undefined) entryEff.name = req.body.name;
    if (req.body.validity !== undefined) entryEff.validity = req.body.validity;
    if (req.body.price !== undefined) entryEff.price = parseFloat(req.body.price);
    if (req.body.validity_typ !== undefined) entryEff.validity_typ = req.body.validity_typ;

    
    if (req.file) {
      if (entryEff.entryEff && fs.existsSync(entryEff.entryEff)) {
        fs.unlinkSync(entryEff.entryEff);
      }
      entryEff.entryEff = req.file.path;
    }

    await entryEff.save();

    return res.status(200).json({ status: true, message: 'Success!', entryEff });
  } catch (error) {
    if (req.file) deleteFile(req.file);
    return res.status(500).json({ status: false, error: error.message || 'Server Error' });
  }
};

// delete EntryEff
exports.destroy = async (req, res) => {
  try {
    const entryEff = await EntryEff.findById(req.params.entryEffId);

    if (!entryEff)
      return res
        .status(200)
        .json({ status: false, message: 'entryEff does not Exist!' });

    if (fs.existsSync(entryEff.entryEff)) {
      fs.unlinkSync(entryEff.entryEff);
    }

    await entryEff.deleteOne();

    return res.status(200).json({ status: true, message: 'Success!' });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || 'Server Error' });
  }
};