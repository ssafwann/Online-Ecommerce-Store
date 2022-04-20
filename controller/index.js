const Product = require("../model/Product");

const getIndexPage = async (req, res) => {
  const products = await Product.find();

  try {
    res.render("home.ejs", {
      user: req.session.user,
      product: products,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};

module.exports = {
  getIndexPage,
};
