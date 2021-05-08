module.exports = (sequelize, Sequelize) => {
  const OrderProduct = sequelize.define(
    "OrderProduct",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      quantity: Sequelize.INTEGER,
    },
    {}
  );

  return OrderProduct;
};
