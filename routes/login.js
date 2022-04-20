const express = require("express");
const router = express.Router();
// add models here if needed to use

const { getLoginPage, logOut, userLogin } = require("../controller/login");

router.route("/login").get(getLoginPage).post(userLogin);

router.route("/logout").get(logOut);

module.exports = router;
