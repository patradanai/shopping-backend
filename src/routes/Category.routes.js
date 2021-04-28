const express = require("express");
const Router = express.Router();
const { readCategory } = require("../controllers/Category.controller");

// GET /:shopId/categories
Router.get("/categories", readCategory);

module.exports = Router;
