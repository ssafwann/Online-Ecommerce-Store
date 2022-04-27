const Product = require("../model/Product");
const Cart = require("../model/Cart");
const Order = require("../model/Order");

const getIndexPage = async (req, res) => {
  try {
    const products = await Product.find().limit(6).sort({ price: "desc" });

    // sort array according to price
    products.sort((a, b) => {
      return b.price - a.price;
    });

    res.render("pages/home.ejs", {
      user: req.session.user,
      product: products,
      cart: req.session.cart,
    });
  } catch (error) {
    console.log(error);
  }
};

const getAddToCart = async (req, res) => {
  try {
    // if user is logged in check if he has a cart
    var usercart;
    if (req.session.user) {
      usercart = await Cart.findOne({ user: req.session.user._id });
    }
    // if not logged in check if the session has a cart
    else if (req.session.cart) {
      usercart = req.session.cart;
    }

    var cart;
    if (!usercart) {
      cart = new Cart({});
    } else {
      cart = usercart;
    }

    // find product and add to cart and update cart details
    const productToAddID = req.params.id;
    const productToAdd = await Product.findById(productToAddID);
    cart.products.push({
      productID: productToAddID,
      price: productToAdd.price,
      name: productToAdd.name,
      image: productToAdd.image,
    });
    cart.subtotal = cart.subtotal + productToAdd.price;
    cart.totalQuantity = cart.totalQuantity + 1;

    // if logged in save into database as well
    if (req.session.user) {
      cart.user = req.session.user._id;
      await cart.save();
    }

    req.session.cart = cart;

    // go back to the page where user clicked the button
    res.redirect(req.headers.referer);
  } catch (error) {
    console.log(error);
  }
};

const getCartPage = async (req, res) => {
  try {
    var usercart;
    // check if user exsists, if yes then check if he has a cart in db
    if (req.user) {
      usercart = await Cart.findOne({ user: req.session.user._id });
    }

    // if cart from db is not empty
    if (usercart) {
      req.session.cart = usercart;

      return res.render("pages/cart.ejs", {
        products: await productsInCart(usercart),
        user: req.session.user,
        cart: usercart,
      });
    }

    // session cart is empty
    if (!req.session.cart) {
      return res.render("pages/cart.ejs", {
        cart: null,
        products: null,
        user: req.session.user,
      });
    }

    // user logged out but has cart in session
    return res.render("pages/cart.ejs", {
      cart: req.session.cart,
      products: await productsInCart(req.session.cart),
      user: req.session.user,
    });
  } catch (error) {
    console.log(error);
  }
};

const removeFromCart = async (req, res) => {
  try {
    if (req.session.cart) {
      const toRemoveproductID = req.params.id;

      // get user cart from db if logged in otherwise session
      var usercart;
      if (req.session.user) {
        usercart = await Cart.findOne({ user: req.session.user._id });
      } else if (req.session.cart) {
        usercart = await new Cart(req.session.cart);
      }

      var productToRemove;
      var productIndex;

      // find the product in cart that user wants to remove
      for (var i = 0; i < usercart.products.length; i++) {
        var cartproductID = usercart.products[i].productID.toString();
        if (cartproductID === toRemoveproductID) {
          productToRemove = usercart.products[i];
          productIndex = i;
        }
      }

      // update details and remove product
      usercart.totalQuantity = usercart.totalQuantity - 1;
      usercart.subtotal = usercart.subtotal - productToRemove.price;
      usercart.products.remove({ _id: usercart.products[productIndex]._id });

      req.session.cart = usercart;

      // save into database if user logged in
      if (req.session.user) {
        await usercart.save();
      }

      // remove cart from database if total quantity is 0
      if (usercart.totalQuantity <= 0) {
        req.session.cart = null;
        await Cart.findByIdAndRemove(usercart._id);
      }

      res.redirect(req.headers.referer);
    }
  } catch (error) {
    console.log(error);
  }
};

const getCheckoutPage = async (req, res) => {
  try {
    if (!req.session.user) {
      res.redirect("/user/login");
    }

    res.render("pages/checkout.ejs", {
      user: req.session.user,
      cart: req.session.cart,
      products: await productsInCart(req.session.cart),
    });
  } catch (error) {
    console.log(error);
  }
};

const postCheckoutPage = async (req, res) => {
  try {
    if (req.session.cart && req.session.user) {
      const deliveryaddress = req.body.deliveryaddress;

      if (deliveryaddress == "") {
        return res.status(403).send();
      }

      const usercart = await Cart.findOne({ user: req.session.user._id });

      // create the order
      const order = await Order.create({
        user: req.session.user._id,
        totalQuantity: usercart.totalQuantity,
        subtotal: usercart.subtotal,
        deliveryaddress: deliveryaddress,
        orderdate: new Date(),
        deliverystatus: false,
        products: usercart.products,
      });

      // save onto database
      order.save(async (err, userorder) => {
        if (err) {
          console.log(error);
          return res.status(404).send();
        }
        await usercart.save();
        await Cart.findByIdAndDelete(usercart._id);
        req.session.cart = null;
        return res.status(200).send();
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).send();
  }
};

// create products array to store the info of each product in the cart
const productsInCart = async (cart) => {
  var products = [];

  for (var i = 0; i < cart.products.length; i++) {
    var cartproduct = await Product.findById(cart.products[i].productID).lean();
    products.push(cartproduct);
  }

  return products;
};

module.exports = {
  getIndexPage,
  getAddToCart,
  getCartPage,
  removeFromCart,
  getCheckoutPage,
  postCheckoutPage,
};
