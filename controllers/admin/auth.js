"use strict";
var express = require("express");
var router = express.Router();
var passport = require("passport");
var app = express();
app.use(passport.initialize());
app.use(passport.session());
var randomstring = require("randomstring");
var jwt = require("jsonwebtoken");
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
var db = require("./../../models");
var file_upload = require("./../../services/upload");
var roleService = require("./../../services/roleService");
var passwordService = require("./../../services/passwordService");

module.exports = {
  initializeApi: function (app) {
    const basic_attributes = ["createdAt", "updatedAt"];

    app.post("/admin/login", async function (req, res) {
      try {
        const { email, password } = req.body;
        const user = await db.user.findOne({
          where: {
            email: email,
            role_id: 0,
          },
          raw: true,
        });

        if (!user) {
          return res.send({
            status: "error",
            message: "Email ID does not exist",
          });
        }

        const isSame = await passwordService.comparePassword(
          password,
          user.password
        );

        if (isSame) {
          delete user["password"];
          var token = jwt.sign(user, process.env.SECRET_KEY, {});
          res.send({
            status: "success",
            token: token,
            redirect: "/admin/user.html",
          });
        } else {
          res.send({
            status: "error",
            message: "Email ID and password does not match",
          });
        }
      } catch (error) {
        console.log(error);
        res.send({
          status: "error",
          message: error,
        });
      }
    });
  },
};
