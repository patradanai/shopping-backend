module.exports = (sequelize, Sequelize) => {
  const OrderStatus = sequelize.define(
    "OrderStatus",
    {
      name: Sequelize.STRING,
    },
    {}
  );
  OrderStatus.associate = (models) => {
    OrderStatus.hasMany(models.Order);
    OrderStatus.hasMany(models.Transaction);
  };

  return OrderStatus;
};
