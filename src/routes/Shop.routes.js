const express = require("express");
const Router = express.Router();
const { isAuth } = require("../middlewares/Auth.middleware");
const { isRole } = require("../middlewares/Role.middleware");
const {
  shopUpdate,
  shopCreateShipping,
  shopProfile,
} = require("../controllers/Shop.controller");

// GET /shop/:id
Router.get("/shop/:id", [isAuth, isRole("Administrator")], shopProfile);

// PUT /shop/:id/edit
Router.put("/shop/:id/edit", [isAuth, isRole("Administrator")], shopUpdate);

// POST /shop/:id
Router.post("/shop/:id", [isAuth, isRole("Administrator")], shopCreateShipping);

module.exports = Router;
