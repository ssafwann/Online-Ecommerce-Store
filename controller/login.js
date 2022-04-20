const User = require("../model/User");
const router = require("../routes");

const getLoginPage = async (req, res) => {
  res.render("login.ejs");
};

const userLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email, password: password }, function (err, user) {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }

    if (!user) {
      return res.status(404).send();
    }
    console.log("found user");
    req.session.user = user; // save user into session
    return res.status(200).send();
  });
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
