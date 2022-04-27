const express = require("express");
const router = express.Router();

const {
  getLoginPage,
  logOut,
  userLogin,
  getUserProfile,
  getUsersOrders,
} = require("../controller/user");

router.route("/login").get(getLoginPage).post(userLogin);

router.route("/profile").get(getUserProfile);

// admin route
router.route("/orders").get(getUsersOrders);

router.route("/logout").get(logOut);

module.exports = router;
