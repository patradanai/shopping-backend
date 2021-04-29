module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define(
    "Product",
    {
      name: Sequelize.STRING,
      price: Sequelize.INTEGER,
      description: Sequelize.TEXT,
      isActive: Sequelize.BOOLEAN,
      imageSrc: Sequelize.STRING,
    },
    {}
  );
  Product.associate = (models) => {
    Product.belongsTo(models.Category);
    Product.belongsTo(models.Shop);
    Product.belongsTo(models.User);
    Product.hasOne(models.Stock);

    Product.belongsToMany(models.Order, { through: models.OrderProduct });

    Product.belongsToMany(models.Cart, { through: models.CartProduct });
  };

  return Product;
};
