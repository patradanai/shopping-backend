const db = require("../models");
const User = db.User;
const Product = db.Product;

exports.createProduct = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const { name, price, isActive, imageSrc } = req.body;

  try {
    // Check User
    const userInstance = await User.findByPk(userId);
    const shopId = await userInstance.getShop().id;
    if (shopId != id) {
      return res
        .status(401)
        .json({ Error: `Unthorization with Shop ID :${id}}` });
    }

    // Create Product
    const productInstance = await Product.create({
      name: name,
      price: price,
      isActive: isActive,
      imageSrc: imageSrc,
    });
    // Update userId and shopId
    await productInstance.setUser(userInstance);
    await productInstance.setShop([shopId]);

    return res.status(200).json({ message: "Create Product Completed" });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const { name, price, isActive, imageSrc } = req.body;

  try {
    // getShopid from User
    const userInstance = await User.findByPk(userId);
    const shopId = await userInstance.getShop().id;

    // Get instance Product
    const ProductInstance = await Product.findByPk(id);
    if (ProductInstance.ShopId != shopId) {
      return res
        .status(401)
        .json({ Error: `Unthorization for SHOP ID ${shopId}` });
    }

    ProductInstance.name = name;
    ProductInstance.price = price;
    ProductInstance.isActive = isActive;
    ProductInstance.imageSrc = imageSrc;

    await ProductInstance.save();

    return res.status(200).json({ message: "Update Product Complete" });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};
