const db = require("../models");
const User = db.User;
const Product = db.Product;
exports.getWishList = async (req, res) => {
  const userId = req.userId;

  try {
    // getUser Instance
    const userInstance = await User.findByPk(userId);

    // getWish Instance
    const wishInstance = await userInstance.getWish();

    // getWishProducts
    const wishProducts = await wishInstance.getProducts();

    return res.status(200).json(wishInstance);
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};

exports.addWishList = async (req, res) => {
  const userId = req.userId;
  const { productId } = req.params;

  try {
    // getUser Instance
    const userInstance = await User.findByPk(userId);

    // getWish Instance
    const wishInstance = await userInstance.getWish();

    // GetProduct Instance by ProductId
    const productInstane = await Product.findByPk(productId);

    await wishInstance.addProduct(productInstane);

    return res.status(200).json({ message: "Completed Add Wishlist" });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};

exports.deleteWishList = async (req, res) => {
  const userId = req.userId;
  const { productId } = req.params;

  try {
    // getUser Instance
    const userInstance = await User.findByPk(userId);

    // getWish Instance
    const wishInstance = await userInstance.getWish();

    // GetProduct Instance by ProductId
    const productInstane = await Product.findByPk(productId);

    await wishInstance.removeProduct(productInstane);

    return res.status(200).json({ message: "Completed deleted Wishlist" });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};
