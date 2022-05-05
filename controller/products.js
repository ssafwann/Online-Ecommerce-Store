const Product = require("../model/Product");
const Review = require("../model/Review");
const Order = require("../model/Order");

// for the "All" products page
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.render("pages/products.ejs", {
      user: req.session.user,
      category: "All",
      products: products,
      cart: req.session.cart,
    });
  } catch (error) {
    console.log(error);
  }
};

// display a single product's page
const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    const productreviews = await Review.find({
      product: req.params.id,
    }).sort({ reviewdate: "desc" });

    if (req.session.user) {
      const hasUserReviewed = await Review.findOne({
        product: req.params.id,
        user: req.session.user._id,
      });

      if (hasUserReviewed) {
        return res.render("pages/product", {
          product: product,
          user: req.session.user,
          cart: req.session.cart,
          productreviews: productreviews,
          hasUserReviewed: true,
          hasUserOrdered: false,
        });
      }
    }

    // check if user has already ordered this product
    if (req.session.user) {
      const userorders = await Order.find({ user: req.session.user._id });

      var hasUserOrdered = false;
      for (var i = 0; i < userorders.length; i++) {
        // if found that he ordered then exit
        if (hasUserOrdered == true) {
          break;
        }

        for (var j = 0; j < userorders[i].products.length; j++) {
          if (userorders[i].products[j].productID == req.params.id) {
            hasUserOrdered = true;
            break;
          }
        }
      }

      return res.render("pages/product", {
        product: product,
        user: req.session.user,
        cart: req.session.cart,
        productreviews: productreviews,
        hasUserReviewed: false,
        hasUserOrdered: hasUserOrdered,
      });
    }

    // user is logged out
    return res.render("pages/product", {
      product: product,
      user: req.session.user,
      cart: req.session.cart,
      productreviews: productreviews,
      hasUserReviewed: false,
      hasUserOrdered: false,
    });
  } catch (error) {
    console.log(error);
  }
};

const getSearchPage = async (req, res) => {
  try {
    const searchKeyword = req.query.search;

    // case-insensitive search in db using the searchkeyword
    const products = await Product.find({
      name: { $regex: searchKeyword, $options: "i" },
    });

    res.render("pages/products.ejs", {
      user: req.session.user,
      category: "Search",
      products: products,
      cart: req.session.cart,
    });
  } catch (error) {
    console.log(error);
  }
};

const getModifyPage = async (req, res) => {
  try {
    // make sure only admin can access the url
    if (req.session.user == null || req.session.user.role === "Customer") {
      return res.redirect("/");
    }

    const product = await Product.findById(req.params.id);
    res.render("pages/modifyproduct", {
      user: req.session.user,
      cart: req.session.cart,
      product: product,
    });
  } catch (error) {
    console.log(error);
  }
};

const postModify = async (req, res) => {
  try {
    const newprice = req.body.newprice;
    const newquantity = req.body.newquantity;

    if (newprice == "" || newquantity == "") {
      return res.status(403).send();
    }

    // get product and update
    const product = await Product.findById(req.params.id);
    product.price = parseInt(newprice);
    product.quantity = parseInt(newquantity);
    if (parseInt(newquantity) > 0) {
      product.instock = true;
    } else {
      product.instock = false;
    }

    // save on to database
    product.save(async (err, product) => {
      if (err) {
        console.log(err);
        return res.status(404).send();
      }
      res.status(200).send(product);
    });
  } catch (error) {
    console.log(error);
  }
};

const getAddPage = async (req, res) => {
  try {
    // make sure only admin can access the url
    if (req.session.user == null || req.session.user.role === "Customer") {
      return res.redirect("/");
    }

    res.render("pages/addproduct", {
      user: req.session.user,
      cart: req.session.cart,
    });
  } catch (error) {
    console.log(error);
  }
};

const postAddProduct = async (req, res) => {
  try {
    const name = req.body.name;
    const description = req.body.description;
    const category = req.body.category;
    const image = req.body.image;
    const quantity = req.body.quantity;
    const price = req.body.price;

    if (
      name == "" ||
      description == "" ||
      category == "" ||
      image == "" ||
      quantity == "" ||
      price == ""
    ) {
      return res.status(403).send();
    }

    var instock = false;
    if (parseInt(quantity) > 0) {
      instock = true;
    } else {
      instock = false;
    }

    // create product
    const product = await Product.create({
      name: name,
      category: category,
      description: description,
      image: image,
      price: parseInt(price),
      quantity: parseInt(quantity),
      instock: instock,
      shop: req.session.user.name,
    });

    // save product onto database
    product.save(async (err, product) => {
      if (err) {
        console.log(err);
        return res.status(404).send();
      }
      res.status(200).send(product);
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    Product.findByIdAndDelete(req.params.id, (err) => {
      if (err) {
        console.log(err);
        return res.status(404).send();
      } else {
        const user = req.session.user;
        return res.status(200).send(user);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const postProductReview = async (req, res) => {
  try {
    const review = req.body.review;

    if (review == "") {
      return res.status(403).send();
    }

    const userreview = await Review.create({
      user: req.session.user._id,
      product: req.params.id,
      reviewdate: new Date(),
      review: review,
      name: req.session.user.name,
    });

    userreview.save(async (err, review) => {
      if (err) {
        console.log(err);
        return res.status(404).send();
      }
      const product = await Product.findById(req.params.id);
      res.status(200).send(product);
    });
  } catch (error) {
    console.log(error);
  }
};

// display the categories
const getCategoryProducts = async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ category: category });

    res.render("pages/products.ejs", {
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
  getSearchPage,
  getModifyPage,
  postModify,
  getAddPage,
  postAddProduct,
  deleteProduct,
  postProductReview,
};
