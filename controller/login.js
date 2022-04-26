const Cart = require("../model/Cart");
const User = require("../model/User");

const getLoginPage = async (req, res) => {
  res.render("pages/login.ejs");
};

const userLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email === "" || password === "") {
    return res.status(404).send();
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(403).send();
    // correct user
  } else if (user.password === password && user.email === email) {
    console.log("found user");
    req.session.user = user;

    // check if user has a cart in database, if yes then save to session
    var usercart = await Cart.findOne({ user: user._id });
    if (usercart) {
      req.session.cart = usercart;
    }

    return res.status(200).send();
  } else if (user.password !== password && user.email === email) {
    return res.status(402).send();
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
};
