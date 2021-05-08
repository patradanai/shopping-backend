module.exports = (sequelize, Sequelize) => {
  const ShippingMethod = sequelize.define(
    "ShippingMethod",
    {
      name: Sequelize.STRING,
      price: Sequelize.STRING,
    },
    {}
  );
  ShippingMethod.associate = (models) => {
    ShippingMethod.belongsTo(models.Shop);

    ShippingMethod.hasMany(models.Order);
    ShippingMethod.hasMany(models.Cart);
  };

  return ShippingMethod;
};
