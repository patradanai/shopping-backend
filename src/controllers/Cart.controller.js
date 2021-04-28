const db = require("../models");
const User = db.User;
const Product = db.Product;

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

exports.addCart = async (req, res) => {
  const userId = req.userId;
  const { productId } = req.body;
  let quantity = 1;
  try {
    // Check User
    const userInstance = await User.findByPk(userId);

    // Get Cart
    const cartInstance = await userInstance.getCart();

    // Check Product Cart
    const cartProduct = await cartInstance.getProducts({
      where: { id: productId },
    });
    if (cartProduct.length > 0) {
      quantity = cartProduct[0].CartProduct.quantity + 1; // If Found Product in Cart Add more
    }

    const ProductInstance = await Product.findByPk(productId);

    // add ( add new Column ) vs set ( replace seem column )

    await cartInstance.addProducts(ProductInstance, {
      through: { quantity: quantity },
    });

    return res.status(200).json({ message: "Completed Add Product to Cart" });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};

exports.deleteProductCart = async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;

  try {
    // Check User
    const userInstance = await User.findByPk(userId);

    // Get Cart
    const cartInstance = await userInstance.getCart();

    const cartProduct = await cartInstance.getProducts({ where: { id: id } });

    await cartProduct.destroy();

    return res
      .status(200)
      .json({ message: "Completed Delete Product in Cart" });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};
