const db = require("../models");
const { subTotal } = require("../utils/__helper__");
const User = db.User;
const Product = db.Product;

exports.getCart = async (req, res) => {
  const userId = req.userId;

  try {
    // Check User
    const userInstance = await User.findByPk(userId);

    // Get Cart
    const cartInstance = await userInstance.getCart({
      include: [
        {
          model: db.Product,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: {
            model: db.Category,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        },
      ],
    });

    return res.status(200).json({ data: cartInstance });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};

exports.addCart = async (req, res) => {
  const userId = req.userId;
  const { productId, quantity } = req.body;
  let newQuantity;
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
      newQuantity = cartProduct[0].CartProduct.quantity + quantity; // If Found Product in Cart Add more

      // if Q'ty = 0 destroy
      if (newQuantity <= 0) {
        await cartProduct[0].destroy();
        return res
          .status(200)
          .json({ message: "Alreay delted product in cart" });
      }
    }

    const ProductInstance = await Product.findByPk(productId);

    // add ( add new Column ) vs set ( replace seem column )

    await cartInstance.addProducts(ProductInstance, {
      through: { quantity: newQuantity },
    });

    const allProduct = await cartInstance.getProducts();

    // Update subtotal
    cartInstance.subTotal = subTotal(allProduct);
    await cartInstance.save();

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

    const allProduct = await cartInstance.getProducts();

    // Update subtotal
    cartInstance.subTotal = subTotal(allProduct);
    await cartInstance.save();

    return res
      .status(200)
      .json({ message: "Completed Delete Product in Cart" });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};
