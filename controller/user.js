const Cart = require("../model/Cart");
const User = require("../model/User");
const Order = require("../model/Order");

const getLoginPage = async (req, res) => {
  try {
    res.render("pages/login.ejs");
  } catch (error) {
    console.log(error);
  }
};

const userLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (email === "" || password === "") {
      return res.status(404).send();
    }

    const user = await User.find({ email: email });

    // no user found with email
    if (!user) {
      return res.status(403).send();
    }

    // check if correct email and correct password
    for (var i = 0; i < user.length; i++) {
      if (user[i].password === password && user[i].email === email) {
        console.log("found", user[i].role);
        req.session.user = user[i];

        // check if user has  cart in database
        var usercart = await Cart.findOne({ user: user[i]._id });
        if (usercart) {
          req.session.cart = usercart;
        } else {
          req.session.cart = null;
        }

        return res.status(200).send();
      }
    }

    // correct email but wrong password
    return res.status(402).send();
  } catch (error) {
    console.log(error);
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userorders = await Order.find({ user: req.session.user._id }).sort({
      orderdate: "desc",
    });

    res.render("pages/profile", {
      userorders: userorders,
      user: req.session.user,
      cart: req.session.cart,
    });
  } catch (error) {
    console.log(error);
  }
};

// ! Admin function
const getUsersOrders = async (req, res) => {
  try {
    // make sure only admin can access the url
    if (req.session.user == null || req.session.user.role === "Customer") {
      return res.redirect("/");
    }

    // find all orders and sort by order date
    const allorders = await Order.find().sort({
      orderdate: "desc",
    });

    res.render("pages/orders", {
      allorders: allorders,
      user: req.session.user,
      cart: req.session.cart,
    });
  } catch (error) {
    console.log(orders);
  }
};

const logOut = async (req, res) => {
  if (!req.session.user) {
    console.log("there is no user to log out");
    return res.status(400).send();
  } else {
    req.session.destroy();
    console.log("logged out");
    return res.redirect("/");
  }
};

module.exports = {
  getLoginPage,
  userLogin,
  logOut,
  getUserProfile,
  getUsersOrders,
};
