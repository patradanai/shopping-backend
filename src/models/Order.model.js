module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define(
    "Order",
    {
      orderStatus: Sequelize.STRING,
      subTotal: Sequelize.FLOAT,
      grandTotal: Sequelize.FLOAT,
    },
    {}
  );
  Order.associate = (models) => {
    Order.belongsTo(models.User);
    Order.belongsTo(models.ShippingMethod);
    Order.belongsTo(models.Payment);
    Order.belongsTo(models.OrderStatus);
    Order.belongsTo(models.Shop);

    Order.hasMany(models.Transaction);

    Order.belongsToMany(models.Product, { through: models.OrderProduct });
  };

  return Order;
};
