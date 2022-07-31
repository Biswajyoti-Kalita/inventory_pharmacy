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
      "/pharmacies/addpharmacy_profile",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (req.body.regn_no === null || req.body.regn_no === undefined)
            return res.send({
              status: "error",
              message: " Regn No is required ",
            });

          if (req.body.address_1 === null || req.body.address_1 === undefined)
            return res.send({
              status: "error",
              message: " Address 1 is required ",
            });

          if (req.body.address_2 === null || req.body.address_2 === undefined)
            return res.send({
              status: "error",
              message: " Address 2 is required ",
            });

          if (req.body.city === null || req.body.city === undefined)
            return res.send({ status: "error", message: " City is required " });

          if (req.body.state === null || req.body.state === undefined)
            return res.send({
              status: "error",
              message: " State is required ",
            });

          if (req.body.zip === null || req.body.zip === undefined)
            return res.send({ status: "error", message: " Zip is required " });

          if (req.body.email === null || req.body.email === undefined)
            return res.send({
              status: "error",
              message: " Email is required ",
            });

          if (req.body.phone === null || req.body.phone === undefined)
            return res.send({
              status: "error",
              message: " Phone is required ",
            });

          if (req.body.owner_name === null || req.body.owner_name === undefined)
            return res.send({
              status: "error",
              message: " Owner Name is required ",
            });

          if (
            req.body.owner_email === null ||
            req.body.owner_email === undefined
          )
            return res.send({
              status: "error",
              message: " Owner Email is required ",
            });

          if (
            req.body.owner_contact === null ||
            req.body.owner_contact === undefined
          )
            return res.send({
              status: "error",
              message: " Owner Contact is required ",
            });

          await db.pharmacy_profile.create({
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
      "/pharmacies/updatepharmacy_profile",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const checkPharmacyProfileExist = await db.pharmacy_profile.findOne({
            where: {
              id: req.pharmacy_user_id,
            },
          });

          if (checkPharmacyProfileExist) {
            let obj = {
              name: req.body.name,
              regn_no: req.body.regn_no,
              address_1: req.body.address_1,
              address_2: req.body.address_2,
              city: req.body.city,
              state: req.body.state,
              zip: req.body.zip,
              email: req.body.email,
              phone: req.body.phone,
            };

            if (req.body.stripe_id) obj["stripe_id"] = req.body.stripe_id;
            await db.pharmacy_profile.update(obj, {
              where: {
                id: req.pharmacy_user_id,
              },
            });
            res.send({
              status: "success",
              message: "done",
            });
          } else {
            return res.send({
              status: "error",
              message: "Pharmacy profile not found",
            });
          }
        } catch (error) {
          res.send({
            status: "error",
            message: error,
          });
        }
      }
    );

    app.post(
      "/pharmacies/deletepharmacy_profile",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
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
      "/pharmacies/bulkdeletepharmacy_profile",
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
      "/pharmacies/getpharmacy_profiles",
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

        if (req.body.name != null) where["name"] = req.body.name;

        if (req.body.regn_no != null) where["regn_no"] = req.body.regn_no;

        try {
          const pharmacy_profiles = await db.pharmacy_profile.findAndCountAll({
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
      "/pharmacies/getpharmacy_profile",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const pharmacy_profile = await db.pharmacy_profile.findOne({
            where: {
              id: req.pharmacy_user_id,
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
              "stripe_id",
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
