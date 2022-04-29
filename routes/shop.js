const express = require("express");
const router = express.Router();

const { getShopOrders, getShopPage } = require("../controller/shop");

router.route("/oders").get(getShopOrders);
router.route("/:name").get(getShopPage);

module.exports = router;
