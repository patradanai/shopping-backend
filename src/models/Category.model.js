module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define(
    "Category",
    {
      name: Sequelize.STRING,
      imageSrc: Sequelize.STRING,
    },
    {}
  );
  Category.associate = (models) => {
    Category.hasMany(models.Product);
  };

  return Category;
};
