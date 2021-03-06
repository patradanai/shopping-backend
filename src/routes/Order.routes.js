const express = require("express");
const Router = express.Router();
const { isAuth } = require("../middlewares/Auth.middleware");
const { isRole } = require("../middlewares/Role.middleware");
const {
  getOrder,
  updateOrder,
  placeOrder,
  getOrderByShop,
  getOrderStatus,
} = require("../controllers/Order.controller");

// GET /statusOrder
Router.get("/statusOrder", [isAuth], getOrderStatus);

// GET
Router.get("/orders", [isAuth], getOrder);

// POST
Router.post("/order", [isAuth], placeOrder);

// GET SHOP
Router.get(
  "/:shopId/orders",
  [isAuth, isRole("Staff", "Administrator")],
  getOrderByShop
);

// PUT
Router.put(
  "/:shopId/order/:id/edit",
  [isAuth, isRole("Staff", "Administrator")],
  updateOrder
);

module.exports = Router;
