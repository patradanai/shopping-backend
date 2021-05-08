const db = require("../models");
const ShippingMethod = db.ShippingMethod;

exports.getShipping = async (req, res) => {
  try {
    const shippingInstance = await ShippingMethod.findAll();

    return res.status(200).json(shippingInstance);
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};
