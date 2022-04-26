const express = require("express");
const router = express.Router();
// add models here if needed to use

const {
  getAllProducts,
  getSingleProduct,
  getCategoryProducts,
} = require("../controller/products");

router.route("/").get(getAllProducts);

router.route("/:category/:id").get(getSingleProduct);

router.route("/:category").get(getCategoryProducts);

module.exports = router;
