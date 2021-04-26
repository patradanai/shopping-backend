module.exports = (sequelize, Sequelize) => {
  const Shop = sequelize.define(
    "Shop",
    {
      name: Sequelize.STRING,
    },
    {}
  );
  Shop.associate = (models) => {
    Shop.hasMany(models.User);
    Shop.hasMany(models.Product);
    Shop.hasMany(models.ShippingMethod);
  };

  return Shop;
};
