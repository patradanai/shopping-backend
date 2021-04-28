const express = require("express");
const Router = express.Router();
const { addCart } = require("../controllers/Cart.controller");
const { isAuth } = require("../middlewares/Auth.middleware");
// GET

// POST
Router.post("/cart", isAuth, addCart);

// DELETE

module.exports = Router;
