module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define(
    "Role",
    {
      role: Sequelize.STRING,
    },
    {}
  );
  Role.associate = (models) => {
    Role.belongsToMany(models.User, { through: "user_roles" });
  };

  return Role;
};
