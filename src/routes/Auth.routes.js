const express = require("express");
const Router = express.Router();
const {
  signIn,
  signUp,
  signUpCustomer,
  profileUser,
  updateProfile,
} = require("../controllers/Auth.controller");
const { isAuth } = require("../middlewares/Auth.middleware.js");
const { isRole } = require("../middlewares/Role.middleware");

// POST /signin
Router.post("/signin", signIn);

// POST / signup
Router.post("/signup", signUp);

// Post /signup/:id/customer
Router.post(
  "/signup/customer",
  [isAuth, isRole("Administrator")],
  signUpCustomer
);

// Get /profile
Router.get("/profile", isAuth, profileUser);

// Put Update Profile
Router.put("/profile/edit", isAuth, updateProfile);

module.exports = Router;
