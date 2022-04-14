var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var Sequelize = require("sequelize");
var passport = require("passport");
const fileUpload = require("express-fileupload");
var session = require("express-session");
var xss = require("xss-clean");
require("iconv-lite");
var debug = require("debug")("nodetest1:server");
var http = require("http");
var app = express();
var db = require("./models");
var securedRoutes = express.Router();
var tutorRoutes = express.Router();
var jwt = require("jsonwebtoken");
require("dotenv").config();

app.set("trust proxy", 1); // trust first proxy
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(
  session({
    secret: "f90ZFPYAvKfFS1EZIs",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
// app.use(helmet());

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: process.env.DB_DIALECT,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));
app.use(logger("dev"));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(xss());
app.use(fileUpload());
app.use(cookieParser());
app = require("./controllers")(app);

module.exports = app;
