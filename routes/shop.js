const express = require("express");
const router = express.Router();

const {
  getAllShops,
  getAddShopPage,
  getShopOrders,
  getShopPage,
  postShop,
  deleteShopandOrders,
} = require("../controller/shop");

router.route("/").get(getAllShops);
router.route("/add").get(getAddShopPage).post(postShop);
router.route("/products/:name").get(getShopPage);
router.route("/orders/:name").get(getShopOrders);
router.route("/delete/:name").delete(deleteShopandOrders);

module.exports = router;
