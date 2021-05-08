module.exports = (sequelize, Sequelize) => {
  const Log = sequelize.define(
    "Log",
    {
      type: Sequelize.STRING,
      eventType: Sequelize.STRING,
      description: Sequelize.TEXT,
    },
    {}
  );
  Log.associate = (models) => {
    Log.belongsTo(models.User);
  };
  return Log;
};
