module.exports = (sequelize, Sequelize) => {
  const Transaction = sequelize.define("Transaction", {}, {});

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.User);
    Transaction.belongsTo(models.Order);
    Transaction.belongsTo(models.OrderStatus);
    Transaction.belongsTo(models.Payment);
  };

  return Transaction;
};
