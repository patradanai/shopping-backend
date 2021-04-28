module.exports = (sequelize, Sequelize) => {
  const Cart = sequelize.define(
    "Cart",
    {
      subTotal: Sequelize.FLOAT,
    },
    {}
  );
  Cart.associate = (models) => {
    Cart.belongsTo(models.User);

    Cart.belongsToMany(models.Product, { through: models.CartProduct });
  };

  return Cart;
};
