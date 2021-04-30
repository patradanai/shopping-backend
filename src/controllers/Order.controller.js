const Sequelize = require("sequelize");
const db = require("../models");
const User = db.User;
const Order = db.Order;
const StockTransactionType = db.StockTransactionType;

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

  if (!orderStatusId || !paymenyId & !shippingMethodId) {
    return res.status(400).json({ Error: "Invalid Id" });
  }

  try {
    // Check User
    const userInstance = await User.findByPk(userId);
    // Get Cart
    const cartInstance = await userInstance.getCart();
    // Products in Cart
    // const cartProducts = await cartInstance.getProducts();

    const cartProductGroup = await cartInstance.getProducts({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("ShopId")), "ShopId"],
      ],
      group: "ShopId",
    });

    cartProductGroup.map(async (product) => {
      // Create Order
      userInstance
        .createOrder({
          // orderStatusId: orderStatusId,
          // PaymentId: paymenyId,
          // ShippingMethodId: shippingMethodId,
          ShopId: product.ShopId,
        })
        .then((order) => {
          // Filter Prodoucy by ShopId
          cartInstance
            .getProducts({
              where: { ShopId: product.ShopId },
            })
            .then((products) => {
              // order -> addProduct
              order
                .addProduct(
                  products.map((product) => {
                    product.OrderProduct = {
                      quantity: product.CartProduct.quantity,
                    };
                    return product;
                  })
                )
                .then(() => {})
                .catch((err) => console.log(err));

              // Product -> createStockTransaction
              products.map((product) => {
                product
                  .getStock()
                  .then((stock) => {
                    return stock.createStockTransaction({
                      quantity: product.CartProduct.quantity,
                    });
                  })
                  .then((stockTransaction) => {
                    StockTransactionType.findOne({
                      where: { name: "StockOut" },
                    }).then((type) => {
                      stockTransaction.setStockTransactionType(type);
                    });
                  })
                  .catch((err) => console.log(err));
              });
            })
            .catch((err) => console.log(err));

          // Order --> createTransaction
          order
            .createTransaction()
            .then((transac) => {
              // Set userId in Transaction
              transac
                .set(userInstance)
                .then(() => {})
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        })
        .then(async () => {
          // Clear Cart
          cartInstance.subTotal = 0;
          await cartInstance.save();
          await cartInstance.setProducts([]);
        })
        .catch((err) => console.log(err));
    });

    // Find Prepare orderStatus,payment,shippingMethod

    // Create Order
    // const orderInstace = await userInstance.createOrder({
    //   OrderStatusId: orderStatusId,
    //   ShippingMethodId: shippingMethodId,
    //   PaymentId: paymenyId,
    //   ShopId: 1,
    // });

    // const placeOrder = await orderInstace.addProduct(
    //   cartProducts.map((product) => {
    //     product.OrderProduct = { quantity: product.CartProduct.quantity };
    //     return product;
    //   })
    // );
    // if (placeOrder) {
    //   // Clear Cart
    //   await cartInstance.setProducts([]);
    // }

    // Add Transaction
    // await orderInstace.createTransaction({});

    // console.log(
    //   cartProducts.map((product) => {
    //     product.OrderProduct = { quantity: product.CartProduct.quantity };
    //     return product;
    //   })
    // );

    return res.status(200).json(cartProductGroup);
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
