module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "User",
    {
      email: Sequelize.STRING,
      username: Sequelize.STRING,
      fname: Sequelize.STRING,
      lname: Sequelize.STRING,
      password: Sequelize.STRING,
      phone: Sequelize.STRING,
      isActive: Sequelize.BOOLEAN,
    },
    {}
  );
  User.associate = (models) => {
    User.belongsTo(models.Shop);
    User.hasMany(models.Log);
    User.hasMany(models.Order);
    User.hasMany(models.Transaction);
    User.hasMany(models.Product);
    User.hasOne(models.Cart);
    User.belongsToMany(models.Role, { through: "user_roles" });
    User.belongsTo(models.Address);
  };

  return User;
};
