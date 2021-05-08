module.exports = (sequelize, Sequelize) => {
  const WishList = sequelize.define("WishList", {}, {});
  WishList.associate = (models) => {
    WishList.belongsTo(models.User);
    WishList.belongsToMany(models.Product, { through: "wish_products" });
  };
  return WishList;
};
