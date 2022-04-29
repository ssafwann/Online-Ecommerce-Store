const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

require("dotenv").config();

// Middleware
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

// variables that all routes should have
app.use(async (req, res, next) => {
  try {
    res.locals.currentuser = req.user;
    res.locals.cart = req.cart;
    res.locals.session = req.session;
    next();
  } catch (error) {
    console.log(error);
  }
});

// routes config
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const productRouter = require("./routes/products");
const shopRouter = require("./routes/shop");
app.use("/shops", shopRouter);
app.use("/products", productRouter);
app.use("/user", userRouter);
app.use("/", indexRouter);

// connecting database and server
const connectDB = require("./db/connect");

const hostname = "127.0.0.1";
const port = 8000;

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);

    app.listen(
      port,
      console.log(`Server is running at http://${hostname}:${port}`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
