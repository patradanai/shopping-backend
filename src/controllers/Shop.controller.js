const db = require("../models");
const Shop = db.Shop;

exports.shopUpdate = async (req, res) => {
  const { id } = req.params;
  const { isActiveShop, name } = req.body;
  const userId = req.userId;

  try {
    const shopInstance = await Shop.findByPk(id);
    // Check owner
    if (shopInstance.ownerId != userId) {
      return res.status(401).json({ Error: "This is not you belong." });
    }

    // Update Shop
    shopInstance.name = name;
    shopInstance.isActive = isActiveShop;

    await shopInstance.save();
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }

  return res.status(200).json({ message: "Update Success" });
};

exports.shopCreateShipping = async (req, res) => {
  const { id } = req.params;
  const { shippingMethod } = req.body;
  const userId = req.userId;

  try {
    const shopInstance = await Shop.findByPk(id);
    //Check OwnerId
    if (shopInstance.ownerId != userId) {
      return res.status(401).json({ Error: "This is not you belong." });
    }

    await shopInstance.createShippingMethod({ name: shippingMethod });

    return res.status(200).json({ message: "Create ShippingMethod Success" });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};
