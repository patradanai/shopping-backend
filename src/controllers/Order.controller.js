const Sequelize = require("sequelize");
const db = require("../models");
const User = db.User;
const Order = db.Order;
const OrderStatus = db.OrderStatus;
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

exports.getOrderByShop = async (req, res) => {
  const userId = req.userId;
  const { shopId } = req.params;

  try {
    // get userInstance
    const userInstance = await User.findByPk(userId);

    // get shopInstance
    const shopInstance = await userInstance.getShop();

    if (shopId != shopInstance.id) {
      return res.status(401).json({ Error: "Unthorization with This Shop" });
    }

    // Get orderInstance
    const orderInstance = await Order.findAll({
      where: { id: shopInstance.id },
      include: { all: true },
    });

    return res.status(200).json({ order: orderInstance });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};

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
  const { shopId, id } = req.params;
  const { statusId, tracking } = req.body;

  console.log(shopId, id, statusId, tracking);
  try {
    // Check User
    const userInstance = await User.findByPk(userId);
    if (!userInstance) return res.status(404).json({ Error: "User not found" });

    // get shopInstance
    const shopInstance = await userInstance.getShop();
    if (shopId != shopInstance.id) {
      return res.status(400).json({ Error: "Bad Request" });
    }

    const orderInstance = await shopInstance.getOrders({ where: { id: id } });
    if (!orderInstance[0]) {
      return res.status(400).json({ Error: "failure processed" });
    }

    orderInstance[0].trackingNumber = tracking;
    orderInstance[0].OrderStatusId = statusId;

    await orderInstance[0].save();

    // Create log
    await userInstance.createLog({
      type: "UPDATE",
      eventType: "ORDER",
      description: `Update Order ${id} in Order's Table`,
    });

    // Create transaction

    orderInstance[0].createTransaction({
      OrderStatusId: statusId,
      PaymentId: orderInstance[0].PaymentId,
      UserId: orderInstance[0].UserId,
    });

    return res.status(200).json({ message: "Update Order Success" });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};

exports.getOrderStatus = async (req, res) => {
  try {
    // get orderStatusInstance
    const orderStatusInstance = await OrderStatus.findAll();

    return res.status(200).json(orderStatusInstance);
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};
