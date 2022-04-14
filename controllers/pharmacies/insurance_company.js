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
      "/pharmacies/addinsurance_company",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (
            req.body.company_name === null ||
            req.body.company_name === undefined
          )
            return res.send({
              status: "error",
              message: " Company Name is required ",
            });

          if (req.body.company_id === null || req.body.company_id === undefined)
            return res.send({
              status: "error",
              message: " Company Id is required ",
            });

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

          if (req.body.zip === null || req.body.zip === undefined)
            return res.send({ status: "error", message: " Zip is required " });

          if (req.body.country === null || req.body.country === undefined)
            return res.send({
              status: "error",
              message: " Country is required ",
            });

          await db.insurance_company.create({
            company_name: req.body.company_name,
            company_id: req.body.company_id,
            email: req.body.email,
            phone: req.body.phone,
            street_address_1: req.body.street_address_1,
            street_address_2: req.body.street_address_2,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            country: req.body.country,
            user_id: +req.pharmacy_user_id,
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
      "/pharmacies/updateinsurance_company",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          await db.insurance_company.update(
            {
              company_name: req.body.company_name,

              company_id: req.body.company_id,

              email: req.body.email,

              phone: req.body.phone,

              street_address_1: req.body.street_address_1,

              street_address_2: req.body.street_address_2,

              city: req.body.city,

              state: req.body.state,

              zip: req.body.zip,

              country: req.body.country,
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
      "/pharmacies/deleteinsurance_company",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          await db.insurance_company.destroy({
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
      "/pharmacies/bulkdeleteinsurance_company",
      roleService.verifyRole(role),
      async function (req, res) {
        if (!req.body.ids || !Array.isArray(req.body.ids)) {
          return res.send({
            status: "error",
            message: "Please send ids as array",
          });
        }

        try {
          await db.insurance_company.destroy({
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
      "/pharmacies/getall_insurance_companies",
      roleService.verifyRole(role),
      async function (req, res) {
        let where = {
          user_id: +req.pharmacy_user_id,
        };

        try {
          const insurance_companys = await db.insurance_company.findAll({
            where: where,
          });
          res.send(insurance_companys);
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
      "/pharmacies/getinsurance_companies",
      roleService.verifyRole(role),
      async function (req, res) {
        let where = {
          user_id: +req.pharmacy_user_id,
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

        if (req.body.company_name != null)
          where["company_name"] = req.body.company_name;

        try {
          const insurance_companys = await db.insurance_company.findAndCountAll(
            {
              where: where,
              offset: req.body.offset ? +req.body.offset : null,
              limit: req.body.limit ? +req.body.limit : 25,
              order: order_arr,
              include: [],
            }
          );
          res.send(insurance_companys);
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
      "/pharmacies/getinsurance_company",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const insurance_company = await db.insurance_company.findOne({
            where: {
              id: req.body.id,
              user_id: +req.pharmacy_user_id,
            },
            include: [],
            attributes: [
              "id",
              "company_name",
              "company_id",
              "email",
              "phone",
              "street_address_1",
              "street_address_2",
              "city",
              "state",
              "zip",
              "country",
            ],
          });
          res.send(insurance_company);
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
