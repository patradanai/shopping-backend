const express = require("express");
const Router = express.Router();
const {
  addCart,
  getCart,
  deleteProductCart,
} = require("../controllers/Cart.controller");
const { isAuth } = require("../middlewares/Auth.middleware");

// GET
Router.get("/cart", isAuth, getCart);

// POST
Router.post("/cart", isAuth, addCart);

// DELETE
Router.delete("/cart/:id", isAuth, deleteProductCart);

module.exports = Router;
