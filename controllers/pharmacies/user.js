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
      "/pharmacies/adduser",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const role_id = 1,
            is_owner = 0,
            pharmacy_user_id = req.user_id;

          if (req.body.first_name === null || req.body.first_name === undefined)
            return res.send({
              status: "error",
              message: " First Name is required ",
            });

          if (req.body.email === null || req.body.email === undefined)
            return res.send({
              status: "error",
              message: " Email is required ",
            });

          if (req.body.password === null || req.body.password === undefined)
            return res.send({
              status: "error",
              message: " Password is required ",
            });

          await db.user.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name ? req.body.last_name : "",
            phone: req.body.phone ? req.body.phone : "",
            email: req.body.email,
            role_id: role_id,
            permissions: req.body.permissions ? req.body.permissions : "",
            is_owner: is_owner,
            pharmacy_user_id: pharmacy_user_id,
            username: randomstring.generate(),
            password: await passwordService.hashPassword(req.body.password),
          });
          res.send({
            status: "success",
            message: "done",
          });
        } catch (error) {
          res.send({
            status: "error",
            message: error,
          });
        }
      }
    );

    app.post(
      "/pharmacies/updateuser",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          let obj = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone: req.body.phone,
            email: req.body.email,
            permissions: req.body.permissions,
          };
          let password = req.body.password;

          if (password && (password != null || password != undefined)) {
            if (password.length >= 5) {
              obj["password"] = await passwordService.hashPassword(password);
            } else {
              return res.send({
                status: "error",
                message: "Please enter password of min 5 characters ",
              });
            }
          }

          await db.user.update(obj, {
            where: {
              id: req.body.id,
            },
          });
          res.send({
            status: "success",
            message: "done",
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

    app.post(
      "/pharmacies/deleteuser",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          await db.user.destroy({
            where: {
              id: req.body.id,
            },
          });
          res.send({
            status: "success",
            message: "Deleted Successfully",
          });
        } catch (error) {
          res.send({
            status: "error",
            message: error,
          });
        }
      }
    );

    app.post(
      "/pharmacies/bulkdeleteuser",
      roleService.verifyRole(role),
      async function (req, res) {
        if (!req.body.ids || !Array.isArray(req.body.ids)) {
          return res.send({
            status: "error",
            message: "Please send ids as array",
          });
        }

        try {
          await db.user.destroy({
            where: {
              id: {
                [Op.in]: req.body.ids,
              },
            },
          });
          res.send({
            status: "success",
            message: "Deleted Successfully",
          });
        } catch (error) {
          res.send({
            status: "error",
            message: error,
          });
        }
      }
    );

    app.post(
      "/pharmacies/getusers",
      roleService.verifyRole(role),
      async function (req, res) {
        let where = {
          [Op.or]: [
            {
              pharmacy_user_id: req.user_id,
            },
            {
              id: req.user_id,
              is_owner: 1,
            },
          ],
        };
        const order = req.body.order ? req.body.order : "id";
        const order_by = req.body.order_by ? req.body.order_by : "DESC";
        let order_arr = [];

        if (order.indexOf(".") >= 0) {
          const tempArr = order.split(".");
          tempArr.push(order_by);
          order_arr = [tempArr];
        } else {
          order_arr = [[order, order_by]];
        }

        if (req.body.first_name != null)
          where["first_name"] = req.body.first_name;

        if (req.body.last_name != null) where["last_name"] = req.body.last_name;

        if (req.body.phone != null) where["phone"] = req.body.phone;

        if (req.body.email != null) where["email"] = req.body.email;

        if (req.body.password != null) where["password"] = req.body.password;

        if (req.body.role_id != null) where["role_id"] = req.body.role_id;

        try {
          const users = await db.user.findAndCountAll({
            where: where,
            offset: req.body.offset ? +req.body.offset : null,
            limit: req.body.limit ? +req.body.limit : 25,
            order: order_arr,
            include: [],
          });
          res.send(users);
        } catch (error) {
          console.log(error);
          res.send({
            status: "error",
            message: "Something went wrong",
          });
        }
      }
    );

    app.post(
      "/pharmacies/getuser",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const user = await db.user.findOne({
            where: {
              id: req.body.id,
            },
            include: [],
            attributes: [
              "id",
              "first_name",
              "last_name",
              "phone",
              "email",
              "password",
              "role_id",
              "permissions",
              "is_owner",
              "pharmacy_user_id",
            ],
          });
          res.send(user);
        } catch (error) {
          console.log(error);
          res.send({
            status: "error",
            message: "Something went wrong",
          });
        }
      }
    );

    app.post(
      "/pharmacies/get_user_permissions",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const user = await db.user.findOne({
            where: {
              id: req.user_id,
            },
            include: [],
            attributes: ["is_owner", "permissions"],
          });
          res.send(user);
        } catch (error) {
          console.log(error);
          res.send({
            status: "error",
            message: "Something went wrong",
          });
        }
      }
    );
  },
};
