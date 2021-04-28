const express = require("express");
const Router = express.Router();
const {
  createProduct,
  updateProduct,
} = require("../controllers/Product.controller");
const { isAuth } = require("../middlewares/Auth.middleware");
const { isRole } = require("../middlewares/Role.middleware");

// GET /products

// GET /product/:id

// Post /:id/product, id = shopid
Router.post(
  "/:id/product",
  [isAuth, isRole("Administrator", "Staff")],
  createProduct
);

// PUT /product/:id id = productId
Router.put(
  "/product/:id",
  [isAuth, isRole("Administrator", "Staff")],
  updateProduct
);
// DELETE /product/:id

module.exports = Router;
