const Product = require("../model/Product");
const Order = require("../model/Order");
const User = require("../model/User");

const getAllShops = async (req, res) => {
  try {
    const shops = await User.find({ role: "Seller" });
    return res.render("pages/shops", {
      user: req.session.user,
      shops: shops,
    });
  } catch (error) {
    console.log(error);
  }
};

const getAddShopPage = async (req, res) => {
  try {
    if (
      !req.session.user ||
      req.session.user.role == "Customer" ||
      req.session.user.role == "Seller"
    ) {
      return res.redirect("/");
    }

    return res.render("pages/addshop", {
      user: req.session.user,
    });
  } catch (error) {
    console.log(error);
  }
};

const getShopPage = async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role == "User") {
      return res.redirect("/");
    }

    const shopproducts = await Product.find({ shop: req.params.name });

    return res.render("pages/shopproducts", {
      user: req.session.user,
      shopproducts: shopproducts,
    });
  } catch (error) {
    console.log(error);
  }
};

const getShopOrders = async (req, res) => {
  try {
    if (
      !req.session.user ||
      req.session.user.role == "Customer" ||
      (req.session.user.role == "Seller" &&
        req.params.name != req.session.user.name)
    ) {
      return res.redirect("/");
    }

    const shoporders = await Order.find({
      "products.shop": req.params.name,
    }).sort({ orderdate: "desc" });

    for (var i = 0; i < shoporders.length; i++) {
      for (var j = 0; j < shoporders[i].products.length; j++) {
        if (shoporders[i].products[j].shop === req.params.name) {
          // remove the product that isnt from user's shop and update order details
        } else {
          shoporders[i].subtotal -= shoporders[i].products[j].price;
          shoporders[i].totalQuantity -= 1;
          shoporders[i].products.splice(j, 1);
          --j; // minus because the length of products changes after removing
        }
      }
    }

    res.render("pages/orders", {
      allorders: shoporders,
      user: req.session.user,
      cart: req.session.cart,
    });
  } catch (error) {
    console.log(error);
  }
};

const postShop = async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    if (name == "" || email == "" || password == "") {
      return res.status(403).send();
    }

    // create product
    const user = await User.create({
      name: name,
      password: password,
      email: email,
      role: "Seller",
    });

    // save product onto database
    user.save(async (err, product) => {
      if (err) {
        console.log(err);
        return res.status(404).send();
      }
      res.status(200).send();
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteShopandOrders = async (req, res) => {
  try {
    User.findOneAndDelete({ name: req.params.name, role: "Seller" }, (err) => {
      if (err) {
        console.log(err);
        return res.status(404).send();
      }

      Product.deleteMany({ shop: req.params.name }, (err) => {
        if (err) {
          console.log(err);
          return res.status(404).send;
        }
        return res.status(200).send();
      });
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllShops,
  getAddShopPage,
  getShopPage,
  getShopOrders,
  postShop,
  deleteShopandOrders,
};
