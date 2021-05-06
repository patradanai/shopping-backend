module.exports = (sequelize, Sequelize) => {
  const Address = sequelize.define(
    "Address",
    {
      name: Sequelize.STRING(50),
      phone: Sequelize.STRING(20),
      province: Sequelize.STRING(50),
      city: Sequelize.STRING(50),
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
