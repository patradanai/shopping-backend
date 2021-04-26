module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define(
    "Order",
    {
      orderStatus: Sequelize.STRING,
    },
    {}
  );
  Order.associate = (models) => {
    Order.belongsTo(models.User);
  };

  return Order;
};
