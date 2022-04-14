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
      "/pharmacies/addvendor",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (req.body.name === null || req.body.name === undefined)
            return res.send({ status: "error", message: " Name is required " });

          if (
            req.body.vendor_code === null ||
            req.body.vendor_code === undefined
          )
            return res.send({
              status: "error",
              message: " Vendor Code is required ",
            });

          if (
            req.body.street_address_1 === null ||
            req.body.street_address_1 === undefined
          )
            return res.send({
              status: "error",
              message: " Street Address 1 is required ",
            });

          if (
            req.body.street_address_2 === null ||
            req.body.street_address_2 === undefined
          )
            return res.send({
              status: "error",
              message: " Street Address 2 is required ",
            });

          if (req.body.city === null || req.body.city === undefined)
            return res.send({ status: "error", message: " City is required " });

          if (req.body.state === null || req.body.state === undefined)
            return res.send({
              status: "error",
              message: " State is required ",
            });

          if (req.body.country === null || req.body.country === undefined)
            return res.send({
              status: "error",
              message: " Country is required ",
            });

          if (req.body.zip === null || req.body.zip === undefined)
            return res.send({ status: "error", message: " Zip is required " });

          await db.vendor.create({
            user_id: req.pharmacy_user_id,
            name: req.body.name,

            vendor_code: req.body.vendor_code,

            street_address_1: req.body.street_address_1,

            street_address_2: req.body.street_address_2,

            city: req.body.city,

            state: req.body.state,

            country: req.body.country,

            zip: req.body.zip,
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
      "/pharmacies/updatevendor",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          await db.vendor.update(
            {
              name: req.body.name,

              vendor_code: req.body.vendor_code,

              street_address_1: req.body.street_address_1,

              street_address_2: req.body.street_address_2,

              city: req.body.city,

              state: req.body.state,

              country: req.body.country,

              zip: req.body.zip,
            },
            {
              where: {
                id: req.body.id,

                user_id: req.pharmacy_user_id,
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
      "/pharmacies/deletevendor",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          await db.vendor.destroy({
            where: {
              id: req.body.id,

              user_id: req.pharmacy_user_id,
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
      "/pharmacies/bulkdeletevendor",
      roleService.verifyRole(role),
      async function (req, res) {
        if (!req.body.ids || !Array.isArray(req.body.ids)) {
          return res.send({
            status: "error",
            message: "Please send ids as array",
          });
        }

        try {
          await db.vendor.destroy({
            where: {
              id: {
                [Op.in]: req.body.ids,
              },

              user_id: req.pharmacy_user_id,
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
      "/pharmacies/getvendors",
      roleService.verifyRole(role),
      async function (req, res) {
        let where = {
          user_id: req.pharmacy_user_id,
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

        if (req.body.name != null) where["name"] = req.body.name;

        if (req.body.vendor_code != null)
          where["vendor_code"] = req.body.vendor_code;

        if (req.body.street_address_1 != null)
          where["street_address_1"] = req.body.street_address_1;

        if (req.body.street_address_2 != null)
          where["street_address_2"] = req.body.street_address_2;

        if (req.body.city != null) where["city"] = req.body.city;

        if (req.body.state != null) where["state"] = req.body.state;

        if (req.body.country != null) where["country"] = req.body.country;

        if (req.body.zip != null) where["zip"] = req.body.zip;

        try {
          const vendors = await db.vendor.findAndCountAll({
            where: where,
            offset: req.body.offset ? +req.body.offset : null,
            limit: req.body.limit ? +req.body.limit : 25,
            order: order_arr,
            include: [],
          });
          res.send(vendors);
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
      "/pharmacies/getvendor",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const vendor = await db.vendor.findOne({
            where: {
              id: req.body.id,

              user_id: req.pharmacy_user_id,
            },
            include: [],
            attributes: [
              "id",
              "name",
              "vendor_code",
              "street_address_1",
              "street_address_2",
              "city",
              "state",
              "country",
              "zip",
            ],
          });
          res.send(vendor);
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
