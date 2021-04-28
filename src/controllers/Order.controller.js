const db = require("../models");
const User = db.User;
const Order = db.Order;

exports.getOrder = async (req, res) => {
  const userId = req.userId;

  try {
    // Check User
    const userInstance = await User.findByPk(userId);

    const orderInstace = await userInstance.getOrder();

    return res.status(200).json({ data: orderInstace });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};

exports.getOrderByShop = async (req, res) => {};

exports.placeOrder = async (req, res) => {
  const userId = req.userId;
  const { orderStatusId, paymenyId, shippingMethodId } = req.body;

  try {
    // Check User
    const userInstance = await User.findByPk(userId);
    // Get Cart
    const cartInstance = await userInstance.getCart();
    // Products in Cart
    const cartProducts = await cartInstance.getProducts();

    // Find Prepare orderStatus,payment,shippingMethod

    // Create Order
    const orderInstace = await userInstance.createOrder();

    const placeOrder = await orderInstace.addProduct(
      cartProducts.map((product) => {
        product.OrderProduct = { quantity: product.CartProduct.quantity };
        return product;
      })
    );
    if (placeOrder) {
      // Clear Cart
      await cartInstance.setProducts([]);
    }

    // Add Transaction
    await orderInstace.createTransaction({});

    // console.log(
    //   cartProducts.map((product) => {
    //     product.OrderProduct = { quantity: product.CartProduct.quantity };
    //     return product;
    //   })
    // );

    return res.status(200).json({ message: "PlaceOrder Success" });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  const userId = req.userId;

  try {
    // Check User
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};
