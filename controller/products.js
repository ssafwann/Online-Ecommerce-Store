const Product = require("../model/Product");

const getAllProducts = async (req, res) => {
  const product = await Product.find();

  try {
    res.render("product.ejs", {
      product: product,
      user: req.session.user,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};

module.exports = {
  getAllProducts,
};
