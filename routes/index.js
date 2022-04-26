const express = require("express");
const router = express.Router();

const {
  getIndexPage,
  getAddToCart,
  getCartPage,
  removeFromCart,
  getCheckoutPage,
} = require("../controller/index");

router.route("/").get(getIndexPage);

router.route("/cart").get(getCartPage);

router.route("/checkout").get(getCheckoutPage);

router.route("/addtocart/:id").get(getAddToCart);

router.route("/removefromcart/:id").get(removeFromCart);

module.exports = router;
