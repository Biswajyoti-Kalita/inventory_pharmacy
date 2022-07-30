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

    const role = 1;
    app.post(
      "/pharmacies/change_password",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          console.log("received ", req.body);
          if (req.body.password === null || req.body.password === undefined)
            return res.send({
              status: "error",
              message: " Password is required ",
            });

          if (
            req.body.confirm_password === null ||
            req.body.confirm_password === undefined
          )
            return res.send({
              status: "error",
              message: " Confirm password is required ",
            });
          if (req.body.password.length < 5) {
            return res.send({
              status: "error",
              message: "Please enter password of minimum 5 character ",
            });
          }

          if (req.body.password != req.body.confirm_password) {
            return res.send({
              status: "error",
              message: "Password didn't match",
            });
          }
          const hashPassword = await passwordService.hashPassword(
            req.body.password
          );
          console.log(req.body.password, hashPassword);
          await db.user.update(
            {
              password: hashPassword,
            },
            {
              where: {
                id: req.user_id,
              },
            }
          );

          res.send({
            status: "success",
            message: "Password updated successfully",
          });
        } catch (error) {
          console.log(error);
          res.send({
            status: "error",
            message: error,
          });
        }
      }
    );
  },
};
