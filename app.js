const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");

require("dotenv").config();

//setting middleware
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.set("view engine", "ejs");

//routes config
const indexRouter = require("./routes/index");
const loginRouter = require("./routes/login");
const productRouter = require("./routes/products");
app.use("/products", productRouter);
app.use("/user", loginRouter);
app.use("/", indexRouter);

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
