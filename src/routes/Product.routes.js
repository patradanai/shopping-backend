const express = require("express");
const Router = express.Router();
const {
  createProduct,
  updateProduct,
  deleteProduct,
  product,
  products,
  shopProduct,
  shopProducts,
} = require("../controllers/Product.controller");
const { isAuth } = require("../middlewares/Auth.middleware");
const { isRole } = require("../middlewares/Role.middleware");

// GET /products
Router.get("/products", products);

// GET /product/:id
Router.get("/product/:id", product);

// GET /:shopid/products
Router.get("/:shopId/products", shopProducts);

// GET /:shopid/product/:id
Router.get("/:shopId/product/:id", shopProduct);

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
Router.delete(
  "/product/:id",
  [isAuth, isRole("Administrator", "Staff")],
  deleteProduct
);

module.exports = Router;
