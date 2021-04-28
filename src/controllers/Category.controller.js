const db = require("../models");
const Category = db.Category;

exports.readCategory = async (req, res) => {
  try {
    const productInstance = await Category.findAll({
      attributes: ["id", "name"],
    });

    return res.status(200).json({ data: productInstance });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};
