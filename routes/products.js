const express = require("express");
const router = express.Router();
// add models here if needed to use

const { getAllProducts } = require("../controller/products");

router.route("/").get(getAllProducts);

module.exports = router;
