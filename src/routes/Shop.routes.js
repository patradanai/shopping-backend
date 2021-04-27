const express = require("express");
const Router = express.Router();
const { isAuth } = require("../middlewares/Auth.middleware");
const { isRole } = require("../middlewares/Role.middleware");
const { shopUpdate } = require("../controllers/Shop.controller");
// PUT
Router.put(
  "/shop/:id/edit",
  [isAuth, isRole("Administrator", "Staff")],
  shopUpdate
);

module.exports = Router;
