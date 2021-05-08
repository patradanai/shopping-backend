const express = require("express");
const Router = express.Router();
const { getShipping } = require("../controllers/Shipping.controller");

// GET /logs/:id
Router.get("/shippings/", getShipping);

module.exports = Router;
