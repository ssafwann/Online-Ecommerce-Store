const Product = require("../model/Product");

const getShopPage = async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role == "User") {
      return res.redirect("/");
    }
    const shopproducts = await Product.find({ shop: req.session.user.name });

    return res.render("pages/shopproducts.ejs", {
      user: req.session.user,
      shopproducts: shopproducts,
    });
  } catch (error) {
    console.log(error);
  }
};

const getShopOrders = async (req, res) => {
  //
};

module.exports = {
  getShopPage,
  getShopOrders,
};
