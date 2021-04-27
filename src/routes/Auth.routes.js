const express = require("express");
const Router = express.Router();
const { signIn, signUp } = require("../controllers/Auth.controller");

// POST /signin
Router.post("/signin", signIn);

// POST / signup
Router.post("/signup", signUp);

module.exports = Router;
