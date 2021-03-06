const Sequelize = require("sequelize");
const nodemailer = require("nodemailer");
const db = require("../models");
const User = db.User;
const Order = db.Order;
const OrderStatus = db.OrderStatus;
const ShippingMethod = db.ShippingMethod;
const StockTransactionType = db.StockTransactionType;
const { digioConfig } = require("../config/email");
const transporter = nodemailer.createTransport(digioConfig);

exports.getOrder = async (req, res) => {
  const userId = req.userId;

  try {
    // Check User
    const userInstance = await User.findByPk(userId);

    const orderInstace = await userInstance.getOrders({
      include: ["Products"],
    });

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
  const {
    orderStatus,
    paymentId,
    shippingMethodId,
    name,
    phone,
    shippingAddress,
    subTotal,
    grandTotal,
  } = req.body;

  if (
    !orderStatus ||
    !paymentId ||
    !shippingMethodId ||
    !name ||
    !phone ||
    !shippingAddress ||
    !subTotal ||
    !grandTotal
  ) {
    return res.status(400).json({ Error: "Invalid Id" });
  }

  try {
    // Check User
    const userInstance = await User.findByPk(userId);
    // Get Cart
    const cartInstance = await userInstance.getCart();
    // Products in Cart
    // const cartProducts = await cartInstance.getProducts();

    const shippingMethodInstance = await ShippingMethod.findByPk(
      shippingMethodId
    );

    const orderStatusInstance = await OrderStatus.findOne({
      where: { name: orderStatus },
    });

    const cartProductGroup = await cartInstance.getProducts({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("ShopId")), "ShopId"],
      ],
      group: "ShopId",
    });

    cartProductGroup.map(async (product) => {
      let subTotal = 0;
      let grandTotal = 0;
      const productCartByShop = await cartInstance.getProducts({
        where: { ShopId: product.ShopId },
      });
      productCartByShop.forEach((data, index) => {
        subTotal += data.price;
      });

      grandTotal = subTotal + parseInt(shippingMethodInstance.price);
      // Create Order
      userInstance
        .createOrder({
          name: name,
          phone: phone,
          subTotal: subTotal,
          grandTotal: grandTotal,
          shippingAddress: shippingAddress,
          orderStatus: orderStatus,
          status: orderStatus,
          OrderStatusId: orderStatusInstance.id,
          PaymentId: paymentId,
          ShippingMethodId: shippingMethodId,
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

          return order;
        })
        .then((order) => {
          transporter
            .sendMail({
              from: "patradanai@digipay.dev", // sender address
              to: userInstance.email, // list of receivers
              subject: `Order #${order.id} Confirmed `, // Subject line
              html: `<p><span style='font-family: "Lucida Console", Monaco, monospace;'>Order #${order.id}</span></p>
              <p><span style="background-color: rgb(0, 168, 133);"><br></span></p>
              <p><span style="background-color: rgb(0, 168, 133);"><span style="font-family: 'Lucida Console', Monaco, monospace;"><span style="font-size: 26px; color: rgb(251, 160, 38); background-color: rgb(204, 204, 204);"><strong><em>Thank you for Shopping with us</em></strong></span></span></span></p>
              <p><span style="font-family: 'Lucida Console', Monaco, monospace;"><br></span></p>
              <p><span style="font-family: 'Lucida Console', Monaco, monospace;"><span style="font-size: 17px;">Hi ${userInstance.name}</span></span></p>
              <p><span style="font-family: 'Lucida Console', Monaco, monospace;"><span style="font-size: 17px;">We&apos;ve received your order and we&apos;re already getting started on it.&nbsp;</span></span></p>
              <p><span style="font-family: 'Lucida Console', Monaco, monospace;"><span style="font-size: 17px;">You will get an emil soon with all the details.</span></span></p>
              <p><span style="font-family: 'Lucida Console', Monaco, monospace;"><br></span></p>
              <table style="width: 100%;">
                  <tbody>
                      <tr>
                          <td style="width: 50.0000%;"><span style="font-family: 'Lucida Console', Monaco, monospace;">Order Number</span></td>
                          <td style="width: 50.0000%;"><span style="font-family: 'Lucida Console', Monaco, monospace;">Order Date</span></td>
                      </tr>
                      <tr>
                          <td style="width: 50.0000%;"><span style="font-family: 'Lucida Console', Monaco, monospace;">#${order.id}</span></td>
                          <td style="width: 50.0000%;"><span style="font-family: 'Lucida Console', Monaco, monospace;">${order.createdAt}</span></td>
                      </tr>
                  </tbody>
              </table>
              <p><br></p>
              <p><span style="font-family: 'Lucida Console', Monaco, monospace;">Thank you&nbsp;</span></p>
              <p><span style="font-family: 'Lucida Console', Monaco, monospace;">Best regards</span></p>
              <p><span style="font-family: 'Lucida Console', Monaco, monospace;">E-Shipping</span></p>`, // html body
            })
            .then()
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

    if (statusId === 3) {
      await transporter.sendMail({
        from: "E-shopping@digipay.dev", // sender address
        to: userSaved.email, // list of receivers
        subject: `E-Shopping : Your order has been sent out`, // Subject line
        html: `<h1 style="font-family: Verdana, Arial, Helvetica, sans-serif; background-color: rgb(255, 255, 255);"><span style='font-family: "Lucida Console", Monaco, monospace;'>Your order has Shipped!</span></h1>
      <hr>
      <p><br></p>
      <p><span style="font-family: 'Lucida Console', Monaco, monospace;">Hi ${userSaved.nane}</span></p>
      <p><br></p>
      <p style="font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 11px; background-color: rgb(255, 255, 255);"><span style='font-family: "Lucida Console", Monaco, monospace; font-size: 16px;'>Good news your order has been sent out.</span></p>
      <p style="font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 11px; background-color: rgb(255, 255, 255);"><span style="font-size: 16px;"><span style="font-family: 'Lucida Console', Monaco, monospace;"><br data-mce-bogus="1"></span></span></p>
      <p style="font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 11px; background-color: rgb(255, 255, 255);"><span style="font-size: 16px;"><span style="font-family: 'Lucida Console', Monaco, monospace;">Tracking Number : <strong>${tracking}</strong></span></span></p>
      <p style="font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 11px; background-color: rgb(255, 255, 255);"><span style="font-size: 16px;"><span style="font-family: 'Lucida Console', Monaco, monospace;"><br data-mce-bogus="1"></span></span></p>
      <p style="font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 11px; background-color: rgb(255, 255, 255);"><span style="font-size: 16px;"><span style="font-family: 'Lucida Console', Monaco, monospace;"><strong>Address :</strong></span></span></p>
      <p style="font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 11px; background-color: rgb(255, 255, 255);"><span style="font-size: 16px;"><span style="font-family: 'Lucida Console', Monaco, monospace;">${orderInstance[0].name}/span></span></p>
      <p style="font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 11px; background-color: rgb(255, 255, 255);"><span style="font-size: 16px;"><span style="font-family: 'Lucida Console', Monaco, monospace;">${orderInstance[0].shippingAddress}</span></span></p>
      <p style="font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 11px; background-color: rgb(255, 255, 255);"><span style="font-size: 16px;"><span style="font-family: 'Lucida Console', Monaco, monospace;"><br data-mce-bogus="1"></span></span></p>
      <p style="font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 11px; background-color: rgb(255, 255, 255);"><span style="font-size: 16px;"><span style="font-family: 'Lucida Console', Monaco, monospace;">Thank you</span></span></p>
      <p style="font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 11px; background-color: rgb(255, 255, 255);"><span style="font-size: 16px;"><span style='font-family: "Lucida Console", Monaco, monospace;'>Best regards</span></span></p>
      <p style="font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 11px; background-color: rgb(255, 255, 255);"><span style="font-size: 16px;">E-Shopping</span></p>`, // html body
      });
    }

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
