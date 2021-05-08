const express = require("express");
const Router = express();
const { isAuth } = require("../middlewares/Auth.middleware");
const { isRole } = require("../middlewares/Role.middleware");
const {
  getWishList,
  addWishList,
  deleteWishList,
} = require("../controllers/Wish.controller");

// Stock GET /db_wish/wishs
Router.get("/wishs", [isAuth], getWishList);

// Stock POST /db_wish/wishs
Router.post("/wishs/:productId", [isAuth], addWishList);

// Stock POST /db_wish/wishs
Router.delete("/wishs/:productId", [isAuth], deleteWishList);

module.exports = Router;
