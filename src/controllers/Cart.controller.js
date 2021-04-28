const db = require("../models");
const User = db.User;

exports.getCart = async (req, res) => {
  const userId = req.userId;

  try {
    // Check User
    const userInstance = await User.findByPk(userId);

    // Get Cart
    const cartInstance = await userInstance.getCart();

    return res.status(200).json({ data: cartInstance });
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
