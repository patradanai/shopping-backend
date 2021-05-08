const express = require("express");
const Router = express.Router();
const { getPayment } = require("../controllers/Payment.controller");

// GET /logs/:id
Router.get("/payments", getPayment);

module.exports = Router;
