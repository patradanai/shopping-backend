const db = require("../models");
const Category = db.Category;

exports.readCategory = async (req, res) => {
  try {
    const productInstance = await Category.findAll({
      attributes: ["id", "name", "imageSrc"],
    });

    return res.status(200).json({ data: productInstance });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};

exports.categoryById = async (req, res) => {
  const { id } = req.params;
  try {
    //get Category instance
    const categoryInstance = await Category.findByPk(id);

    // getChild Product
    const products = await categoryInstance.getProducts();

    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};
