const express = require("express");
const router = express.Router();
// add models here if needed to use

const { getIndexPage } = require("../controller/index");

router.route("/").get(getIndexPage);

module.exports = router;
