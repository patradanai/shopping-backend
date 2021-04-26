require("dotenv").config();
const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");
const { development } = require("../config/db");

const sequelize = new Sequelize(development);
const db = {};

try {
  fs.readdirSync(__dirname)
    .filter((file) => file != "index.js")
    .forEach((file) => {
      const model = require(path.join(__dirname, file))(sequelize, Sequelize);
      db[model.name] = model;
    });
} catch (err) {
  console.log(err);
}

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
