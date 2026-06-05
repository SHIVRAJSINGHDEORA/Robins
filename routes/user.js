const express = require("express");
const AsyncWrap = require("../utilis/AsyncWrap");
const router = express.Router();
const User = require("../Models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/user.js");

//Sign Up
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(AsyncWrap(userController.signup));

//Login
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

//Log Out
router.get("/logout", userController.logout);

module.exports = router;
