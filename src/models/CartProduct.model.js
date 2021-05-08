module.exports = (sequelize, Sequelize) => {
  const CartProduct = sequelize.define("CartProduct", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    quantity: Sequelize.INTEGER,
  });

  return CartProduct;
};
