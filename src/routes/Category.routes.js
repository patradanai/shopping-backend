const express = require("express");
const Router = express.Router();
const {
  readCategory,
  categoryById,
} = require("../controllers/Category.controller");

// GET /:shopId/categories
Router.get("/categories", readCategory);

// GET /categories/:id
Router.get("/categories/:id", categoryById);

module.exports = Router;
