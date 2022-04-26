const Product = require("../model/Product");

// for the All products page
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.render("pages/category.ejs", {
      user: req.session.user,
      category: "All",
      products: products,
      cart: req.session.cart,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};

// display a single product's page
const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.render("pages/product", {
        product: product,
        user: req.session.user,
        cart: req.session.cart,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// display the categories
const getCategoryProducts = async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ category: category });

    res.render("pages/category.ejs", {
      user: req.session.user,
      category: category,
      products: products,
      cart: req.session.cart,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllProducts,
  getSingleProduct,
  getCategoryProducts,
};
