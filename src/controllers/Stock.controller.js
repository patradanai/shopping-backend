const db = require("../models");
const User = db.User;
const StockTransactionType = db.StockTransactionType;

exports.updateStock = async (req, res) => {
  const userId = req.userId;
  const { productId, quantity } = req.body;

  try {
    // Get User Instance
    const userInstance = await User.findByPk(userId);

    // Shop Instance
    const shopInstance = await userInstance.getShop();
    if (!shopInstance) {
      return res.status(401).json({ Error: "You not member in Shop" });
    }

    // Product Instance by ProductId
    const productInstance = await shopInstance.getProducts({
      where: { id: productId },
    });
    if (!productInstance) {
      return res
        .status(404)
        .json({ Error: `Not found ProductId ${productId} in Shop` });
    }

    // getStock Instance
    const stockInstance = await productInstance[0].getStock();

    // get StockTransaction
    const stockTransactionInstance = await stockInstance.createStockTransaction(
      { quantity: quantity }
    );

    // get StockTransactionType
    const stockTransactionTypeInstance = await StockTransactionType.findOne({
      where: { name: "StockIn" },
    });

    // set StockType
    await stockTransactionInstance.setStockTransactionType(
      stockTransactionTypeInstance
    );

    // Add Logs
    await userInstance.createLog({
      type: "UPDATE",
      eventType: "STOCK",
      description: `Update Product Id : ${productId} in Stock's Table`,
    });

    return res.status(200).json({ message: "Completed Add Stock" });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};
