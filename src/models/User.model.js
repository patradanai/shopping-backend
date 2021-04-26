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
    },
    {}
  );
  User.associate = (models) => {
    User.belongsToMany(models.Role, { through: "user_roles" });
    User.belongsTo(models.Address);
  };

  return User;
};
