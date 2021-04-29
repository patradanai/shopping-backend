const express = require("express");
const Router = express.Router();
const { isAuth } = require("../middlewares/Auth.middleware");
const { isRole } = require("../middlewares/Role.middleware");
const { getLogs } = require("../controllers/Log.controller");

// GET /logs/:id
Router.get("/logs/:id", [isAuth, isRole("Administrator")], getLogs);

module.exports = Router;
