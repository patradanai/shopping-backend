module.exports = (sequelize, Sequelize) => {
  const Payment = sequelize.define(
    "Payment",
    {
      name: Sequelize.STRING,
    },
    {}
  );
  Payment.associate = (models) => {
    Payment.hasMany(models.Transaction);
  };

  return Payment;
};
