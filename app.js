const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");

// environment variables
require("dotenv").config();

// Middleware
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.set("view engine", "ejs");

// routes
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
      process.env.PORT || port,
      console.log(`Server is running at http://${hostname}:${port}`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
