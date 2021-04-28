const db = require("../models");

exports.getCart = (req, res) => {
  const userId = req.userId;

  try {
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};

exports.addCart = (req, res) => {
  const userId = req.userId;

  try {
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};

exports.deleteProductCart = (req, res) => {
  const userId = req.userId;

  try {
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};
