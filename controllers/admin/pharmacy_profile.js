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

    const role = 0;
    app.post(
      "/admin/addpharmacy_profile",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (req.body.name === null || req.body.name === undefined)
            return res.send({
              status: "error",
              message: "Name is required ",
            });

          if (req.body.owner_name === null || req.body.owner_name === undefined)
            return res.send({
              status: "error",
              message: " Owner Name is required ",
            });

          await db.pharmacy_profile.create({
            name: req.body.name,
            regn_no: req.body.regn_no ? req.body.regn_no : "",
            address_1: req.body.address_1 ? req.body.address_1 : "",
            address_2: req.body.address_2 ? req.body.address_2 : "",
            city: req.body.city ? req.body.city : "",
            state: req.body.state ? req.body.state : "",
            zip: req.body.zip ? req.body.zip : "",
            email: req.body.email ? req.body.email : "",
            phone: req.body.phone ? req.body.phone : "",
            owner_name: req.body.owner_name ? req.body.owner_name : "",
            owner_email: req.body.owner_email ? req.body.owner_email : "",
            owner_contact: req.body.owner_contact ? req.body.owner_contact : "",
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
      "/admin/updatepharmacy_profile",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (req.body.id == null || req.body.id == undefined) {
            return res.send({
              status: "error",
              message: "Id is required",
            });
          }
          await db.pharmacy_profile.update(
            {
              name: req.body.name,
              regn_no: req.body.regn_no,
              address_1: req.body.address_1,
              address_2: req.body.address_2,
              city: req.body.city,
              state: req.body.state,
              zip: req.body.zip,
              email: req.body.email,
              phone: req.body.phone,
              owner_name: req.body.owner_name,
              owner_email: req.body.owner_email,
              owner_contact: req.body.owner_contact,
            },
            {
              where: {
                id: req.body.id,
              },
            }
          );
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
      "/admin/deletepharmacy_profile",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (req.body.id == null || req.body.id == undefined) {
            return res.send({
              status: "error",
              message: "Id is required",
            });
          }

          await db.pharmacy_profile.destroy({
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
      "/admin/bulkdeletepharmacy_profile",
      roleService.verifyRole(role),
      async function (req, res) {
        if (!req.body.ids || !Array.isArray(req.body.ids)) {
          return res.send({
            status: "error",
            message: "Please send ids as array",
          });
        }

        try {
          await db.pharmacy_profile.destroy({
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
      "/admin/getpharmacy_profiles",
      roleService.verifyRole(role),
      async function (req, res) {
        let where = {};
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

        const { name, regn_no, email, phone } = req.body;

        if (name) {
          where = {
            ...where,
            name: {
              [Op.like]: "%" + name + "%",
            },
          };
        }
        if (regn_no) {
          where = {
            ...where,
            regn_no: {
              [Op.like]: "%" + regn_no + "%",
            },
          };
        }
        if (email) {
          where = {
            ...where,
            email: {
              [Op.like]: "%" + email + "%",
            },
          };
        }

        if (phone) {
          where = {
            ...where,
            phone: {
              [Op.like]: "%" + phone + "%",
            },
          };
        }
        //        if (req.body.regn_no != null) where["regn_no"] = req.body.regn_no;

        try {
          const pharmacy_profiles = await db.pharmacy_profile.findAll({
            where: where,
            offset: req.body.offset ? +req.body.offset : null,
            limit: req.body.limit ? +req.body.limit : 25,
            order: order_arr,
            include: [],
          });
          res.send(pharmacy_profiles);
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
      "/admin/getpharmacy_profile",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const { id } = req.body;

          if (id === null || id === undefined)
            return res.send({
              status: "error",
              message: " ID is required ",
            });

          const pharmacy_profile = await db.pharmacy_profile.findOne({
            where: {
              id: req.body.id,
            },
            include: [],
            attributes: [
              "id",
              "name",
              "regn_no",
              "address_1",
              "address_2",
              "city",
              "state",
              "zip",
              "email",
              "phone",
              "owner_name",
              "owner_email",
              "owner_contact",
            ],
          });
          res.send(pharmacy_profile);
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
