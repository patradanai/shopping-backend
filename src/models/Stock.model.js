module.exports = (sequelize, Sequelize) => {
  const Stock = sequelize.define(
    "Stock",
    {
      quantity: Sequelize.INTEGER,
      minOrder: Sequelize.INTEGER,
      quantityOrer: Sequelize.INTEGER,
    },
    {}
  );
  Stock.associate = (models) => {
    Stock.belongsTo(models.Product);
    Stock.hasMany(models.StockTransaction);
  };
  return Stock;
};
