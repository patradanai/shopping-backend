const express = require("express");
const Router = express();
const { isAuth } = require("../middlewares/Auth.middleware");
const { isRole } = require("../middlewares/Role.middleware");
const { updateStock } = require("../controllers/Stock.controller");
// Stock
Router.post("/stock", [isAuth, isRole("Administrator", "Staff")], updateStock);

module.exports = Router;
