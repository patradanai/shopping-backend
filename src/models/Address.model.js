module.exports = (sequelize, Sequelize) => {
  const Address = sequelize.define(
    "Address",
    {
      address: Sequelize.STRING(1000),
      postcode: Sequelize.STRING(10),
      country: Sequelize.STRING,
    },
    {}
  );
  Address.associate = (models) => {
    Address.hasOne(models.User);
  };

  return Address;
};
