const express = require("express");
const router = express.Router();
// add models here if needed to use

const {
  getAllProducts,
  getSingleProduct,
  getCategoryProducts,
  getSearchPage,
  getModifyPage,
  postModify,
  getAddPage,
  postAddProduct,
  deleteProduct,
} = require("../controller/products");

router.route("/").get(getAllProducts);
router.route("/search").get(getSearchPage);

// admin routes
router.route("/add").get(getAddPage).post(postAddProduct);
router.route("/modify/:id").get(getModifyPage).patch(postModify);
router.route("/delete/:id").delete(deleteProduct);

router.route("/:category/:id").get(getSingleProduct);
router.route("/:category").get(getCategoryProducts);

module.exports = router;
