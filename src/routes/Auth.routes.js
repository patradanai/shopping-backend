const express = require("express");
const Router = express.Router();
const {
  signIn,
  signUp,
  signUpCustomer,
  signUpModerator,
  profileUser,
  updateProfile,
  updateAddress,
  memberShop,
  isActiveUser,
} = require("../controllers/Auth.controller");
const { isAuth } = require("../middlewares/Auth.middleware.js");
const { isRole } = require("../middlewares/Role.middleware");

// POST /signin
Router.post("/signin", signIn);

// POST / signup
Router.post("/signup", signUp);

// Post
Router.post("/signup/customer", signUpCustomer);

// Post /signup/:id/customer
Router.post(
  "/signup/moderator",
  [isAuth, isRole("Administrator")],
  signUpModerator
);

// Get member
Router.get("/user/:id/all", [isAuth, isRole("Administrator")], memberShop);

// Get /profile
Router.get("/profile", isAuth, profileUser);

// PUT /profile/active/:id
Router.put(
  "/profile/active/:id",
  [isAuth, isRole("Administrator")],
  isActiveUser
);

// Put Update Profile
Router.put("/profile/edit", isAuth, updateProfile);

// Put Update Profile
Router.put("/address/edit", isAuth, updateAddress);

module.exports = Router;
